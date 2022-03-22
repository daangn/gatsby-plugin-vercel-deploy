import * as path from 'path';
import * as fs from 'fs';
import type {
  GatsbyConfig,
  GatsbyNode,
  Reporter,
} from 'gatsby';
import type {
  PluginOptions,
  HeadersDefinition,
  RedirectDefinition,
} from './types';

export const pluginOptionsSchema: GatsbyNode['pluginOptionsSchema'] = ({
  Joi,
}) => {
  return Joi.object({
    headers: Joi.array().items(
      Joi.object({
        source: Joi.string().required(),
        headers: Joi.array().items(
          Joi.object({
            key: Joi.string().required(),
            value: Joi.string().required(),
          }),
        ).default([]),
      }),
    ).default([]),
  });
};

export const onPostBuild: GatsbyNode['onPostBuild'] = async ({
  store,
  reporter,
}, pluginOptions) => {
  const { headers } = pluginOptions as unknown as Required<PluginOptions>;
  const { program, config, redirects = [] } = store.getState();
  const { trailingSlash = 'legacy' } = config as GatsbyConfig;

  const publicDir = path.resolve(program.directory, 'public');
  const outputPath = path.resolve(publicDir, 'vercel.json');

  if (redirects.length > 1024) {
    reporter.panicOnBuild(`Vercel supports redirects up to 1024, but got ${redirects.length}`);
  }

  type VercelConfig = {
    trailingSlash: boolean,
    headers: HeadersDefinition[],
    redirects: RedirectDefinition[],
  };
  const vercelConfig: VercelConfig = {
    headers,
    trailingSlash: true,
    redirects: redirects.map(transformRedirect({ reporter })),
  };
  if (trailingSlash === 'never') {
    vercelConfig.trailingSlash = false;
  }

  await fs.promises.writeFile(
    outputPath,
    JSON.stringify(vercelConfig, null, 2),
    'utf-8',
  );
};

type Context = {
  reporter: Reporter,
};

type GatsbyRedirectMetadata = {
  fromPath: string,
  toPath: string,
  isPermanent?: boolean,
  statusCode?: number,
};

const transformRedirect = ({
  reporter,
}: Context) => ({
  fromPath,
  toPath,
  isPermanent = false,
  statusCode = 308,
}: GatsbyRedirectMetadata): RedirectDefinition => {
  switch (statusCode) {
    case 301:
      statusCode = 307;
      reporter.warn('fallback 301 redirection to 307');
      break;
    case 302:
      statusCode = 308;
      reporter.warn('fallback 302 redirection to 308');
      break;
    case 307:
    case 308:
      break;
    default:
      reporter.panicOnBuild(`Vercel redirects only support 307 or 308 for status code, but got ${statusCode}`);
  }

  return {
    source: fromPath,
    destination: toPath,
    permanent: isPermanent,
  };
}

# gatsby-plugin-vercel-deploy
[![NPM package](https://img.shields.io/npm/v/gatsby-plugin-vercel-deploy)](https://www.npmjs.com/package/gatsby-plugin-vercel-deploy)
[![MIT Licensed](https://img.shields.io/github/license/daangn/gatsby-plugin-vercel-deploy)](#license)

Automatically generate [`vercel.json`](https://vercel.com/docs/project-configuration) from the gatsby project.

## Install & Usage

```bash
yarn add gatsby-plugin-vercel-deploy
```

And add plugin to the `gatsby-config.js`

```js
{
  plugins: [
    'gatsby-plugin-vercel-deploy',
  ],
}
```

### Custom headers

You can define [custom headers](https://vercel.com/docs/project-configuration#project-configuration/headers) via plugin options.

```js
{
  plugins: [
    {
      resolve: 'gatsby-plugin-vercel-deploy',
      options: {
        headers: {
          source: '/service-worker.js',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=0, must-revalidate',
            },
          ],
        },
        {
          source: '/(.*)',
          headers: [
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'X-Frame-Options',
              value: 'DENY',
            },
            {
              key: 'X-XSS-Protection',
              value: '1; mode=block',
            },
          ],
        },
      },
    },
  ],
}
```

## LICENSE

MIT

export type PluginOptions = {
  headers?: HeadersDefinition[],
};

export type HeadersDefinition = {
  source: string,
  headers: string[],
};

export type RedirectDefinition = {
  source: string,
  destination: string,
  permanent: boolean,
};

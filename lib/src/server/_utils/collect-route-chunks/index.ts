type ParamsType = {
  chunks: Record<
    string,
    { js: Array<string>; css: Array<string>; inlineCss: string }
  >;
  routeChunks: Array<string>;
  withInlineCss?: boolean;
};

type OutputType = {
  styles: Array<string>;
  scripts: Array<string>;
  inlineStyles: string;
};

export const collectRouteChunks = ({
  chunks,
  routeChunks,
  withInlineCss,
}: ParamsType): OutputType =>
  routeChunks.reduce(
    (acc, chunkName) => {
      const chunksForRoute = chunks[chunkName];

      if (chunksForRoute) {
        if (chunksForRoute.js) {
          acc.scripts = [...acc.scripts, ...chunksForRoute.js];
        }

        if (chunksForRoute.css) {
          acc.styles = [...acc.styles, ...chunksForRoute.css];
        }

        if (chunksForRoute.inlineCss && withInlineCss) {
          acc.inlineStyles = `${acc.inlineStyles}${chunksForRoute.inlineCss}`;
        }
      }

      return acc;
    },
    {
      styles: chunks.client.css,
      scripts: chunks.client.js,
      inlineStyles: '',
    },
  );

/* eslint-disable react/jsx-props-no-spreading */
import { ServerResponse } from 'http';
import { renderToStaticMarkup } from 'react-dom/server';
import { getClientEnvs as getClientGlobalEnvs } from '@/_utils/collect-envs/get-client-envs';
import { SPAHtml } from '@/_components/html/_components/spa-html';
import chunks from './chunk-manifest.json'; // eslint-disable-line import/no-unresolved

const isProduction = process.env.NODE_ENV === 'production';

type ParamsType = {
  response: ServerResponse;
};

// нужно чтобы html был для всех страниц один для кэширования на уровне service worker
export const spaMode = ({ response }: ParamsType) => {
  const { clientStringifiedEnvs } = getClientGlobalEnvs();

  const contentHTML = renderToStaticMarkup(
    <SPAHtml
      clientEnvs={clientStringifiedEnvs}
      scripts={chunks.client.js}
      styles={chunks.client.css}
    />,
  );

  const html = `<!doctype html>${contentHTML}`;

  if (isProduction) {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(html);
    response.end();
  } else {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    response.send(html);
  }
};

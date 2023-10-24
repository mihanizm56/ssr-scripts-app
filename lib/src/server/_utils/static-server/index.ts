import path from 'path';
import { IncomingMessage, ServerResponse } from 'http';
import { readFile } from 'fs/promises';
import { getFullUrl } from '../get-cache-key';
import { CONTENT_TYPES } from './_constants';

export const pureStaticServer = async ({
  request,
  response,
}: {
  request: IncomingMessage;
  response: ServerResponse;
}) => {
  const { pathname } = getFullUrl(request);

  const isDisabledCache = /(manifest\.json)|(sw\.js)|(assetlinks\.json)/.test(
    pathname,
  );

  const filePath = path.join(__dirname, pathname);

  const extname = path.extname(filePath);

  const contentType = CONTENT_TYPES[extname] ?? CONTENT_TYPES.html;

  try {
    const file = await readFile(filePath);

    // Cache headers
    if (isDisabledCache) {
      response.setHeader('Cache-Control', 'no-store');
    } else {
      response.setHeader('Cache-Control', 'public, max-age=31536000');
    }

    // CORS headers
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET');
    response.setHeader('Access-Control-Allow-Headers', '*');

    response.writeHead(200, { 'Content-Type': contentType });
    response.end(file, 'utf-8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      response.writeHead(404);
      response.end();

      return;
    }

    response.writeHead(500);
    response.end();
  }
};

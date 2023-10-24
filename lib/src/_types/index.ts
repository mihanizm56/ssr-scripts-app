import { IncomingMessage, ServerResponse } from 'http';
import { Express } from 'express';

export type IApplicationServer = (
  request: IncomingMessage,
  response: ServerResponse,
  devServer?: Express,
) => void;

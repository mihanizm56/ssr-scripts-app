import { Request, Response } from 'express';
import PrettyError from 'pretty-error';

const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

export const errors = (
  err: {
    title: string;
    name: string;
    message: string;
    stack: string;
    status?: number;
  },
  req: Request,
  res: Response,
) => {
  console.error(pe.render(err));

  res.status(err.status || 500);
  res.send('<!doctype html><html><body><h1>Error</h1></body></html>');
};

import { Response, Request } from 'express';
import Cookie from 'cookie-universal';

export * from './_constants';
export * from './_types';
export * from './_utils';
export * from './_components';

export const configureCookies = (req?: Request, res?: Response): any =>
  req && res ? Cookie(req, res) : Cookie();

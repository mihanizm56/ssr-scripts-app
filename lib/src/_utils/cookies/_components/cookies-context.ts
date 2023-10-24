import { createContext } from 'react';
import { ICookies } from '../_types';

export const CookiesContext: React.Context<ICookies> = createContext(null);

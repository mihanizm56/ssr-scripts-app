import { IncomingMessage } from 'http';

type ParamsType = {
  locale: string;
  request: IncomingMessage;
  isMobile: boolean;
};

export const getFullUrl = (request: IncomingMessage) => {
  try {
    return new URL(`https://${request.headers.host}${request.url}`);
  } catch (error) {
    console.error(error);

    // fallback
    return new URL('https://localhost');
  }
};

export const getCacheKey = ({ locale, isMobile, request }: ParamsType) => {
  const mobileKey = isMobile ? 'mobile' : 'desktop';

  // формируем ключ кэша по url
  const fullUrl = getFullUrl(request);

  return `${mobileKey}-${fullUrl}-${locale}`;
};

import React, { PropsWithChildren } from 'react';
import { serialize } from '../../_utils/serialize';

export type PropsType = PropsWithChildren<{
  req?: any;
  title: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogDescription?: string;
  ogUrl?: string;
  ogImage?: string;
  styles?: string[];
  inlineStyles?: string;
  scripts?: string[];
  ssrData?: Record<string, any>;
  clientEnvs: string;
}>;

export const Html = ({
  title,
  description,
  keywords,
  canonical,
  ogDescription,
  ogUrl,
  ogImage,
  scripts,
  ssrData,
  children,
  clientEnvs,
  inlineStyles,
}: PropsType) => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta content="ie=edge" httpEquiv="x-ua-compatible" />
      <meta
        content="width=device-width, maximum-scale=1, initial-scale=1, user-scalable=0"
        name="viewport"
      />

      <title>{title}</title>

      <style
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `
            @font-face {
              font-display: swap;
              font-family: "lato";
              font-style: normal;
              font-weight: 700;
              src: url("/static/fonts/LatoRegular.woff2") format("woff2");
            }
            `,
        }}
      />

      <link
        as="font"
        crossOrigin="anonymous"
        href="/static/fonts/LatoRegular.woff2"
        rel="preload"
        type="font/woff2"
      />

      <style
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: inlineStyles,
        }}
      />

      {description && <meta content={description} name="description" />}
      {keywords && <meta content={keywords} name="keywords" />}
      {canonical && <link href={canonical} rel="canonical" />}

      {/* Мета теги Open Graph */}
      <meta content={title} property="og:title" />
      {ogDescription && (
        <meta content={description} property="og:description" />
      )}
      {ogUrl && <meta content={ogUrl} property="og:url" />}
      {ogImage && <meta content={ogImage} property="og:image" />}

      {scripts.map(script => (
        <link key={script} as="script" href={script} rel="preload" />
      ))}
      <link href="/static/favicon.ico" rel="shortcut icon" type="image/png" />

      <script
        // env переменные доступные на клиенте
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `
            window.env = {
              ${clientEnvs}
            };
          `,
        }}
      />
      <script
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `window.ssrData = ${serialize(ssrData)};`,
        }}
      />
    </head>
    <body>
      <div id="root">{children}</div>

      {scripts.map(script => (
        <script key={script} src={script} />
      ))}
    </body>
  </html>
);

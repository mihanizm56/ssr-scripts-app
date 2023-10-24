/* eslint-disable react/forbid-dom-props */

import { PropsWithChildren } from 'react';

export type PropsType = PropsWithChildren<{
  scripts: string[];
  styles: string[];
  clientEnvs: string;
}>;

export const SPAHtml = ({
  scripts,
  children,
  clientEnvs,
  styles,
}: PropsType) => (
  // eslint-disable-next-line jsx-a11y/lang
  <html lang="ru">
    <head>
      <meta charSet="utf-8" />
      <meta content="ie=edge" httpEquiv="x-ua-compatible" />
      <meta
        content="width=device-width, maximum-scale=1, initial-scale=1, user-scalable=0"
        name="viewport"
      />
      {/* https://n8finch.com/disable-phone-number-linking-ios-safari */}

      <meta content="telephone=no" name="format-detection" />
      <meta content="#ffffff" name="theme-color" />

      {/* Предзагрузка стилей */}
      {styles.map((style) => (
        <link key={style} as="style" href={style} rel="preload" />
      ))}

      {/* Обращение к стилям */}
      {styles.map((style) => (
        <link key={style} href={style} rel="stylesheet" />
      ))}

      {/* Обращение к скриптам */}
      {scripts.map((script) => (
        <link key={script} as="script" href={script} rel="preload" />
      ))}

      <script
        // env переменные доступные на клиенте
        dangerouslySetInnerHTML={{
          __html: `
            window.env = {
              ${clientEnvs}
            };
          `,
        }}
      />
    </head>
    <body>
      <div id="root">{children}</div>

      {scripts.map((script) => (
        <script key={script} src={script} />
      ))}
    </body>
  </html>
);

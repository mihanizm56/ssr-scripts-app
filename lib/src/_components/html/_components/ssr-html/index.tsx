/* eslint-disable react/forbid-dom-props */

export type SSRHtmlPropsType = {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogDescription?: string;
  ogUrl?: string;
  ogImage?: string;
  styles: string[];
  lang?: string;
  ssrFormattedData?: string;
  children: string;
  scripts?: string[];
  clientEnvs?: string;
  inlineStyles?: string;
};

export const SSRHtml = ({
  title,
  description,
  keywords,
  canonical,
  ogDescription,
  ogUrl,
  ogImage,
  lang = 'en',
  styles,
  ssrFormattedData,
  children,
  scripts,
  clientEnvs,
  inlineStyles,
}: SSRHtmlPropsType) => {
  return (
    // eslint-disable-next-line jsx-a11y/lang
    <html lang={lang}>
      <head>
        <meta charSet="utf-8" />
        <meta content="ie=edge" httpEquiv="x-ua-compatible" />
        <meta
          content="width=device-width, maximum-scale=1, initial-scale=1, user-scalable=0"
          name="viewport"
        />
        {/* https://n8finch.com/disable-phone-number-linking-ios-safari */}

        {/* Мета теги Open Graph */}
        {title && <meta content={title} property="og:title" />}
        {ogDescription && (
          <meta content={description} property="og:description" />
        )}
        {ogUrl && <meta content={ogUrl} property="og:url" />}
        {ogImage && <meta content={ogImage} property="og:image" />}
        {description && <meta content={description} name="description" />}
        {keywords && <meta content={keywords} name="keywords" />}
        {canonical && <link href={canonical} rel="canonical" />}

        {/* Предзагрузка стилей */}
        {!inlineStyles &&
          styles.map((style) => (
            <link key={style} as="style" href={style} rel="preload" />
          ))}

        {/* Обращение к стилям */}
        {!inlineStyles &&
          styles.map((style) => (
            <link key={style} href={style} rel="stylesheet" />
          ))}

        {/* Обращение к скриптам */}
        {scripts?.map?.((script) => (
          <link key={script} as="script" href={script} rel="preload" />
        ))}

        {ssrFormattedData && (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.ssrData = ${ssrFormattedData};`,
            }}
          />
        )}

        {clientEnvs && (
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
        )}

        {title && <title>{title}</title>}

        <link href="/static/manifest.json" rel="manifest" />

        {inlineStyles && (
          <style
            dangerouslySetInnerHTML={{
              __html: inlineStyles,
            }}
          />
        )}
      </head>
      <body>
        <div
          dangerouslySetInnerHTML={{
            __html: children,
          }}
          id="root"
        />

        {scripts?.map?.((script) => (
          <script key={script} src={script} />
        ))}
      </body>
    </html>
  );
};

# build
FROM mihanizm56/alexandragr-prebuild-image:3.0.12 as build-stage

# config files
COPY tsconfig.json tsconfig.json
COPY package.json package.json

# config dirs
COPY config/webpack config/webpack
COPY config/service-worker config/service-worker
COPY config/precommit-runner config/precommit-runner
COPY config/prerender-htmls config/prerender-htmls
COPY config/prerender-spa-html config/prerender-spa-html
COPY public public
COPY src src

RUN export NODE_OPTIONS=--openssl-legacy-provider && npm run build

# prerender spa html
RUN ["node","config/prerender-spa-html/bin.js"]

RUN ["node","config/service-worker"]

# runtime
FROM mihanizm56/alexandragr-postbuild-image:3.0.12 as runtime-stage


ENV API_SERVICE https://test.alexandragr.com/api
ENV BLOG_ENDPOINT /blog
ENV EMAILS_ENDPOINT /emails
ENV PRODUCTS_ENDPOINT /products
ENV METALS_ENDPOINT /metals
ENV CATEGORIES_ENDPOINT /categories
ENV JEWELS_ENDPOINT /jewels
ENV INSTA_ENDPOINT /instagram/latest_posts
ENV GET_COUNTRY_IP_ENDPOINT /ssr-api/country-ip
ENV MAIN_DOMAIN https://test.alexandragr.com

COPY --from=build-stage build build

COPY package.json package.json
COPY config/deploy config/deploy

# ports setup
ENV PORT 80
EXPOSE 80

CMD node build/server.js

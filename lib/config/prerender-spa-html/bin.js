/* eslint-disable no-console */
const { spawn } = require('child_process');
const kill = require('tree-kill');
const { prerenderHtml } = require('./prerender-html');

const sleep = (ms) =>
  new Promise((res) => {
    setTimeout(() => {
      res();
    }, ms);
  });

process.setMaxListeners(0);

const main = async () => {
  const child = spawn('node', ['build/server.js'], {
    shell: true,
    detached: true,
    env: {
      ...process.env,
      PRERENDER_SPA_GENERATE: 'true',
      API_SERVICE: 'https://alexandragr.com/api',
      BLOG_ENDPOINT: '/blog',
      EMAILS_ENDPOINT: '/emails',
      PRODUCTS_ENDPOINT: '/products',
      METALS_ENDPOINT: '/metals',
      CATEGORIES_ENDPOINT: '/categories',
      JEWELS_ENDPOINT: '/jewels',
      INSTA_ENDPOINT: '/instagram/latest_posts',
      GET_COUNTRY_IP_ENDPOINT: '/ssr-api/country-ip',
      MAIN_DOMAIN: 'https://alexandragr.com',
    },
  });

  await sleep(1000);

  try {
    await prerenderHtml();

    console.log('Root html is prerendered');

    kill(child.pid);
  } catch (error) {
    console.log('catch error', error);

    kill(child.pid);
    process.exit(1);
  }
};

main();

/* eslint-disable no-param-reassign */
const {
  getThreadLoaderConfig,
} = require('@mihanizm56/ssr-scripts/configs/webpack');
const { appPaths } = require('@mihanizm56/ssr-scripts/utils/paths');

module.exports = ([clientConfig, serverConfig]) => {
  const isProduction = clientConfig.mode === 'production';

  // aliases
  clientConfig.resolve = {
    ...clientConfig.resolve,
    alias: {
      '@': appPaths.src,
    },
  };
  serverConfig.resolve = clientConfig.resolve;

  return [clientConfig, serverConfig];
};

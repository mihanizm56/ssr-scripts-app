const path = require('path');

module.exports.getExecutionPaths = inputPath => ({
  pathToExecute: path.join(process.cwd(), inputPath),
  projectFolder: path.join(
    process.cwd(),
    'node_modules',
    'ssr-scripts-app',
    'lib',
  ),
  rootDir: path.join(process.cwd(), './'),
});

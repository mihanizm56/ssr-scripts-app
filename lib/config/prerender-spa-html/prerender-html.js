/* eslint-disable no-console */
const path = require('path');
const { rmdirSync, writeFileSync, mkdirSync, existsSync } = require('fs');

const prerenderHtml = async () => {
  console.log('Prerendering spa html');

  const pathToFolder = path.join(process.cwd(), 'build', 'static', 'html');

  const response = await fetch('http://localhost:3000');

  const html = await response.text();

  if (existsSync(pathToFolder)) {
    await rmdirSync(pathToFolder);
    await mkdirSync(pathToFolder, { recursive: true });
  } else {
    await mkdirSync(pathToFolder, { recursive: true });
  }

  await writeFileSync(path.join(pathToFolder, 'spa.html'), html);

  console.log('Prerendered spa html');
};

module.exports = {
  prerenderHtml,
};

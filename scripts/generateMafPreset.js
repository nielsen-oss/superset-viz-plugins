#!/bin/env node
/* eslint-disable no-console */
const fg = require('fast-glob');
const fs = require('fs-extra');

const buildStringFromPackage = async packages => {
  let importStringToWrite = '',
    pluginsStringToWrite = '';
  for (const pkg of packages) {
    const data = await fs.readFile(`./${pkg}/src/index.ts`, 'utf8');
    const pluginName = data.split('export { default as ')[1].split(' ')[0];
    importStringToWrite += `import {${pluginName}} from '${pkg.replace('plugins/', '@superset-maf-ui/')}';`;
    pluginsStringToWrite += `new ${pluginName}().configure({ key: '${pkg.replace('plugins/', '')}' }),`;
  }

  return { importStringToWrite, pluginsStringToWrite };
};
const pkgGlob = process.argv[2] || '*';

const packages = fg.sync([`plugins/${pkgGlob}`], {
  onlyDirectories: true,
});

const file = './MafPreset.ts';
let importStringToWrite = `import { Preset } from '@superset-ui/core';
import { DeckGLChartPreset } from '@superset-ui/legacy-preset-chart-deckgl';
`;
let pluginsStringToWrite = '';
buildStringFromPackage(packages).then(result => {
  importStringToWrite += result.importStringToWrite;
  pluginsStringToWrite += result.pluginsStringToWrite;
  const stringToWrite = `${importStringToWrite} 
export default class MafPreset extends Preset {
  constructor() {
    super({
      name: 'MAF charts',
      presets: [new DeckGLChartPreset()],
      plugins: [
        ${pluginsStringToWrite}
      ],
    });
  }
}
`;

  // With a callback:
  fs.outputFile(file, stringToWrite, err => {
    console.log(err); // => null
  });
});

#!/bin/env node
/* eslint-disable no-console */
const fg = require('fast-glob');
var child_process = require('child_process');

async function installPackages(packages) {
  for (const pkg of packages) {
    child_process.execSync(`npm install ${pkg.replace('plugins/', '@superset-maf-ui/')}`, { stdio: [0, 1, 2] });
  }
}

const pkgGlob = process.argv[2] || '*';

const packages = fg.sync([`plugins/${pkgGlob}`], {
  onlyDirectories: true,
});

installPackages(packages);

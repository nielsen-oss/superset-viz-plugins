# superset-viz-plugins
![release-workflow](https://github.com/nielsen-oss/superset-viz-plugins/workflows/release-workflow/badge.svg)

### Project Overview

#### Template repository
This repository is a [template repository](https://docs.github.com/en/free-pro-team@latest/github/creating-cloning-and-archiving-repositories/creating-a-repository-from-a-template) that enables you to create a custom set of plugins that by Github workflow process generate a ready to load docker image bundled with the plugins

#### Monorepo
This repository is using a monorepo strategy which lets us have one source of truth for ***many projects***. All the projects hosted here rely on the same tools.


#### Artifacts Deployment

  Npm pacakges are deployed [here](https://www.npmjs.com/search?q=%40superset-viz-plugins)

  Docker Image is deployed [here](https://hub.docker.com/r/nielsenoss/apache-superset)

### Project Stack

- [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/)
- [Lerna](https://github.com/lerna/lerna)
- [Typescript](https://www.typescriptlang.org/)
- [Babel](https://babeljs.io/)
- [Storybook](https://storybook.js.org/)
- [ESLint](https://eslint.org/)
- [Jest](https://jestjs.io/)
  
### Connection to superset-incubator

1. Replace `incubator-superset/superset-frontend/webpack.config.js` with [webpack.config.js](./docs/MANAGE_REPOSITORY.md)
   

2. Use [this](https://preset.io/blog/2020-07-02-hello-world/) tutorial to connect plugins to superset

### Plugins in repository

| Package                                                                                                                       | Version                                                                                                                                                         |
| ----------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [@superset-viz-plugins/plugin-chart-composed](https://github.com/nielsen-oss/superset-viz-plugins/tree/master/plugins/plugin-chart-composed)                     | [![Version](https://img.shields.io/npm/v/@superset-viz-plugins/plugin-chart-composed?style=flat-square)](https://www.npmjs.com/package/@superset-viz-plugins/plugin-chart-composed)                             |
| [@superset-viz-plugins/plugin-chart-waterfall](https://github.com/nielsen-oss/superset-viz-plugins/tree/master/plugins/plugin-chart-waterfall)                     | [![Version](https://img.shields.io/npm/v/@superset-viz-plugins/plugin-chart-composed?style=flat-square)](https://www.npmjs.com/package/@superset-viz-plugins/plugin-chart-waterfall)                             |
| [@superset-viz-plugins/plugin-chart-pie](https://github.com/nielsen-oss/superset-viz-plugins/tree/master/plugins/plugin-chart-pie)                     | [![Version](https://img.shields.io/npm/v/@superset-viz-plugins/plugin-chart-composed?style=flat-square)](https://www.npmjs.com/package/@superset-viz-plugins/plugin-chart-pie)                             |
| [@superset-viz-plugins/plugin-chart-pivot-table](https://github.com/nielsen-oss/superset-viz-plugins/tree/master/plugins/plugin-chart-pivot-table)                     | [![Version](https://img.shields.io/npm/v/@superset-viz-plugins/plugin-chart-composed?style=flat-square)](https://www.npmjs.com/package/@superset-viz-plugins/plugin-chart-pivot-table)                             |
| [@superset-viz-plugins/plugin-chart-status](https://github.com/nielsen-oss/superset-viz-plugins/tree/master/plugins/plugin-chart-status)                     | [![Version](https://img.shields.io/npm/v/@superset-viz-plugins/plugin-chart-composed?style=flat-square)](https://www.npmjs.com/package/@superset-viz-plugins/plugin-chart-status)                             |


### Additional docs:

[Manage Repository](./docs/MANAGE_REPOSITORY.md)
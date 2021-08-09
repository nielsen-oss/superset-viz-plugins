# superset-viz-plugins
![release-workflow](https://github.com/nielsen-oss/superset-viz-plugins/workflows/release-workflow/badge.svg)

### Guides
If you're looking for the fastest way to develop your Apache Superset custom plugin you have found it, here are the guides that will help you achieve that :
#### In short 
It is all about generating your own repository from this repository
https://github.com/nielsen-oss/superset-viz-plugins

#### In Long
https://www.youtube.com/watch?v=HNkPQtfzXK0

https://medium.com/nmc-techblog/apache-superset-manage-custom-viz-plugins-in-production-9fde1a708e55

evetually you’ll have your dockerFile automatically deployed to your dockerHub repository like this own

[Nielsen-oss Apache superset + custom plugins in a docker-image](https://hub.docker.com/repository/docker/nielsenoss/apache-superset?ref=login)

### Project Overview

#### Template repository
This repository is a [template repository](https://docs.github.com/en/free-pro-team@latest/github/creating-cloning-and-archiving-repositories/creating-a-repository-from-a-template) that enables you to create a custom set of plugins that by Github workflow process generate a ready to load docker image bundled with the plugins

#### Monorepo
This repository is using a monorepo strategy which lets us have one source of truth for ***many projects***. All the projects hosted here rely on the same tools.


#### Artifacts Deployment

- Npm packages are deployed [here](https://www.npmjs.com/search?q=%40superset-viz-plugins)
- Docker Image is deployed [here](https://hub.docker.com/r/nielsenoss/apache-superset)

  
### Connection to superset

1. Replace `superset/superset-frontend/webpack.config.js` with [webpack.config.js](./docs/webpack.config.js)
2. Use [this](https://preset.io/blog/2020-07-02-hello-world/) tutorial to connect plugins to superset


### Storybook examples (uses Chromatic)

- [Stories view](https://master--5fec4c81935a8c002151e85f.chromatic.com)
- [Library view](https://chromatic.com/library?appId=5fec4c81935a8c002151e85f&branch=master)

### Plugins in repository

| Package                                                                                                                       | Version                                                                                                                                                         |
| ----------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [@superset-viz-plugins/plugin-chart-composed](https://github.com/nielsen-oss/superset-viz-plugins/tree/master/plugins/plugin-chart-composed)                     | [![Version](https://img.shields.io/npm/v/@superset-viz-plugins/plugin-chart-composed?style=flat-square)](https://www.npmjs.com/package/@superset-viz-plugins/plugin-chart-composed)                             |
| [@superset-viz-plugins/plugin-chart-waterfall](https://github.com/nielsen-oss/superset-viz-plugins/tree/master/plugins/plugin-chart-waterfall)                     | [![Version](https://img.shields.io/npm/v/@superset-viz-plugins/plugin-chart-waterfall?style=flat-square)](https://www.npmjs.com/package/@superset-viz-plugins/plugin-chart-waterfall)                             |
| [@superset-viz-plugins/plugin-chart-pie](https://github.com/nielsen-oss/superset-viz-plugins/tree/master/plugins/plugin-chart-pie)                     | [![Version](https://img.shields.io/npm/v/@superset-viz-plugins/plugin-chart-pie?style=flat-square)](https://www.npmjs.com/package/@superset-viz-plugins/plugin-chart-pie)                             |
| [@superset-viz-plugins/plugin-chart-pivot-table](https://github.com/nielsen-oss/superset-viz-plugins/tree/master/plugins/plugin-chart-pivot-table)                     | [![Version](https://img.shields.io/npm/v/@superset-viz-plugins/plugin-chart-pivot-table?style=flat-square)](https://www.npmjs.com/package/@superset-viz-plugins/plugin-chart-pivot-table)                             |
| [@superset-viz-plugins/plugin-chart-status](https://github.com/nielsen-oss/superset-viz-plugins/tree/master/plugins/plugin-chart-status)                     | [![Version](https://img.shields.io/npm/v/@superset-viz-plugins/plugin-chart-status?style=flat-square)](https://www.npmjs.com/package/@superset-viz-plugins/plugin-chart-status)                             |


### Additional docs:

[Manage Repository](./docs/MANAGE_REPOSITORY.md)

import BarChartPlugin from './plugin';

// configure the chart with the package name from package.json
new BarChartPlugin().configure({ key: process.env.PACKAGE_NAME }).register();
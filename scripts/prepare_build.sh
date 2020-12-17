#!//bin/bash
set -e

#migrated from old repo, probably not needed
# yarn

echo $GITHUB_WORKSPACE

# Add dependencies superset-frontend and generate the preset
cp .npmrc $GITHUB_WORKSPACE/incubator-superset/superset-frontend/.npmrc
cd $GITHUB_WORKSPACE/incubator-superset/superset-frontend



ROOT_DIRECTORY=$GITHUB_WORKSPACE/superset-viz-plugins node $GITHUB_WORKSPACE/superset-viz-plugins/scripts/addDependencies.js
cat $GITHUB_WORKSPACE/incubator-superset/superset-frontend/package.json

ROOT_DIRECTORY=$GITHUB_WORKSPACE/superset-viz-plugins node $GITHUB_WORKSPACE/superset-viz-plugins/scripts/generateMafPreset.js
mv ./MafPreset.ts ./src/visualizations/presets/MafPreset.js
cat $GITHUB_WORKSPACE/incubator-superset/superset-frontend/src/visualizations/presets/MafPreset.js

cp $GITHUB_WORKSPACE/superset-viz-plugins/templates/setupPluginsExtra.js ./src/setup/setupPluginsExtra.js
cat $GITHUB_WORKSPACE/incubator-superset/superset-frontend/src/setup/setupPluginsExtra.js
npm install

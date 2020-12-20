#!//bin/bash
set -e

echo $GITHUB_WORKSPACE

# Add dependencies superset-frontend and generate the preset
cp .npmrc $GITHUB_WORKSPACE/incubator-superset/superset-frontend/.npmrc
cd $GITHUB_WORKSPACE/incubator-superset/superset-frontend

# add dependecies to pacakge.json
node $GITHUB_WORKSPACE/superset-viz-plugins/scripts/addDependencies.js

# generate preset file and locate in incubator source code
node $GITHUB_WORKSPACE/superset-viz-plugins/scripts/generateMafPreset.js
mv ./MafPreset.ts ./src/visualizations/presets/MafPreset.js

# override setupPluginsExtra.js in incubator source code
cp $GITHUB_WORKSPACE/superset-viz-plugins/templates/setupPluginsExtra.js ./src/setup/setupPluginsExtra.js

npm install

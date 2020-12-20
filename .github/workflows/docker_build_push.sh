#!/usr/bin/env bash

set -eo pipefail




# SHA=$(git rev-parse HEAD)
TAG_NAME="nielsenoss/apache-superset"

echo "docker file path is ${1}"

#
# Build the  image
#
docker build -f $1\
  -t "${TAG_NAME}:0.38" \
#   --label "sha=${SHA}" \
  --label "built_at=$(date)" \
  --label "build_actor=${GITHUB_ACTOR}" \
  .

if [ -z "${DOCKERHUB_TOKEN}" ]; then
  # Skip if secrets aren't populated -- they're only visible for actions running in the repo (not on forks)
  echo "Skipping Docker push"
else
  # Login and push
  docker logout
  docker login --username "${DOCKERHUB_USER}" --password "${DOCKERHUB_TOKEN}"
  docker push "${TAG_NAME}"
fi

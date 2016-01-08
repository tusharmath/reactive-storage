#!/usr/bin/env bash

REMOTE_URL="https://$GH_TOKEN@github.com/tusharmath/reactive-storage.git"

echo $WERCKER_STARTED_BY
git config user.email "pleasemailus@wercker.com"
git config user.name "werckerbot"
git config push.default matching

echo "//registry.npmjs.org/:_authToken=$NPM_AUTH_TOKEN" > ~/.npmrc
npm version $NPM_RELEASE
git push $REMOTE_URL HEAD:$WERCKER_GIT_BRANCH --tags
npm publish


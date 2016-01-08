#!/usr/bin/env bash

REMOTE_URL="https://$GH_TOKEN@github.com/tusharmath/reactive-storage.git"

git config user.email "pleasemailus@wercker.com"
git config user.name "werckerbot"
git config push.default matching

echo "//registry.npmjs.org/:_authToken=$NPM_AUTH_TOKEN" > ~/.npmrc
npm version $NPM_RELEASE -m "$NPM_RELEASE %s [ci skip]"
git push $REMOTE_URL HEAD:$WERCKER_GIT_BRANCH --tags
npm publish


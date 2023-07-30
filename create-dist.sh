#!/bin/bash

BUILD_FOLDER=.dist

echo 'building next server'
npx env-cmd -f .env.$1 next build
echo $NEXT_PUBLIC_DOMAIN
echo 'build done, removing .dist folder' 
rm -rf $BUILD_FOLDER

echo 'moving files to ' $BUILD_FOLDER 
cp -r .next/standalone/ $BUILD_FOLDER/ 
rm $BUILD_FOLDER/server.js
cp -r next.config.js $BUILD_FOLDER/ 
cp CloudFrontConfig.js $BUILD_FOLDER/ 
cp AccessController.ts $BUILD_FOLDER/ 
cp AccessControllerConfig.ts $BUILD_FOLDER/ 
cp Update.ts $BUILD_FOLDER/ 
cp serverless.yml $BUILD_FOLDER/
cp .env.$1 $BUILD_FOLDER/ 
cp -r Server.ts $BUILD_FOLDER/ 
cp -r public $BUILD_FOLDER/ 
mkdir $BUILD_FOLDER/.next/cache

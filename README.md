# Sarre The Brand UI

## Technologies
* Angular 16
* Tailwind CSS
* Material UI
* CKEditor 4

## Getting Started
* NPM installed
* Angular cli install
* ng serve (Note: to run application, you'll need backend code as up and running as csrf token is needed to display UI )

## To convert source code to docker image
* [Install pack](https://buildpacks.io/docs/tools/pack/)
* Set default `pack config default-builder paketobuildpacks/builder:base` or `pack config default-builder <you-builder-choice>`
* Convert to image `pack build <image-name> -b paketo-buildpacks/web-servers --env "BP_WEB_SERVER=nginx" --env "BP_WEB_SERVER_ROOT=dist/sarrebrand" --env "BP_WEB_SERVER_ENABLE_PUSH_STATE=true" --env "NODE_ENV=development"`

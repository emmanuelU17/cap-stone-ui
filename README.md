# Ecommerce Application UI

## Technologies
* Angular 17
* Tailwind CSS
* Material UI
* CKEditor5

## Getting Started
* NPM installed
* Angular cli installed
* ng serve (Note: to run application, you'll need backend code up and running as csrf token is needed to display UI)

## To convert source code to docker image using buildpacks
* [Install pack](https://buildpacks.io/docs/tools/pack/)
* Set default `pack config default-builder paketobuildpacks/builder:base` or `pack config default-builder <you-builder-choice>`
* Convert to image `pack build <image-name> -b paketo-buildpacks/web-servers --env "BP_WEB_SERVER=nginx" --env "BP_WEB_SERVER_ROOT=dist/sarrebrand" --env "BP_WEB_SERVER_ENABLE_PUSH_STATE=true" --env "NODE_ENV=development"`

## Development links
[Storefront](https://server.emmanueluluabuike.com/)
&
[Admin front](https://server.emmanueluluabuike.com/admin)

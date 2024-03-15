# Cap-stone UI

## About
An ecommerce application still in development.

## Technologies
* Angular 17.x.x
* Tailwind CSS
* Material UI
* CKEditor5
* Paystack

## To convert source code to docker image using buildpacks
* [Install pack](https://buildpacks.io/docs/tools/pack/)
* Set default `pack config default-builder paketobuildpacks/builder:base`
or `pack config default-builder <you-builder-choice>`
* Convert to image `pack build <image-name> -b paketo-buildpacks/web-servers
--env "BP_WEB_SERVER=nginx"
--env "BP_WEB_SERVER_ROOT=dist/capstone-ui"
--env "BP_WEB_SERVER_ENABLE_PUSH_STATE=true"
--env "NODE_ENV=development"`

## Development links
[Storefront](https://server.emmanueluluabuike.com/)
&
[Admin front](https://server.emmanueluluabuike.com/admin)

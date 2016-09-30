# 10kGames
Super awesome multiplayer online game portal fitting in just 10k of code ;)

## Deployment
- just a few tips for easy deployment of this project ;)
- place all the files into folder web root folder
- make sure _server_ directory isn't accessible through web
- **crucial step**: `php server/index.php` command must be running all the time (WebSocket server, app won't work without it) - use something like _supervisord_ to do it

## Development
- run `grunt watch` to start JS&CSS watcher
- run `grunt` to manually build JS&CSS
- **Important note:** _grunt_ is needed to build frontend resources. Never edit *build.js|css* manually!

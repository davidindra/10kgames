# 10kGames
Super awesome multiplayer online gamimg portal fitting in just 10k of code ;)

## Obtaining repository
- after `pull`/`clone`, *npm* and *composer* dependencies need to be installed/updated
- you can do so by running `npm install` and `composer install`
- **important note:** *npm* dependencies are needed only for frontend development (not on server), but *composer* dependencies **must** be present also on deploy server

## Deployment
Just a few tips for easy deployment of this project ;)
- place all the files into web *root* folder
- make sure _server_ directory isn't accessible through web
- **crucial step**: `php server/index.php` command must be running all the time (WebSocket server, app won't work without it) - use something like _supervisord_ to do it
- **important note:** make sure `vendor` folder is present and updated to the latest version (see *Obtaining repositary*)

## Frontend development
- make sure `node_modules` folder is present and updated to the latest version (see *Obtaining repository*)
- run `grunt watch` to start JS&CSS watcher
- run `grunt` to manually build JS&CSS
- **important note:** _grunt_ is needed to build frontend resources. Never edit *build.js|css* manually!

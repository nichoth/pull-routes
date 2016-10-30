# pull routes

Handle routes with a pull stream. In the browser it will listen for click events that are local to the server and automatically pipe the urls to the router. In node or the browser, you can set the route by calling `.push` with a url string.

Under the hood it uses [routes](https://www.npmjs.com/package/routes). See the docs for route matching info.

## install

	$ npm install pull-routes

## example

```js
var S = require('pull-stream')
var Router = require('pull-routes')
var router = Router()
var routeStream = router([
    ['/', function () {
        return 'root path'
    }],
    ['/foo/:i', function (params) {
        return 'foo path ' + params.i
    }]
])

S(
    routeStream,
    S.log()
)

routeStream.push('/')
routeStream.push('/foo/1')

/* 
{
  params: {},
  splats: [],
  route: '/',
  fn: [Function],
  next: [Function]
}
*/


/*
{
  params: { i: '1' },
  splats: [],
  route: '/foo/:i',
  fn: [Function],
  next: [Function]
}
*/
```

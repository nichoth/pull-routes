var S = require('pull-stream')
var Router = require('routes')

var api = require('./mock/api')()
var rootStore = require('./store/root')
var rootView = require('./view/root')
var rootController = require('./ctrl/root')

var routes = {
    '/': [
        rootView(),
        rootController(api),
        rootStore()
    ]
}

//////////////////////////////////////

function start (routes) {
    var router = Router()
    Object.keys(routes).forEach(function (path) {
        var Streams = routes[path]
        router.addRoute(path, function onRoute (params) {
            var streams = Streams.map(function (s) {
                return s(params)
            })
            S( streams[0], streams[1], streams[2], streams[0] )
        })
    })
    return router
}

var router = start(routes)
var m = router.match('/')
m.fn(m.params)

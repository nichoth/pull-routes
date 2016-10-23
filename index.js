var S = require('pull-stream')
var Router = require('routes')
var routeEvent = require('route-event')

module.exports = function Start (routeEv) {
    routeEv = routeEv === undefined ? routeEvent : routeEv

    return function start (routes) {
        var router = Router()

        Object.keys(routes).forEach(function (path) {
            router.addRoute(path, function onRoute (params) {
                var streams = routes[path](params)
                S( streams[0], streams[1], streams[2], streams[0] )
            })
        })

        function onRoute (path) {
            var m = router.match(path)
            m.fn(m.params, m)
        }

        var setRoute = routeEv && (typeof document !== 'undefined') ?
            routeEv(onRoute) :
            onRoute

        return setRoute
    }
}

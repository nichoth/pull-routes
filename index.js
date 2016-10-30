var S = require('pull-stream/pull')
var pushable = require('pull-pushable')
var Router = require('routes')
var routeEvent = require('route-event')

module.exports = function Start (routeEv) {
    routeEv = routeEv === undefined ? routeEvent : routeEv

    return function start (routes) {
        var router = Router()

        // match url strings, subscribe to events, return a view
        routes.forEach(function (r) {
            router.addRoute(r[0], r[1])
        })

        // listen to route changes in browsers, return pushable that
        // takes route strings
        var routeStream = pushable()
        var stream = S(
            routeStream,
            S.map(function (path) {
                var m = router.match(path)
                return m
            })
        )
        stream.push = routeStream.push.bind(routeStream)
        if (routeEv && typeof document !== 'undefined') {
            routeEv(function (path) {
                routeStream.push(path)
            })
        }
        return stream
    }
}

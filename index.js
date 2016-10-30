var S = require('pull-stream/pull')
var pushable = require('pull-pushable')
var Router = require('routes')
var routeEvent = require('route-event')

module.exports = function Start (routeEv) {
    routeEv = routeEv === undefined ? routeEvent : routeEv

    return function start (routes) {
        var router = Router()

        // match url strings, subscribe to events, return a view
        var view
        Object.keys(routes).forEach(function (path) {
            router.addRoute(path, function onRoute (params) {
                if (view) {
                    view.source.end()
                    view.sink.abort()
                }
                var streams = routes[path](params)
                S( streams[0], streams[1], streams[2], streams[0] )
                view = streams[0]
                return streams[0].view
            })
        })

        // map paths to views using `routes`
        function onRoute (path) {
            var m = router.match(path)
            var view = m.fn(m.params, m)
            return view
        }

        // listen to route changes in browsers, return pushable that
        // takes route strings
        var routeStream = pushable()
        var stream = S(
            routeStream,
            S.map(onRoute)
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

var S = require('pull-stream/pull')
var source = require('./source')
var match = require('./match')

module.exports = function Router (routeEv) {
    return function router (routes) {
        var routeStream = source(routeEv)
        var stream = S(
            routeStream,
            match(routes)
        )
        stream.push = routeStream.push.bind(routeStream)
        stream.end = routeStream.end.bind(routeStream)
        return stream
    }
}


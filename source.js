var routeEvent = require('route-event')
var Pushable = require('pull-pushable')

module.exports = function Source (routeEv) {
    routeEv = routeEv === undefined ? routeEvent : routeEv
    var routeStream = Pushable()
    if (routeEv && typeof document !== 'undefined') {
        routeEv(function (path) {
            routeStream.push(path)
        })
    }
    return routeStream
}

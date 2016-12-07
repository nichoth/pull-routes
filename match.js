var map = require('pull-stream/throughs/map')
var Router = require('routes')

module.exports = function Match (routes) {
    var router = Router()
    routes.forEach(function (r) {
        router.addRoute(r[0], r[1])
    })
    return map(function (path) {
        var m = router.match(path)
        return m
    })

}

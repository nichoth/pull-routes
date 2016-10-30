var test = require('tape')
var S = require('pull-stream')
var Router = require('../')

test('map paths to routes', function (t) {
    t.plan(2)
    var rs = [
        [ '/', function root () {
            return '/'
        } ],
        [ '/one', function one () {
            return '/one'
        } ]
    ]

    var router = Router()
    var routeStream = router(rs)
    var expected = [
        '/',
        '/one'
    ]
    var i = 0
    S(
        routeStream,
        S.drain(function onEvent (r) {
            t.equal(r.fn(), expected[i++])
        })
    )

    routeStream.push('/')
    routeStream.push('/one')
})

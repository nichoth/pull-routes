var test = require('tape')
var S = require('pull-stream')
var Source = require('../source')
var Match = require('../match')
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
    routeStream.end()
})

test('source', function (t) {
    t.plan(2)
    var source = Source()
    S(
        source,
        S.collect(function (err, res) {
            t.error(err)
            t.deepEqual(res, ['/a', '/b'], 'should expose source')
        })
    )
    source.push('/a')
    source.push('/b')
    source.end()
})

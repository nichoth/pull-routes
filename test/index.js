var test = require('tape')
var S = require('pull-stream')
// var Pushable = require('pull-pushable')
// var Abortable = require('pull-abortable')
var Router = require('../')

test('map paths to routes', function (t) {
    t.plan(2)
    var rs = {
        '/': function () {
            return '/'
        },
        '/one': function () {
            return '/one'
        }
    }

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

// function View (drain) {
//     var p = Pushable()
//     var abortable = Abortable()
//     var sink = S( abortable, drain )
//     sink.abort = abortable.abort.bind(abortable)
//     return {
//         source: p,
//         sink: sink,
//         view: 'test'
//     }
// }

// function Controller () {
//     return S.through()
// }

// function Store () {
//     return S.through()
// }

// test('handle routes', function (t) {
//     var routes = {
//         '/': function rootRoute (params) {
//             return [
//                 View(S.log()),
//                 Controller(),
//                 Store()
//             ]
//         }
//     }

//     t.plan(1)
//     var router = Router()
//     var viewStream = router(routes)
//     S(
//         viewStream,
//         S.drain(function onEvent (view) {
//             t.equal(view, 'test', 'should stream .view property')
//         })
//     )
//     viewStream.push('/')
// })

// test('unsubscribe previous route', function (t) {
//     t.plan(2)

//     var viewSource = Pushable(function onEnd (err) {
//         t.pass('should call view.source.end')
//     })

//     var viewSink = S.drain()
//     viewSink.abort = function () {
//         t.pass('should call view.sink.abort')
//     }

//     var routes = {
//         '/': function rootRoute (params) {
//             return [
//                 {
//                     source: viewSource,
//                     sink: viewSink,
//                     view: '/'
//                 },
//                 Controller(),
//                 Store()
//             ]
//         },
//         '/test': function rootRoute (params) {
//             return [
//                 {
//                     source: viewSource,
//                     sink: viewSink,
//                     view: '/test'
//                 },
//                 Controller(),
//                 Store()
//             ]
//         }
//     }

//     var router = Router()
//     var viewStream = router(routes)
//     S(
//         viewStream,
//         S.drain(function onEvent (view) {
//             // console.log('drain', view)
//         })

//     )
//     viewStream.push('/')
//     viewStream.push('/test')
// })

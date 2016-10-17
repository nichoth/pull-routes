var S = require('pull-stream')
var cat = require('pull-cat')
var many = require('pull-many')
var scan = require('pull-scan')
var pushable = require('pull-pushable')
var Router = require('routes')
var xtend = require('xtend')

var routes = {
    '/': [
        rootView,
        rootController,
        rootStore
    ]
}

function rootView (params) {
    var p = pushable()
    var ar = ['a', 'b', 'c']
    ar.forEach(function (ev) {
        process.nextTick(() => p.push(ev))
    })
    return { source: p, sink: S.log() }
}

function rootController (params) {
    var apiMap = {
        a: 'fetch',
        b: 'update',
        c: 'delete'
    }

    var api = {
        fetch: function (cb) {
            setTimeout(() => cb(null, { data: 'fetch' }), 100)
        },
        update: function (cb) {
            setTimeout(() => cb(null, { data: 'udpate' }), 50)
        },
        delete: function (cb) {
            setTimeout(() => cb(null, { data: 'delete' }), 75)
        }
    }

    return S(
        S.map(function (ev) {
            return apiMap[ev]
        }),
        S.map(function (fnName) {
            return { type: 'start', op: fnName }
        }),
        S.map(function (apiEv) {
            return cat([
                S.once(apiEv),
                S(
                    S.once(apiEv),
                    S.asyncMap(function (ev, cb) {
                        api[ev.op](function (err, resp) {
                            cb(null, {
                                type: ev.op,
                                resp: resp
                            })
                        })
                    })
                )
            ])
        }),
        flatMerge()
    )
}

function rootStore (params) {
    var reducers = {
        start: function (state, ev) {
            return xtend(state, { resolving: state.resolving + 1 })
        },
        fetch: function (state, ev) {
            return {
                resolving: state.resolving - 1,
                data: ev.resp.data
            }
        },
        update: function (state, ev) {
            return {
                resolving: state.resolving - 1,
                data: ev.resp.data
            }
        },
        delete: function (state, ev) {
            return {
                resolving: state.resolving - 1,
                data: ev.resp.data
            }
        }
    }

    return scan(function (state, ev) {
        return reducers[ev.type](state, ev)
    }, { resolving: 0, data: null })
}

function flatMerge () {
    return function sink (source) {
        var m = many()
        S(source, S.drain(function onEvent (s) {
            m.add(s)
        }, function onEnd (err) {
            // m.cap()
        }))
        return m
    }
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

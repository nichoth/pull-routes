var S = require('pull-stream')
var paraMap = require('pull-paramap')
var Pushable = require('pull-pushable')
var scan = require('pull-scan')
var struct = require('observ-struct')
var xtend = require('xtend')

var rs = {
    '/': [view, controller, store]
}

var paths = Object.keys(rs)
var loops = paths.map(function (path) {
    var parts = rs[path]
    var view = parts[0]
    var ctrl = parts[1]
    var store = parts[2]
    var p = Pushable()
    var state = struct({})

    view({}, p.push.bind(p), state)

    return S(
        p,
        ctrl({}),
        store({}, state)
    )
})

// => undefined
function view (params, push, store) {
    push({ type: 'start' })
    setTimeout(() => push({ type: 'test' }), 50)
    store(function onChange (state) {
        console.log('render', state)
    })
}

// => stream
function controller (params) {
    return paraMap(function (ev, cb) {
        var actions = {
            start: (ev) => setTimeout(() => cb(null, { type: 'start', data: 'start data' }), 40),
            test: (ev) => setTimeout(() => cb(null, { type: 'test', data: 'test data' }), 20)
        }
        actions[ev.type](ev)
    }, null, false)
}

// => observ-struct
function store (params, _state) {
    var reducers = {
        start: (state, ev) => xtend(state, { start: ev.data }),
        test: (state, ev) => xtend(state, { test: ev.data })
    }
    var sink = S(
        scan((state, ev) => reducers[ev.type](state, ev), _state()),
        S.drain((ev) => {
            _state.set(ev)
        }, (err) => console.log('end', err))
    )
    return sink
}


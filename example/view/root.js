var S = require('pull-stream')
var pushable = require('pull-pushable')

module.exports = function RootView () {
    return function rootView () {
        var p = pushable()
        var ar = ['a', 'b', 'c']
        ar.forEach(function (ev) {
            process.nextTick(() => p.push(ev))
        })
        return { source: p, sink: S.log(), view: 'root view' }
    }
}

var S = require('pull-stream')
var pushable = require('pull-pushable')

module.exports = function () {
    return function rootView (params) {
        var p = pushable()
        var ar = ['a', 'b', 'c']
        ar.forEach(function (ev) {
            process.nextTick(() => p.push(ev))
        })
        return { source: p, sink: S.log() }
    }


}

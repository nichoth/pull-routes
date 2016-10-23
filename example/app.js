var router = require('../')()
var S = require('pull-stream')
var api = require('./mock/api')()
var rootView = require('./view/root')()
var rootController = require('./ctrl/root')(api)
var rootStore = require('./store/root')()

var routes = {
    '/': function rootRoute (params) {
        return [
            rootView(),
            rootController(),
            rootStore()
        ]
    }
}

var viewStream = router(routes)
S( viewStream, S.drain(function onChange (view) {
    console.log('view', view)
}) )

viewStream.push('/')

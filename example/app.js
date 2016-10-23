var start = require('../')()
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

var setRoute = start(routes)
setRoute('/')


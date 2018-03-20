'use strict';
(function definejsInterface(global, factory) {
    var jsInterface = {};
    jsInterface = factory(global, jsInterface);
    if (typeof exports === 'object' && exports && typeof exports.nodeName !== 'string') {
        global.jsInterface = jsInterface;
        module.exports = jsInterface
    } else if (typeof define === 'function' && define.amd) {
        global.jsInterface = jsInterface;
        define(['exports'], jsInterface)
    } else {
        global.jsInterface = jsInterface
    }
})(window, function (global, jsInterface, undefined) {
    var backHandlerCallBack = null;
    jsInterface = {
        commonMethod: {
            setBackHandlerCB: function (cb) {
                backHandlerCallBack = cb
            }
        }, interface: {
            closeWebview: function () {
                if (window.JsInterface && window.JsInterface.closeWebview) {
                    window.JsInterface.closeWebview()
                } else {
                    console.log('浏览器端调用closeWebview')
                }
            }, exit: function () {
                if (window.JsInterface && window.JsInterface.exit) {
                    window.JsInterface.exit()
                } else {
                    console.log('浏览器端调用exit')
                }
            }, showStartScreen: function () {
                if (window.JsInterface && window.JsInterface.showStartScreen) {
                    window.JsInterface.showStartScreen()
                } else {
                    console.log('浏览器端调用showStartScreen')
                }
            }, hideStartScreen: function () {
                if (window.JsInterface && window.JsInterface.hideStartScreen) {
                    window.JsInterface.hideStartScreen()
                } else {
                    console.log('浏览器端调用hideStartScreen')
                }
            }
        }
    };
    window.backHandler = function (params) {
        backHandlerCallBack && backHandlerCallBack(params)
    };
    return jsInterface
});
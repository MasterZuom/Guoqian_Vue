//引入配置
var libsUrl = '../../libs/';
require.config({
	paths: {
		"jquery": libsUrl + "jquery-1.11.2.min",
		"vueDev": libsUrl + "vue.dev",
		"vue": libsUrl + "vue.min",
		"vant": libsUrl + "vant.min",
		"iscrollProbe": libsUrl + "iscroll-probe"
	},
	shim: {
		bootstrap: {
			deps: ["jquery"],
			exports: 'bootstrap'
		}
	},
	urlArgs: "bust=" + (new Date()).getTime()
});
require(['main']);
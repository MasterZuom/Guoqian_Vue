//引入配置
var libsUrl = '../../libs/';
require.config({
	paths: {
		"jquery": libsUrl + "jquery-1.11.2.min",
		"vueDev": libsUrl + "vue.dev",
		"vue": libsUrl + "vue.min",
		"pagination": "../common/pagination"
	},
	shim: {
		bootstrap: {
			deps: ["jquery"],
			exports: 'bootstrap'
		},
		"pagination": ["jquery"]
	},
	urlArgs: "bust=" + (new Date()).getTime()
});
require(['main']);
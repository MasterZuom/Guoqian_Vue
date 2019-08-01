//引入配置
var libsUrl = '../../libs/';
require.config({
	paths: {
		"jquery": libsUrl + "jquery-1.11.2.min",
	},
	shim: {
		bootstrap: {
			deps: ["jquery"],
		},
	},
	urlArgs: "bust=" + (new Date()).getTime()
});
require(['main']);
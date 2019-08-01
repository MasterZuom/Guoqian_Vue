define(function (require, exports, moduel) {
	var $ = require('jquery');
	var Vue = require('vueDev');
	require('../js/common');

	var toUrl = function (url) {
		location.href = url
	}

	var app = new Vue({
		data: function () {
			return {
				checked: 1,
				mobile: '',
				code: '',
				timer: 60,
				cancelEvent: 0,
				show: {
					register: 1,
					timer: 0,
					error: 0
				},
				errMsg: '',
				error: {
					mobile: '手机号码输入错误',
					code: '验证码输入错误',
					checked: '请阅读并同意《国乾优品用户协议》'
				}
			}
		},
		methods: {
			toUrl: toUrl,
			sendCode: sendCode,
			login: login
		}
	}).$mount('#page');

	//发送验证码
	function sendCode() {
		app.show.error = 0

		if (this.cancelEvent) {
			return
		}
		var mobile = this.mobile
		var isMobile = regModel.test('tel', mobile)
		if (!isMobile) {
			app.errMsg = app.error.mobile
			app.show.error = 1
			return
		}
		this.cancelEvent = 1
		this.show.timer = 1

		resource({
				type: 'POST',
				api: '/login/sendVerificationCode',
				data: {
					mobile: mobile
				}
			})
			.then(timeCount)
			.always(function () {
				//重置状态
				app.show.timer = 0
				app.timer = 3
				app.cancelEvent = 0
			})
	}

	//定时器
	function timeCount() {
		return iPromise(function (resolve, reject) {
			! function promise() {
				app.timer--
				if (app.timer <= 0) {
					resolve()
				} else {
					setTimeout(function () {
						promise()
					}, 1000)
				}
			}()
		})
	}

	//登录
	function login() {
		app.show.error = 0
		var mobile = this.mobile
		var code = this.code
		var checked = this.checked
		var isMobile = regModel.test('tel', mobile)
		if (!isMobile) {
			app.errMsg = app.error.mobile
			app.show.error = 1
			return
		}

		if (!code) {
			app.errMsg = app.error.code
			app.show.error = 1
			return
		}
		if (!checked) {
			app.errMsg = app.error.checked
			app.show.error = 1
			return
		}
		resource({
				type: 'POST',
				api: '/login',
				params: {
					mobile: mobile,
					socialUserId: 0,
					uniqueId: '',
					verificationCode: code
				}
			})
			.then(function (result) {
				if (result.code === 200) {
					alert('success')
				} else {
					app.errMsg = app.error.code
					app.show.error = 1
				}
			})
			.fail(function (result) {

			})

	}





	/* resource({
		api: '/login',
		params: {

		}
	})
	 */


});
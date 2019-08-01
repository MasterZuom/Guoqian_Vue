define(function (require, exports, moduel) {
	var $ = require('jquery')
	require('../common/common')
	var api = require('../../api/coupon')
	var Vue = require('vue')
	var Vant = require('vant')
	Vue.use(Vant)

	var app = new Vue({
		data: function () {
			return {
				card: {
					avaiableList: [],
					usedList: [],
					expiredList: []
				},
				detail: [],
				items: ['avaiableList', 'usedList', 'expiredList'],
				price: '',
				captchaUrl: '',
				cardNumber: '',
				cardSecret: '',
				captcha: '',
				index: 0,
				loading: false,
				finished: false,
				error: false,
				page: 1,
				show: {
					bind: false,
					detail: false
				},
				totalPage: ''
			}
		},
		created: function () {
			this.getCard()
			this.getCaptcha()
			if (typeof loginInfo.uuid==="undefined")
			{
				if (loginInfo.uuid.length<10)
					loginInfo.uuid = uuid()
			}
		},
		mounted: function () {
			//this.$notify('');
		},
		methods: {
			$url: $url,
			switchItem: function (index) {
				this.index = index
			},
			reload: function () {
				this.card = {
					avaiableList: [],
					usedList: [],
					expiredList: []
				}
				this.finished = false
				this.error = false
				this.getCard()
			},
			getCard: function () {
				var _self = this
				_self.loading = true
				return api.cards()
					.then(function (res) {
						if (res.code == 200) {
							_self.card = res.data
							_self.finished = true
						} else {
							_self.$notify('网络错误');
						}
					})
					.fail(function () {
						_self.error = true
						_self.$notify('网络错误')
					})
					.always(function () {
						_self.loading = false
					})
			},
			getDetail: function (id) {
				var _self = this
				if (!id) {
					return
				}
				_self.detail = []
				_self.show.detail = true
				api.cardDetail(id)
					.then(function (res) {
						if (res.code == 200) {
							_self.detail = res.data
						}
					})
					.fail(function () {
						_self.$notify('网络错误')
					})
			},
			verify: function () {
				//验证
				var _self = this
				if (!_self.cardNumber) {
					this.$toast('请输入卡号')
					return
				}
				if (!_self.cardSecret) {
					this.$toast('请输入卡密')
					return
				}
				api.cardVerify({
						captcha: _self.captcha,
						captchaId: loginInfo.uuid,
						cardNumber: _self.cardNumber,
						cardSecret: _self.cardSecret
					})
					.then(function (res) {
						if (res.code == 200) {
							_self.price = res.data
						}
						if (res.code == 99999) {
							_self.$toast(res.message)
							app.getCaptcha()
						}
					})
					.fail(function (res) {
						_self.$notify('网络错误')
						app.getCaptcha()
					})
			},
			bind: function (action, done) {
				//绑定
				if (action === 'cancel') {
					done()
					return
				}
				var _self = this
				if (!_self.cardNumber) {
					this.$toast('请输入卡号')
					done(false)
					return
				}
				if (!_self.cardSecret) {
					this.$toast('请输入卡密')
					done(false)
					return
				}
				if (!_self.captcha) {
					this.$toast('请输入验证码')
					done(false)
					return
				}
				api.cardBind({
						captcha: _self.captcha,
						captchaId: loginInfo.uuid,
						cardNumber: _self.cardNumber,
						cardSecret: _self.cardSecret
					})
					.then(function (res) {
						if (res.code == 200) {
							done()
							_self.reload()
							_self.$toast(res.data)
							return
						}
						if (res.code == 99999) {
							_self.$toast(res.message)
							app.getCaptcha()
						}
						done(false)
					})
					.fail(function (res) {
						_self.$notify('网络错误')
						app.getCaptcha()
						done(false)
					})
			},
			getCaptcha: function () {
				//图片验证码
				var _self = this
				api.captchaImg(loginInfo.uuid)
					.then(function (url) {
						_self.captchaUrl = url + '&rd=' + Math.random()
					})
			}
		}
	}).$mount('#page');


});
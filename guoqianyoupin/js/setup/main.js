define(function (require, exports, moduel) {
	var $ = require('jquery')
	require('../common/common')
	var plugin = require('../../api/plugin')
	var api = require('../../api/member')
	var Vue = require('vue')
	var Vant = require('vant')
	Vue.use(Vant)

	log(loginInfo)

	var app = new Vue({
		data: function () {
			return {
				introduce: {
					avatar: '',
					backMoney: '0',
					point: '0',
					couponNumber: '0',
					giftCardNumber: '0',
					name: '',
					phone: '',
					birth: '',
					gender: 'male',
					rank: '普通会员'
				},
				member: '',
				genderIndex: 0,
				genderArr: ['male', 'female'],
				date: {
					minHour: 10,
					maxHour: 20,
					minDate: new Date(1900, 10, 1),
					maxDate: new Date(),
					currentDate: new Date(),
					cur: '',
				},
				show: {
					datePicker: 0,
					gender: 0
				},
			}
		},
		created: function () {},
		mounted: function () {
			//this.$notify('');
		},
		watch: {},
		computed: {},
		methods: {
			$url: $url,
			logout: function () {
				// window.localStorage.removeItem('loginInfo')
                clearSomeUserInfo();
				window.localStorage.removeItem('cartNum')
				setTimeout(function () {
					$url('login.html')
				}, 10)
			}
		}
	}).$mount('#page');

});
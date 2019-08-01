define(function (require, exports, moduel) {
	var $ = require('jquery')
	require('../common/common')
	var plugin = require('../../api/plugin')
	var api = require('../../api/member')
	var Vue = require('vue')
	var Vant = require('vant')
	Vue.use(Vant)
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
				income: [{
					values: ['5000以下', '5000-7999', '8000-9999', '10000-14999', '15000-19999', '20000以上'],
					defaultIndex: 0
				}],
				occupation: [{
					values: ['IT/通信/电子/互联网', '金融/银行/投资/保险', '房地产/建筑业', '家居/装饰装潢', '商业/服务业/个体经营', '贸易/批发/零售/租赁业', '文体/教育/工艺美术', '生产/加工/制造', '交通/运输/物流/仓储', '医疗/餐饮/酒店/旅游', '文化/传媒/娱乐/体育', '广告/会展/公关/市场推广', '矿产/石化/水电/环保', '政府/非盈利机构', '农/林/渔/牧', '学生', '其他'],
					defaultIndex: 0
				}],
				show: {
					datePicker: 0,
					gender: 0,
					income: false,
					occupation: false
				},
			}
		},
		created: function () {
			getMemberInfo()
		},
		mounted: function () {
			//this.$notify('');
		},
		watch: {
			genderIndex: function (v) {
				this.introduce.gender = this.genderArr[v]
			}
		},
		computed: {
			genderTxt: function () {
				var result = ''
				if (this.genderIndex == 0) {
					result = '男'
				}
				if (this.genderIndex == 1) {
					result = '女'
				}
				return result
			}
		},
		methods: {
			$url: $url,
			getMemberInfo: getMemberInfo,
			onRead: function (files) {
				//上传头像
				var _self = this
				var oData = new FormData()
				oData.append('file', files.file)
				oData.append('fileType', 'image')
				plugin.uploader(oData)
					.then(function (res) {
						if (res.code == 200) {
							_self.introduce.headIcon = res.data.url
						}
					})
					.fail(function () {
						app.$notify('网络错误');
					})
			},
			saveInfo: function () {
				var _self = this

				if (!this.introduce.nickname) {
					this.$toast('请输入昵称');
					return
				}
				if (!this.introduce.name) {
					this.$toast('请输入姓名');
					return
				}
				if (!regModel.test('tel', this.introduce.phone)) {
					this.$toast('手机号码不正确');
					return
				}

				var data = jsonParse(this.introduce)
				var introduce = {
					headIcon: data.headIcon || '',
					birth: data.birth,
					gender: data.gender,
					income: data.income,
					name: data.name,
					nikeName: data.nickname,
					occupation: data.occupation
				}

				api.update(introduce, this.member)
					.then(function (res) {
						_self.$toast({
							message: res.message,
							duration: 1000
						});
					})
					.fail(function () {
						app.$notify('网络错误');
					})
			},
			selectDate: function (item) {
				this.date.cur = item.getValues()
			},
			showDate: function () {
				this.show.datePicker = 1
			},
			hidelDate: function (item) {
				if (item) {
					this.introduce.birth = new Date(item).getTime()
				}
				this.show.datePicker = 0
			},
			showGender: function () {
				this.show.gender = 1
			},
			hideGender: function (item, index) {
				if (item) {
					this.genderIndex = index
				}
				this.show.gender = 0
			},
			hideIncome: function (item, i) {
				if (item) {
					this.introduce.income = item[0]
				}
				this.show.income = false
			},
			hideOccupation: function (item) {
				if (item) {
					this.introduce.occupation = item[0]
				}
				this.show.occupation = false
			}
		}
	}).$mount('#page');


	//获取用户细信息
	function getMemberInfo() {
		api.info()
			.then(function (result) {
				if (result.code === 200) {
					app.member = result.data.id
				}
			})

		api.introduce()
			.then(function (result) {
				if (result.code === 200) {
					if (!result.data.gender) {
						result.data.gender = 'male'
					}
					if (result.data.gender == 'male') {
						app.genderIndex = 0
					}
					if (result.data.gender == 'female') {
						app.genderIndex = 1
					}

					var income = result.data.income
					app.income[0].values.forEach(function (v, i) {
						if (v == income) {
							app.income[0].defaultIndex = i
						}
					})

					var occupation = result.data.occupation
					app.occupation[0].values.forEach(function (v, i) {
						if (v == occupation) {
							app.occupation[0].defaultIndex = i
						}
					})

					app.introduce = result.data
					app.date.currentDate = new Date(result.data.birth)

				} else {
					app.$notify('网络错误');
				}
			})
			.fail(function () {
				app.$notify('网络错误');
			})
	}






});
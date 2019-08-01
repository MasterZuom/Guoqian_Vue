define(function (require, exports, moduel) {
	var $ = require('jquery')
	require('../common/common')
	var api = require('../../api/address')
	var getArea = require('../address/area')
	var memberApi = require('../../api/member')
	var Vue = require('vue')
	var Vant = require('vant')

	Vue.use(Vant)
	var app = new Vue({
		data: function () {
			return {
				addressId: '',
				areaList: {
					province_list: {},
					city_list: {},
					county_list: {}
				},
				areaIdData: '',
				areaId: '',
				seletArea: [],
				member: '',
				address: {
					consignee: '',
					areaId: '',
					areaName: '',
					default: true,
					id: 0,
					memberId: '',
					phone: '',
					zipCode: '0',
					address: ''
				},
				areaCode: {},
				dftArea: '110100',
				show: {
					area: false
				},
				state: {
					areaLoading: true,
					locked: false
				}
			}
		},
		created: function () {
			var _self = this
			var addrPromiss
			this.addressId = getParam('id') || ''
			_self.state.areaLoading = true
			if (this.addressId) {
				addrPromiss = this.getAddress()
			}
			this.getArea()
				.done(function (data) {
					_self.areaList.province_list = data.proList
					_self.areaList.city_list = data.cityList
					_self.areaList.county_list = data.countyList
					_self.areaIdData = data.areaIdData
					_self.areaCode = data.areaCode
				})
				.fail(function () {
					_self.$notify('网络错误');
				})
				.then(function () {
					return addrPromiss
				})
				.then(function () {
					var curId = _self.address.areaId
					if (curId) {
						_self.dftArea = _self.areaCode[curId].code
					}
					_self.state.areaLoading = false
				})

			memberApi.info()
				.then(function (result) {
					if (result.code === 200) {
						_self.member = result.data.id
					}
				})
		},
		mounted: function () {},
		watch: {},
		methods: {
			$url: $url,
			getArea: getArea,
            scrollTop:function () {
				window.scrollTo(0,0);
            },
			showArea: function () {
				if (this.state.areaLoading) {
					return
				}
				this.show.area = true
			},
			getAddress: function () {
				//获取指定 ID 地址
				var _self = this
				_self.areaLoading = true
				return api.getAddress(this.addressId)
					.then(function (res) {
						if (res.code == 200) {
							return res.data
						} else {
							app.$notify('网络错误');
						}
					})
					.then(function (data) {
						_self.address = data
						_self.areaId = data.areaId
					})
					.fail(function () {
						app.$notify('网络错误');
					})
					.always(function () {
						_self.areaLoading = false
					})
			},
			hideArea: function (data) {
				//地区选择器
				if (data) {
					this.seletArea = data
				}
				this.show.area = false
			},
			removeAddress: function () {
				//删除地址
				var _self = this
				if (this.state.locked) {
					return
				}
				var id = this.addressId
				if (!id) {
					return
				}

				this.$dialog.confirm({
						title: '确认删除当前地址',
						message: ''
					})
					.then(function () {
						_self.state.locked = true
						api.deleteAddress(id)
							.then(function (res) {
								var timer = 600
								_self.$toast({
									message: '删除成功',
									duration: timer
								})
								setTimeout(function () {
									window.history.back(-1)
								}, timer);
							})
							.fail(function () {
								_self.$notify('网络错误')
							})
							.always(function () {
								_self.state.locked = false
							})
					})
					.catch(function () {
						//cancel
					})
			},
			saveAddress: function () {
				var _self = this
				//保存地址
				if (this.state.locked) {
					return
				}
				var _self = this
				var areaCode = ''
				var areaName = ''
				this.seletArea.forEach(function (v) {
					if (v) {
						areaCode = v.code
						areaName = v.name
					}
				})
				if (areaCode) {
					this.areaId = this.areaIdData[areaCode]
				}

				var dto = jsonParse(this.address)
				dto.areaId = this.areaId
				dto.areaName = areaName || dto.areaName
				dto.memberId = this.member

				if (!dto.consignee) {
					_self.$toast('请输入收货人信息')
					return
				}
				if (!regModel.test('tel', dto.phone)) {
					_self.$toast('请输入联系方式')
					return
				}
				if (!dto.areaId) {
					_self.$toast('请选择所在地区')
					return
				}
				if (!dto.address) {
					_self.$toast('请输入详细地址')
					return
				}
				this.state.locked = true
				// regModel
				api.saveAddress(dto)
					.then(function (res) {
						var timer = 600
						_self.$toast({
							message: '保存成功',
							duration: timer
						})
						setTimeout(function () {
							$url('address.html')
						}, timer)
					})
					.fail(function () {
						_self.$notify('网络错误')
					})
					.always(function () {
						_self.state.locked = false
					})
			}
		}
	}).$mount('#page');






});
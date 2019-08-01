define(function (require, exports, moduel) {
	var $ = require('jquery')
	require('../common/common')
	require('../../api/common')
	var Vue = require('vue')
	var Vant = require('vant')
	var nav = require('../../components/nav')
	var notifyApi = require('../../api/notification')

	Vue.config.devtools = true
	Vue.use(nav)
	Vue.use(Vant)

	if (!loginInfo.token) {
		$url('login.html')
		return
	}

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
					rank: '普通会员'
				},
				show: {
					share: false
				},
				showMsgTip: 0,
				rankImg: 'icon_vip_01',
                isPersonalEnabled:false
			}
		},
		created: function () {
			this.getMemberInfo()
			this.getMsg()
			this.getMemSet()
		},
		mounted: function () {
			//this.$notify('');
		},
		methods: {
			$url: $url,
			getMsg: function () {
				//获取未读消息
				if (!loginInfo.token) {
					//未登录
					return
				}
				notifyApi.getMessage({
						page: 1,
						category: 'share'
					})
					.then(function (res) {
						if (res.code == 200) {
							if (res.data.messageUnreadCount>0||res.data.promotionMessageUnreadCount>0||res.data.shareUnreadCount>0)
								app.showMsgTip=1
						}
					})
			},
            getMemSet:function () {
                var _self = this
                resource({
                    type: 'GET',
                    api: '/member/setting',
                    headers: {
                        Accept: "application/json; charset=utf-8",
                        Authorization: 'GcToken:' + loginInfo.token
                    }
                })
                    .then(function (res) {
                        if (res.code === 200) {
                            _self.isPersonalEnabled = res.data.isPersonalEnabled
                        }
                    })
                    .fail(function () {
                        _self.$notify('网络错误');
                    })
            },
			getMemberInfo: function () {
				//获取用户细信息
				var _self = this
				resource({
						type: 'GET',
						api: '/member/introduce',
						headers: {
							Accept: "application/json; charset=utf-8",
							Authorization: 'GcToken:' + loginInfo.token
						}
					})
					.then(function (res) {
						if (res.code === 200) {
							_self.introduce = res.data
							if (_self.introduce.rank=="金牌会员")
								_self.rankImg = 'icon_vip_04'
							else if (_self.introduce.rank=="银牌会员")
								_self.rankImg = 'icon_vip_03'
							else if (_self.introduce.rank=="铜牌会员")
								_self.rankImg = 'icon_vip_02'
							else 
								_self.rankImg = 'icon_vip_01'

							return
						}
					})
					.fail(function () {
						_self.$notify('网络错误');
					})
			},
			phoneCall: function () {
				let ref = cordova.InAppBrowser.open(
	              "tel://400-8050939",
	              "_system",
	              "location=no"
	            );
			}
		}
	}).$mount('#page');

});

define(function (require, exports, moduel) {
	var $ = require('jquery')
	require('../common/common')
	var Vue = require('vue')
	var Vant = require('vant')
	Vue.use(Vant)
	require('qrcode')

	if (!loginInfo.token) {
		$url('login.html')
		return
	}
	var app = new Vue({
		data: function () {
			return {
				name: '',
				show: {
					share: false,
					rules: false
				},
			}
		},
		mounted: function () {
			$('.code-wrapper').qrcode('http://192.168.212.47:8180/member/share/register?inviterId=' + loginInfo.userId)
		},
		methods: {
			$url: $url,
			shareWeixinPerson: function () {
				Wechat.share({
					message: {
						title: '我的智选生活邀你同享，送你新人专享礼券',
						description: "国乾优品，汇聚全球3C爆品!立即领券体验>",
						thumb: "http://192.168.212.47:8180/resources/shop/images/app-logo.png",
						mediaTagName: this.goodsId,
						media: {
							type: Wechat.Type.WEBPAGE,
							webpageUrl: "http://192.168.212.47:8180/member/share/register?inviterId=" + loginInfo.userId
						},
						scene: Wechat.Scene.SESSION
					},
					scene: Wechat.Scene.SESSION // share to session
				}, function () {
					//alert("Success");
				}, function (reason) {
					//alert("Failed: " + reason);
				});

			},
			shareWeixinGroup: function () {
				Wechat.share({
					message: {
						title: '我的智选生活邀你同享，送你新人专享礼券',
						description: "国乾优品，汇聚全球3C爆品!立即领券体验>",
						thumb: "http://192.168.212.47:8180/resources/shop/images/app-logo.png",
						mediaTagName: this.goodsId,
						media: {
							type: Wechat.Type.WEBPAGE,
							webpageUrl: "http://192.168.212.47:8180/member/share/register?inviterId=" + loginInfo.userId
						},
						scene: Wechat.Scene.TIMELINE
					},
					scene: Wechat.Scene.TIMELINE // share to Timeline
				}, function () {
					//alert("Success");
				}, function (reason) {
					//alert("Failed: " + reason);
				});
			},
			shareQQPerson: function () {
				var args = {};
				args.client = QQSDK.ClientType.QQ;
				args.scene = QQSDK.Scene.QQ; //QQSDK.Scene.QQZone,QQSDK.Scene.Favorite
				args.url = "http://192.168.212.47:8180/member/share/register?inviterId=" + loginInfo.userId;
				args.title = '我的智选生活邀你同享，送你新人专享礼券';
				args.description = "国乾优品，汇聚全球3C爆品!立即领券体验>";
				args.image = "http://192.168.212.47:8180/resources/shop/images/app-logo.png";
				QQSDK.shareNews(function () {
					//alert('shareNews success');
				}, function (failReason) {
					//alert(failReason);
				}, args);
			},
			shareQQGroup: function () {
				var args = {};
				args.client = QQSDK.ClientType.QQ;
				args.scene = QQSDK.Scene.QQZone; //QQSDK.Scene.QQ,QQSDK.Scene.Favorite
				args.url = "http://192.168.212.47:8180/member/share/register?inviterId=" + loginInfo.userId;
				args.title = '我的智选生活邀你同享，送你新人专享礼券';
				args.description = "国乾优品，汇聚全球3C爆品!立即领券体验>";
				args.image = "http://192.168.212.47:8180/resources/shop/images/app-logo.png";
				QQSDK.shareNews(function () {
					//alert('shareNews success');
				}, function (failReason) {
					//alert(failReason);
				}, args);
			},
			shareWeibo: function () {
				var args = {};
				args.url = "http://192.168.212.47:8180/member/share/register?inviterId=" + loginInfo.userId;
				args.title = "我的智选生活邀你同享，送你新人专享礼券";
				args.description = '国乾优品，汇聚全球3C爆品!立即领券体验>';
				args.image = "http://192.168.212.47:8180/resources/shop/images/app-logo.png";
				WeiboSDK.shareToWeibo(function () {
					//alert('share success');
				}, function (failReason) {
					//alert(failReason);
				}, args);
			}
		}
	}).$mount('#page');

});
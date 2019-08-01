define(function (require, exports, moduel) {
	var $ = require('jquery')
	require('../common/common')
	var payApi = require('../../api/pay')
	var api = require('../../api/common')
	var orderApi = require('../../api/order')
	var Vue = require('vue')
	var Vant = require('vant')
	Vue.use(Vant)

	var app = new Vue({
		data: function () {
			return {
				payType: 0, //1 支付宝, 2 微信, 3 银联, 4一卡通
				page: 1,
				orderSn: '',
				orderPrice: 0,
				orderData: {},
				show: {
					pageLoading: false,
					pay:false
				},
				passWord:'',
				showJkcard: false,
                showWXPay:false,
                jkCardMember: -1, //非一卡通用户
				jkCardBalance:0
			}
		},
		created: function () {
			this.orderSn = getParam('sn')
			if (!this.orderSn) {
				$url('order_list.html')
				return
			}
			this.getDetail()
			// this.getJkcardInfo()

		},
		mounted: function () {
			//this.$notify('');
/*			if(api.phoneNumber && api.cardCode){
				this.showJkcard = true
			}*/
		},
		methods: {
			$url: $url,
			getDetail: function () {
				//获取定订单信息
				var _self = this
				this.show.pageLoading = true
				return orderApi.orderDetail({
						orderSn: this.orderSn
					})
					.then(function (res) {
						if (res.code == 200) {
							_self.orderData = res.data
							_self.orderPrice = res.data.amountPayable
							if(res.data.exPayMode=='online'){
                                _self.payType = 2
								_self.showWXPay = true
							}else if(res.data.exPayMode=='jkcardPay'){
                                _self.payType = 4
								_self.showJkcard = true;
                                _self.getJkcardInfo();
							}
						}
					})
					.fail(function () {
						_self.$notify('网络错误')
					})
					.always(function () {
						_self.show.pageLoading = false
					})

			},
            getJkcardInfo:function () {//获取一卡通信息
				var _self = this;
                resource({
                    type: 'POST',
                    api: '/jkcardPay/getUserInfo',
                    token: api.token,
                    params: {
                        mobile:api.userName,
                        token:api.token
                    }
                })
                    .then(function (res) {
                        if (res.code=='200')
                        {	//一卡通用户 code：0    非一卡通用户 code：-1
                            _self.jkCardMember = res.data.code;
                            _self.cardCode = res.data.cardCode;
                            if(res.data.code == 0){
                                _self.getJkcardBalance(res.data.cardCode);
                            }
                        }

                        if(res.code=='-2'){
                            window.localStorage.removeItem('loginInfo')
                            window.localStorage.removeItem('cartNum')
                            window.location.href = 'login.html'
						}

                    })
            },
            getJkcardBalance:function (cardCode) {
                //获取一卡通余额
                var _self = this;
                resource({
                    type: 'POST',
                    api: '/jkcardPay/getUserBalance',
                    token: api.token,
                    params: {
                        cardCode:cardCode,
                        channelCode:'GUOQIAN',
                        token:api.token
                    }
                })
				.then(function (res) {
					if (res.code=='200')
					{
                        // overdraftAmount 可透支余额
                        _self.jkCardBalance = res.data.availableAmount
					}

				})
            },
			choicePay: function (type) {
				//选择支付方式
				if(type==4){//一卡通支付时判断
                    if(this.orderPrice > this.jkCardBalance){
                        this.$toast('余额不足')
                        return false;
                    }

/*                    if(this.orderData.invoiceType){//开发票不可以一卡通支付

                    	return false;
					}*/
				}

                this.payType = type
			},
			submitpsw: function (){
				//一卡通支付，输入密码点击确认之后
				if(!this.passWord){
					return
				}
				
				this.show.pageLoading = true;
				this.show.pay = false;
				this.$refs.inputText.blur();
				
				var _self = this
				payApi.jkcardPay({
					orderSn: _self.orderSn,
					cardCode: _self.cardCode,
					jkcardPwd: _self.passWord,
					// mobile: api.phoneNumber
					mobile: api.userName
				})
				.then(function(res){
					_self.show.pageLoading = false;
					if(res.code == '200'){
						var payInfo  = res.data;
						if(payInfo && payInfo.code == '0'){
							location.href="pay_success.html?sn="+_self.orderSn
						}else{
							alert(payInfo.msg)
						}
					}else{
						alert(res.message)
					}
				})
				.fail(function(){
					_self.show.pageLoading = false;
					alert('支付失败')
				})
			},
			close: function(){
				this.show.pay = false
				this.passWord = ''
			},
			goPay: function () {
				//跳转支付
				log('支付方式' + this.payType)

				/* 
				 * type
				 * aliAppPay 
				 * wechatAppPay
				 */
				var _self = this
				

				if (this.payType == 1) {

					payApi.goPay({
						type: 'aliAppPay',
						sn: _self.orderSn
					})
					.then(function (res) {
						if (res.code=='200')
						{
							var payInfo  = res.data;  
							cordova.plugins.alipay.payment(payInfo,function success(e){
								location.href="pay_success.html?sn="+_self.orderSn
							},function error(e){
								;//alert('支付失败'+JSON.stringify(e));
							});
						}
						else
							alert('支付失败')
					})
					.fail(function () {
						_self.$notify('网络错误')
					})

				} else if (this.payType == 2) {
					payApi.goPay({
						type: 'wechatAppPay',
						sn: _self.orderSn,
                        // jkcardtoken:window.localStorage.getItem('jkcardtoken')
                    })
					.then(function (res) {
						if (res.code=='200')
						{
							var payInfo  = res.data;

                            wx.miniProgram.getEnv(function(res) {
                                if(res.miniprogram){
                                    // true代表在小程序里
                                    // var params = {
                                    //     "timeStamp":payInfo.timeStamp,
                                    //     "nonceStr":payInfo.nonceStr,
                                    //     "package":payInfo.package,
                                    //     "signType":payInfo.signType,
                                    //     "paySign":payInfo.paySign
                                    // }
                                    // alert(JSON.stringify(params))
                                    var localHost=window.location.protocol+"//"+window.location.host
                                    var url='/pages/wxpayH5/wxpayH5?timestamp='+payInfo.timeStamp+'&nonceStr='+payInfo.nonceStr+'&'+payInfo.package+'&signType='+payInfo.signType+'&paySign='+payInfo.paySign+'&turnUrl='+localHost+'/order_list.html';
                                    //跳转到小程序支付界面wxPay
                                    wx.miniProgram.navigateTo({
                                    // wx.miniProgram.redirectTo({
                                        url: url
                                    });

                                }else{
                                    //false代表在公众号里
                                    var params = {
                                        "appId":payInfo.appId,
                                        "timeStamp":payInfo.timeStamp,
                                        "nonceStr":payInfo.nonceStr,
                                        "package":payInfo.package,
                                        "signType":payInfo.signType,
                                        "paySign":payInfo.paySign
                                    }

                                    if (typeof WeixinJSBridge == "undefined"){
                                        if( document.addEventListener ){
                                            document.addEventListener('WeixinJSBridgeReady', onBridgeReady(params,_self.orderSn), false);
                                        }else if (document.attachEvent){
                                            document.attachEvent('WeixinJSBridgeReady', onBridgeReady(params,_self.orderSn));
                                            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady(params,_self.orderSn));
                                        }
                                    }else{
                                        onBridgeReady(params,_self.orderSn)
                                    }

                                }
                            })



						}
						else
							;//alert('支付失败')
					})
					.fail(function () {
						alert('网络错误')
					})


				} else if (this.payType == 4){
					//一卡通支付
					this.show.pay = true;
                }else {
					alert("Failed");
				}

			}
		}
	}).$mount('#page');


});

function onBridgeReady(params,orderSn){
    WeixinJSBridge.invoke(
        'getBrandWCPayRequest', params,
        function(res){
            if(res.err_msg == "get_brand_wcpay_request:ok" ){
                location.href="pay_success.html?sn="+orderSn
            }
        });
}
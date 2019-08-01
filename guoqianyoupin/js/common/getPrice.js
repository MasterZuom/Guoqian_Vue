//收集款式计算 估价 模块

define(function(require, exports, moduel) {
	var $ = require('jquery');

	function init(priceConfig) {
		var collectId = priceConfig.collectId || '',
			print = priceConfig.print || '',
			fcstnum = priceConfig.fcstnum || '',
			info = priceConfig.info || '',
			sample = priceConfig.sample || '',
			boxData = priceConfig.boxData || '';

		if (!info) {
			return iPromise(function(resolve, reject) {
				resolve(0)
			})
		};

		//品类总价 ， 印刷总价
		var goodsPrice,
			techPrice;

		techPrice = iPromise(function(resolve, reject) {
			getAjax({
				data: {
					act: 'getPriceByOrderInfo',
					orderinfo: info,
					ratioType: 1,
					collect: collectId,
					printPara: print,
					fcstnum: fcstnum,
					sample: sample,
					boxData: boxData
				},
				done: function(data) {
					if (data.returnTag == 'success') {
						resolve(data.returnValue, data.returnValue2)
					} else {
						reject('failed')
					}
				},
				fail: function(xhr, sta, err) {
					alert('服务器连接失败')
					reject(err);
				}
			});
		});

		return techPrice;

		/*goodsPrice = iPromise(function(resolve, reject) {
			getAjax({
				data: {
					act: 'getGoodsPrice',
					orderinfo: info
				},
				done: function(data) {
					if (data.returnTag == 'success') {
						resolve(data.returnValue)
					} else {
						reject('failed')
					}
				},
				fail: function(xhr, sta, err) {
					alert('服务器连接失败')
					reject(err);
				}
			});
		});*/
		/*return goodsPrice.then(function(price_1) {
			return techPrice.then(function(price_2) {
				var price = price_1 + Number(price_2)
				return price;
			})
		});*/
		//----------end----------//
	};


	return {
		init: init
	}
});
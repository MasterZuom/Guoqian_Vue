define(function (require, exports, moduel) {
	var $ = require('jquery')
	require('../common/common')
	var api = require('../../api/address')

	/* 处理省市数据 */
	return function getAreaData() {
		var proList = {};
		var areaCode = {};
		var cityList = {};
		var countyList = {};
		var areaIdData = {};
		var areaData = localStorage.getItem('areaData')
		if (areaData) {
			areaData = JSON.parse(areaData)
			return iPromise(function (resolve, reject) {
				resolve(areaData)
			})
		}

		return api.queryProList()
			.then(function (res) {
				var i = 10
				var count = ''
				proData = res
				res.forEach(function (v) {
					i++
					if (i % 10 == 0) {
						i++
					}
					count = String(i)
					proList[count + '0000'] = v.provinceName
					areaCode[v.provinceId] = {
						code: count + '0000',
						count: count
					}
					areaIdData[count + '0000'] = v.provinceId
				})
			})
			.then(function () {
				return api.queryCityList()
					.then(function (res) {
						var prevAttr = ''
						var i = 0
						var count = '';
						res.forEach(function (v) {
							for (var attr in areaCode) {
								if (v.partentId == attr) {
									if (prevAttr != attr) {
										i = 0
										prevAttr = attr
									}
									i++
									if (i % 10 == 0) {
										i++
									}
									if (i < 10) {
										count = '0' + i
									} else {
										count = String(i)
									}
									cityList[areaCode[attr].count + count + '00'] = v.cityName
									areaCode[v.cityId] = {
										code: areaCode[attr].count + count + '00',
										count: areaCode[attr].count + count
									}
									areaIdData[areaCode[attr].count + count + '00'] = v.cityId
								}
							}
						})
					})
			})
			.then(function () {
				return api.queryRegList()
			})
			.then(function (res) {
				var i = 0
				var prevAttr = ''
				var count = '';
				res.forEach(function (v) {
					for (var attr in areaCode) {
						if (v.partentId == attr) {
							if (prevAttr != attr) {
								i = 0
								prevAttr = attr
							}
							i++
							if (i < 10) {
								count = '0' + i
							} else {
								count = String(i)
							}
							countyList[areaCode[attr].count + count] = v.regionName
							areaCode[v.regionId] = {
								code: areaCode[attr].count + count,
								count: areaCode[attr].count + count
							}
							areaIdData[areaCode[attr].count + count] = v.regionId
						}
					}
				})

				var areaData = {
					proList: proList,
					cityList: cityList,
					countyList: countyList,
					areaIdData: areaIdData,
					areaCode: areaCode
				}
				localStorage.setItem('areaData', JSON.stringify(areaData))
				return areaData
			})
	}


});
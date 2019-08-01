//创建预览画布
define(function(require, exports, moduel) {
	var $ = require('jquery');
	var colorToStr = require('../color2str'); //色值16 转 字符串
	//指针
	var initType;
	try {
		initType = initConfig.type;
	} catch (err) {};

	function createOptions(proData, gender) {

		var proSize, imgColor, imgSrc, posSize; //背景色，对应图片，限制匡位置
		if (gender == 0) {
			imgColor = proData.male.color;
			proSize = proData.male.size;
		} else if (gender == 1) {
			imgColor = proData.female.color;
			proSize = proData.female.size;
		};

		


		//order_coller_seller 固定款式颜色
		if (initType == 'orderCollectSeller') {
			try {
				imgColor = [initConfig.bgColor]
			} catch (err) {};
		};

		proSize = sizeSort(proSize);
		var sizeOption = '',
			colorOption = '';
		$.each(proSize, function(index) {
			var str = '0';
			if (initConfig.url == 'act_160426' && isNaN(parseInt(proSize[0]))) {
				if (gender == 0) {
					if (proSize[index] == 'S') {
						str = 'S(160-170cm,50-65kg)';
					}
					if (proSize[index] == 'M') {
						str = 'M(170-175cm,65-75kg)';
					}
					if (proSize[index] == 'L') {
						str = 'L(175-180cm,75-85kg)';
					}
					if (proSize[index] == 'XL') {
						str = 'XL(175-185cm,85-100kg';
					}
					if (proSize[index] == 'XXL') {
						str = 'XXL(175-190cm,100-110kg)';
					}
					if (proSize[index] == 'XXXL') {
						str = 'XXXL(175-190cm,110-125kg)';
					}
				} else {
					if (proSize[index] == 'S') {
						str = 'S(145-155cm,45-55kg)';
					}
					if (proSize[index] == 'M') {
						str = 'M(155-165cm,55-65kg)';
					}
					if (proSize[index] == 'L') {
						str = 'L(165-175cm,65-75kg)';
					}
				}
				sizeOption += '<option data-size=' + proSize[index] + '>' + str + '</option>';
			} else if (initConfig.url == 'act_160426' && parseInt(proSize[0]) > 0) {
				str = proSize[index] + 'cm';
				sizeOption += '<option data-size=' + proSize[index] + '>' + str + '</option>';
			} else {
				sizeOption += '<option data-size=' + proSize[index] + '>' + proSize[index] + '</option>';
			}
		});

		for (var i = 0; i < imgColor.length; i++) {
			colorOption += '<option value= "' + imgColor[i] + '" style="background:'+ imgColor[i] +'">' + colorToStr(imgColor[i]) + '</option>';
		}

		$('.addorder-option .color select').html(colorOption);
		$('.addorder-option .size select').html(sizeOption);
	};

	//尺码排序
	function sizeSort(sizeArr) {
		var newSizeArr = [];
		//定义规则
		var patt = {
			0: 'XS',
			1: 'SS',
			2: 'S',
			3: 'M',
			4: 'L',
			5: 'LL',
			6: 'XL',
			7: '3L',
			8: 'XXL',
			9: 'XXXL',
			10: '100',
			11: '110',
			12: '120',
			13: '130',
			14: '140',
			15: '150',
			16: '160'
		}

		if (isNaN(parseInt(sizeArr[0]))) {
			//全是尺码
			for (var index in patt) {
				for (var i = 0; i < sizeArr.length; i++) {
					if (patt[index] == sizeArr[i]) {
						newSizeArr.push(sizeArr[i])
					}
				}
			}
		} else {
			//全是数字
			sizeArr.sort(function(a, b) {
				return a - b;
			});
			newSizeArr = sizeArr;
		}
		//返回新数据
		return newSizeArr;
	}

	return {
		init: createOptions
	}
});
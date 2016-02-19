// 定义echarts 环境  
var echarts = {};
require([ 'echarts', 'echarts/chart/line', 'echarts/chart/bar',
		'echarts/chart/map' ], function(ec) {
	echarts = ec;
});

/**
 * 格式化series 数据
 * 
 * @param o
 * @returns
 */
function dataFormatterFn(o) {
	var v = o.data;
	return v >= 10000 ? (v / 10000).toFixed(2) + "万" : v;
}

/**
 * 格式化series points 数据
 * 
 * @param o
 * @returns
 */
function pointFormatterFn(o) {
	var v = o.data.value;
	return v >= 10000 ? (v / 10000).toFixed(2) + "万" : v;
}

/**
 * 定义一个公共的seriers
 */
function getComonLineSeries(name) {
	return {
		type : 'line',
		name : name,
		markPoint : {
			data : [ {
				type : 'max',
				name : '最大值'
			}, {
				type : 'min',
				name : '最小值'
			} ],
			itemStyle : {
				normal : {
					label : {
						show : true,
						formatter : pointFormatterFn
					}
				}
			}
		},
		data : [],
		itemStyle : {
			normal : {
				label : {
					show : true,
					formatter : dataFormatterFn
				}
			}
		}
	};
}

/**
 * 
 * @returns charts x轴数据对象
 */
function getCommonDays() {
	var days = {};
	days.type = 'category';
	days.boundaryGap = false;
	days.data = [];

	return days;
}

/**
 * 定义一个公共的chartsOption
 */
function getCommonLineOption(titleText, titleSubtext, legendData) {

	return {
		title : {
			text : titleText,
			subtext : titleSubtext
		},
		tooltip : {
			trigger : 'axis'
		},
		legend : {
			data : legendData
		},
		toolbox : {
			show : true,
			feature : {
				mark : {
					show : false
				},
				dataView : {
					show : true,
					readOnly : false
				},
				magicType : {
					show : true,
					type : [ 'line', 'bar' ]
				},
				restore : {
					show : true
				},
				saveAsImage : {
					show : true
				}
			}
		}, 
		calculable : true,
		xAxis : [ {} ],
		yAxis : [ {
			type : 'value',
			axisLabel : {
				formatter : '{value}'
			}
		} ],
		series : []
	}
};

/**
 * 获取公共地图方法
 * 
 * @param titleText
 * @param titleSubText
 * @param legendData
 * @param legendSelectedObj
 * @param dataRangeColor
 * @returns {___anonymous4677_5520}
 */
function getCommonMapOption(titleText, titleSubText, legendData,
		legendSelectedObj, dataRangeColor) {

	return {
		title : {
			text : titleText,
			subtext : titleSubText,
			x : 'left'
		},
		tooltip : {
			trigger : 'item'
		},
		legend : {
			orient : 'horizontal',
			x : 'center',
			data : legendData,
			selectedMode : 'single',
			selected : legendSelectedObj
		},
		dataRange : {
			min : 0,
			max : 1000000,
			y : '50%',
			calculable : true
		/*
		 * , 根据各series的颜色渐变 color : dataRangeColor
		 */
		},
		toolbox : {
			show : true,
			orient : 'vertical',
			x : 'right',
			y : 'center',
			feature : {
				mark : {
					show : true
				},
				dataView : {
					show : true,
					readOnly : false
				},
				restore : {
					show : true
				},
				saveAsImage : {
					show : true
				}
			}
		},
		roamController : {
			show : true,
			x : 'right',
			mapTypeControl : {
				'china' : true
			}
		},
		series : []
	};
}

/**
 * 查询指标环比
 */
function searchKpi(url, setRatioValFn) {

	$('#key_indicators_detail_tag li:eq(0) a').tab('show');
	// 查询今日指标以及环比
	$.ajax({
		type : "POST",
		url : url,
		dataType : "json",
		success : function(data) {
			var todayKpiData = [];
			todayKpiData[0] = data.today;
			$("#today_kpi").bootstrapTable('load', todayKpiData);
			data.chainOfDay.name = '日环比';
			data.chainOfWeek.name = '周环比';
			data.chainOfMonth.name = '月环比';
			var ratioList = [ data.chainOfDay, data.chainOfWeek,
					data.chainOfMonth ];
			var suffix = '%';
			// 添加%
			if (setRatioValFn != null && setRatioValFn != 'undifined')
				for (var i = 0; i < ratioList.length; i++)
					setRatioValFn(ratioList[i], suffix);

			$("#chain").bootstrapTable('load', ratioList);
		}
	});
}

/**
 * name: 地图列名 data: 地图列数据 pointColor: 列标记颜色（就是那个小红冒泡的） markPointData:
 * 列标记数据（哪些地方冒泡）
 * 
 */
function getMapSeries(name, data, pointColor, markPointData, symbolSize) {
	return {
		name : name,
		type : 'map',
		mapType : 'china',
		roam : false,
		itemStyle : {
			normal : {
				label : {
					show : true
				}
			},
			emphasis : {
				label : {
					show : true
				}
			}
		},
		data : data,
		geoCoord : geoCoord,
		markPoint : {
			symbol : 'pin',
			symbolSize : function(v) {
				return 10 + v / (symbolSize ? symbolSize : 100)
			},
			itemStyle : {
				normal : {
					color : pointColor,
					label : {
						show : true,
						formatter : pointFormatterFn
					}
				}
			},
			data : markPointData
		}
	}
}

/**
 * 获取标签内name对象
 * 
 * @param tagId
 * @param name
 * @returns
 */
function getActivityThePageObjByName(tagId, name) {
	return jQuery("#" + tagId + " [name='" + name + "']");
}

/**
 * 根据区域等级或者区域父ID 查询数据 并且回调fn selectId 为工具栏中的 postData 请求参数 url 请求url
 * 
 */
function searchMerchantTotalData(fn, selectName, tableName, url, postData) {
	$.ajax({
		type : "POST",
		url : url,
		data : postData,
		dataType : "json",
		success : function(data) {
			fn(data, selectName, tableName);
		}
	});
}

/**
 * 清除下拉框数据
 */
function clearData(tagId, clearSelectIds) {
	for (var i = 0; i < clearSelectIds.length; i++){
		getActivityThePageObjByName(tagId, clearSelectIds[i]).empty();
	}
}

var sd = null; // 查询开始时间
var ed = null; // 查询结束时间

/**
 * 初始化下拉框选中事件
 */
/**
 * 初始化下拉框选中事件
 */
function initToolBarChangeEvent(tagId, url, initTableDataFn) {

	getActivityThePageObjByName(tagId, "select_city").change(
			function() {
				selectEvent(tagId, [ 'select_area', 'select_part_area',
						'select_website' ], "select_area", $(this).val(), 3,
						url, initTableDataFn);
			});

	getActivityThePageObjByName(tagId, "select_area").change(
			function() {
				selectEvent(tagId, [ 'select_part_area', 'select_website' ],
						"select_part_area", $(this).val(), 4, url,
						initTableDataFn);
			});

	getActivityThePageObjByName(tagId, "select_part_area").change(
			function() {
				selectEvent(tagId, [ 'select_website' ], "select_website", $(
						this).val(), 5, url, initTableDataFn);
			});

	getActivityThePageObjByName(tagId, "select_website").change(function() {
		selectEvent(tagId, '', "", $(this).val(), 6, url, initTableDataFn);
	});
	// 判断是否有网点
	/*
	 * if(getActivityThePageObjByName(tagId, 'select_site')){
	 * getActivityThePageObjByName(tagId, "select_site").change(function() {
	 * selectEvent(tagId, '', "", $(this).val(), 6, url, initTableDataFn); }); }
	 */
}

/**
 * 
 * @param tagId
 * @param clearData
 * @param level
 */
function selectEvent(tagId, clearSelectIds, selectName, orgId, level, url,
		initTableDataFn) {
	clearData(tagId, clearSelectIds);
	var postData = "level=" + level + "&orgId=" + orgId + "&" + postData
			+ "&sd=" + sd + "&ed=" + ed;
	;

	searchTotalDataByMap(initTableDataFn, selectName,
			'chart_map_table_city', url, postData);//去除了merchant前缀
}

function searchTotalDataByMap(fn, selectName, tableName, url, postData) {
	$.ajax({
		type : "POST",
		url : url,
		data : postData,
		dataType : "json",
		success : function(data) {
			fn(data, selectName, tableName);
		}
	});
}

/**
 * 地图tag时间选择
 * 当页面有多个tag时，可以统一使用此函数
 * @param day		选择的天数
 * @param tagObj	tag的上下文对象，用于指定要更新的tag，防止错误地更新了其他tag的内容
 */
function chooseTagTime(day, tagObj){ 
	ed = new Date().getTime();
	sd = ed - day*24*3600*1000;
	
	//显示加载中动画
	tagObj.map_chart_obj.showLoading();
	
	searchTotalDataByMap(tagObj.initMap, null, null, tagObj.url, "level=2&orgId=0&sd="+sd+"&ed="+ed); 
}
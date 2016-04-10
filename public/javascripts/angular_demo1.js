var app = angular.module("myApp", []);
app.controller('progress',function($scope){
	var vm = $scope.vm ={};
	vm.type = ['progress-bar-info','progress-bar-success','progress-bar-warning','progress-bar-danger']
	vm.progress = [{'type':'progress-bar-danger','width':50}];
	vm.addProgress = function(type,width){
		if(type&&width){
			vm.progress.push({'type':type,'width':width})
		}else{
			alert('请填写完整信息再添加');
		}
	};
	vm.changeProgress = function(index){
		if(vm.addType&&vm.addWidth){
			vm.progress.splice(index,1,{type:vm.addType,width:vm.addWidth})
		}
	};
	vm.removeProgress = function(index){
		vm.progress.splice(index,1);
	};
});
app.directive('progressBar',function(){
	return{
		template: '<table class="table">'+
		'<tr ng-repeat="bar in vm.progress"><td>'+'<div class="progress"><div ng-class="[\'progress-bar\',bar.type]" ng-style="{width: bar.width+\'%\'};">{{bar.width}}%</div></div></td><td><button class="btn btn-info" ng-click="vm.addType=bar.type;vm.addWidth=bar.width">获取</button><button class="btn btn-warning" ng-click="vm.changeProgress($index)">更改</button><button class="btn btn-danger" ng-click="vm.removeProgress($index)">删除</button></td></tr></table>'
	}
});
app.constant('cityData',[
{
	'name': '中国',
	'provinces':[{
		'name':'北京市',
		'city':[{'name':'海淀区'},{'name':'东城区'},{'name':'西城区'}]
	},{
		'name': '广东省',
		'city':[{'name':'广州市'},{'name':'佛山市'},{'name':'深圳市'},{'name':'汕头市'}]
	},{
		'name': '广西省',
		'city':[{'name':'桂林市'},{'name':'南宁市'}]
	}]
},{
	'name':'美国',
	'provinces':[{
		'name': '纽约',
		'city':[{'name':'曼哈顿区'},{'name':'皇后区'}]
	},{
		'name': '德克萨斯州',
		'city': [{'name':'休斯顿'},{'name':'达拉斯'}]
	},{
		'name': '加利福尼亚州'
	}]
}]);
app.controller('select',function($scope,cityData){
	var city = $scope.city = {};
	city.countries = cityData;
	$scope.$watch('city.country',function(){
		city.province = null;
	});
	$scope.$watch(city.province,function(){
		city.city = null;
	})
});
app.directive('citySelect',function(){
	return{
		'restrict': 'E',
		'templateUrl': '../views/citySelect.html'
	}
})
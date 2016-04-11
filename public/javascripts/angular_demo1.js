var app = angular.module("myApp", []);
app.controller('progress',function($scope){
	var vm = $scope.vm ={};
	vm.type = ['progress-bar-info','progress-bar-success','progress-bar-warning','progress-bar-danger','progress-bar-primary']
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
app.controller('editableTable',function($scope){
	var vm = $scope.vm = {};
	vm.th = [{
		'label': '用户ID',
		'column': 'id',
	},{
		'label': '用户名',
		'column': 'name',
	},{
		'label': '联系电话',
		'column': 'mobile',
	},{
		'label': '累计消费（元）',
		'column': 'price',
	},{
		'label': '操作',
		'column': 'action',
		'sortable': false
	}];
	var num = 20;
	vm.items = [];
	function numbers(i){
		return Math.random().toFixed(i)*Math.pow(10,i)
	}
	for(var i = 0; i < num; i++){
		vm.items[i]={
			'id': i,
			'name': 'name'+(num-i),
			'mobile': numbers(3),
			'price': numbers(5),
			'editing': false,
		}
	}
	/*删*/
	vm.removeItem = function(index){
		vm.items.splice(index,1);
	}
	/*排序*/
	vm.sort = {
		column: 'id',
		reverse: true,
		toggle: function(th){
			if(th.sortable === false) return;
			if(this.column == th.column){
				this.reverse = !this.reverse
			}else{
				this.column = th.column;
			}
		}
	};
	/*分页*/
	vm.page = {
		index: 1,
		size: 5,
	};
	$scope.$watch('vm.page.size',function(){
		vm.page.index = 1;
	})

});
app.filter('pagination',function(){
	return function(items,index,size){
		if(items.length){
			return items.slice((index-1)*size,index*size);
		}
	}
});
app.controller('select',function($scope,cityData){
	var city = $scope.city = {};
	city.countries = cityData;
	$scope.$watch('city.country',function(){
		city.province = null;
	});
	$scope.$watch(city.province,function(){
		city.city = null;
	});

	var page = $scope.page = {};
	page.size = [5,10,20];
});
app.directive('citySelect',function(){
	return{
		'restrict': 'E',
		'templateUrl': '../views/citySelect.html'
	}
});
app.directive('pageSelect',function(){
	return {
		'restrict':'E',
		'templateUrl':'../views/pageSelect.html'
		
	}
});
app.directive('pagination',function(){
	return {
		'restrict': 'E',
		'template': '<ul class="pagination pagination-sm">'+
				'<li><a ng-click="previousPage()" ><span>&laquo;</span></a></li>'+
				'<li><a ng-click="page.index = start ">{{start}}</a></li>'+
				'<li><a ng-click="page.index = end">{{end}}</a></li>'+
				'<li><a ng-click="nextPage()" ><span>&raquo;</span></a></li>'+
				'</ul>',
		'scope': {
			'items': '=totalItems',
			'page': '=totalPage',
		},
		'link': function($scope,ele,attrs){
			var pages = 0;
			$scope.$watch('page.size',function(){
				console.log($scope.items);
				pages = Math.ceil($scope.items.length/$scope.page.size);
				console.log(pages);
				$scope.start = 1;
				$scope.end = $scope.start +1;
			});
			
			$scope.previousPage = function(){
				if($scope.start>2){
					$scope.start -= 2;
					$scope.end -= 2;
				}
			};
			$scope.nextPage = function(){
				if($scope.start<pages-2){
					$scope.start += 2;
					$scope.end += 2;
				}
			};
			$scope.$watch('page.size',function(){
				$scope.start = 1;
				$scope.end = $scope.start +1;
			})
			
		}
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
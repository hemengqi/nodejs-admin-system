var app = angular.module("myApp", []);
app.directive('progressBar',function(){
	return{
		template: '<div class="progress">'+
			  '<div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%;">'+
			    '60%'+
			  '</div>'+
			'</div>'
	}
})
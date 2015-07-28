'use strict';
/**
 * Created by mindroc on 10/8/14.
 */
 angular.module('candyUiApp')
 .service('fileUpload', ['$http', function ($http, $scope) {
 	this.uploadFileToUrl = function(file, uploadUrl, scope){
 		var fd = new FormData();
 		fd.append('file', file);
 		return $http.post(uploadUrl, fd, {
 			transformRequest: angular.identity,
 			headers: {'Content-Type': undefined}
 		});
 	}
 }])
 .directive('fileModel', ['$parse', function ($parse) {
 	return {
 		restrict: 'A',
 		link: function(scope, element, attrs) {
 			var model = $parse(attrs.fileModel);
 			var modelSetter = model.assign;
 			
 			element.bind('change', function(){
 				scope.$apply(function(){
 					modelSetter(scope, element[0].files[0]);
 				});
 			});
 		}
 	};
 }])
 .controller('UploadCtrl', function ($rootScope, $scope, fileUpload) {
 	$rootScope.currentController = 'upload';

 	$scope.uploadUrl = "/api/upload";
 	$scope.alerts = [];
 	$scope.uploadDone = true;


 	$scope.formatSize = function(size){
 		if(size == undefined){
 			return "";
 		}
 		if(size > 1024 * 1024 * 1024){
 			return "(" + Math.round((size/(1024 * 1024 * 1024)) * 100) / 100 + "GB" + ")";
 		}
 		else if(size > 1024*1024){
 			return "(" + Math.round((size/(1024*1024)) * 100) / 100 + "MB" + ")";
 		} else if(size > 1024){
 			return "(" + Math.round((size/1024) * 100) / 100 + "KB" + ")";
 		} else {
 			return "(" + Math.round(size * 100) / 100 + "B" + ")";
 		}
 	}

 	$scope.addAlert = function(alert){
 		$scope.alerts.push(alert);
 	};

 	$scope.uploadFile = function(){
 		$scope.uploadDone = false;
 		fileUpload.uploadFileToUrl($scope.file, $scope.uploadUrl)
 		.success(function(data){
 			$scope.uploadDone = true;
 			var alert = {};
 			alert.type = "success";
 			alert.text = "Done uploading ";
 			alert.target = data;

 			$scope.addAlert(alert);
 		})
 		.error(function(error){
 			$scope.uploadDone = true;
 			var alert = {};
 			alert.type = "danger";
 			alert.text = "Error uploading";
 			alert.target = $scope.file.name;

 			$scope.addAlert(alert);
 		});
}

$scope.closeAlert = function(index) {
	$scope.alerts.splice(index, 1);
};

});

'use strict';
/**
 * Created by mindroc on 10/8/14.
 */
 angular.module('candyUiApp')
 .controller('AsmCtrl', function ($rootScope, $scope, $http, $modal, $log) {
 	$rootScope.currentController = 'asm';

 	$scope.functionsEndpoint = "/api/functions";
 	$scope.filesEndpoint = "/api/files";
 	$scope.assemblyEndpoint = "/api/assembly";

 	//$scope.selectedFile = "";
 	$scope.selectedFile = "three-functions";
 	
 	//$scope.selectedFunction = "";
 	$scope.selectedFunction = "printf";

 	$scope.selectedFunction2 = "";
 	$scope.selectedFunction3 = "";

 	$scope.currentAssembly = "";

 	$scope.filesList = [];
 	$scope.functionsList = [];
 	$scope.assemblyDict = {};
 	

 	$scope.setFile = function(fileName){
 		$scope.selectedFile = fileName;
 		$http.get($scope.functionsEndpoint, {params:{filename:fileName}}).success(function (data) {
 			$scope.functionsList = data;
 			$scope.source = data;
 			$scope.textFilter = "";
 		});
 		$scope.selectedFunction = "";
 		$scope.selectedFunction2 = "";
 		$scope.selectedFunction3 = "";
 	};

 	$scope.setFunction = function(functionName){
 		$scope.selectedFunction = functionName;
 		var fileName = $scope.selectedFile;
 		$http.get($scope.assemblyEndpoint, {params:{filename:fileName, functionname: functionName}, cache:true}).success(function (data) {
 			$scope.currentAssembly = data;
 		});
 		
 		$scope.selectedFunction2 = "";
 		$scope.selectedFunction3 = "";
 	};

 	$scope.setFunction2 = function(functionName){
 		if(typeof functionName == "undefined"){
 			return;
 		}
 		$scope.selectedFunction2 = functionName;
 		var fileName = $scope.selectedFile;
 		$http.get($scope.assemblyEndpoint, {params:{filename:fileName, functionname: functionName}, cache:true}).success(function (data) {
 			$scope.currentAssembly2 = data;
 		});
 		
 		$scope.selectedFunction3 = "";
 	};

 	$scope.setFunction3 = function(functionName){
 		if(typeof functionName == "undefined"){
 			return;
 		}
 		$scope.selectedFunction3 = functionName;
 		var fileName = $scope.selectedFile;
 		$http.get($scope.assemblyEndpoint, {params:{filename:fileName, functionname: functionName}, cache:true}).success(function (data) {
 			$scope.currentAssembly3 = data;
 		});
 	};

 	$scope.openStatsModal = function () {
 		var modalInstance = $modal.open({
 			animation: $scope.animationsEnabled,
 			templateUrl: 'views/statsTemplate.html',
 			controller: 'statsCtrl',
 			resolve: {
 				functionName: function () {
 					return $scope.selectedFunction;
 				},
 				fileName: function () {
 					return $scope.selectedFile;
 				},
 				assemblyEndpoint: function() {
 					return $scope.assemblyEndpoint;
 				}
 			}
 		});
 	};



 	$scope.init = function(){
 		$http.get($scope.filesEndpoint).success(function (data) {
 			$scope.filesList = data;
 			$scope.source = data;
 		});

 		// $scope.setFile($scope.selectedFile);
 		// $scope.setFunction($scope.selectedFunction);
 		$scope.openStatsModal();
 	}

 	$scope.init();


 	$scope.getFileBackgroundStyle = function(entry){
 		if($scope.selectedFile == entry){
 			return {'background-color': '#B2DDEB'}
 		}
 	};

 	$scope.getCodeStyle = function(instr){
 		if(instr.indexOf("call") == 0)
 			if(instr.indexOf("RIP") == -1)
 				return 'callInstructionNotClickable';
 			else
 				return 'callInstruction';
 			if(instr.indexOf("j") == 0)
 				return 'jmpInstruction';
 		}

 		$scope.format = function(line){
 			var name = line.name;
 			if(name.indexOf("call") == 0 && name.indexOf("RIP") != -1)
 				return "call " + line.dest
 			else
 				return line.name;
 		}

 		$scope.numPerPage = 10;
 		$scope.currentPage = 1;

 		$scope.paginate = function(value){
 			var begin, end, index;
 			begin = ($scope.currentPage - 1) * $scope.numPerPage;
 			end = begin + $scope.numPerPage;
 			index = $scope.functionsList.indexOf(value);
 			return (begin <= index && index < end);
 		};

 		$scope.checkFilterEmpty = function(){
 			if($scope.textFilter.length == 0)
 				$scope.functionsList = $scope.source;
 		};

 		$scope.filterTableData = function(){
 			var textFilter = $scope.textFilter.toLowerCase();
 			if($scope.textFilter.length == 0){
 				$scope.functionsList = $scope.source;
 			} else {
 				$scope.functionsList = $scope.source.filter(
 					function(a){
 						var name = a.name.toLowerCase();
 						var address = a.address.toLowerCase();
 						try {
 						//valid regex
 						var regex = new RegExp(textFilter);
 						return regex.test(name);
 					} catch (e) {
 						return (name.indexOf(textFilter) > -1 || address.indexOf(textFilter) > -1);	
 					}
 					//return (name.indexOf($scope.textFilter.toLowerCase()) > -1 || address.indexOf($scope.textFilter.toLowerCase()) > -1);
 				}
 				);
 			}
 		};
 	});
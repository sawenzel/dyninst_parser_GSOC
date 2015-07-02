'use strict';
/**
 * Created by mindroc on 10/8/14.
 */
 angular.module('candyUiApp')
 .controller('AsmCtrl', function ($rootScope, $scope, $http) {
 	$rootScope.currentController = 'asm';

 	$scope.functions_mapping = "/api/functions";
 	$scope.files_mapping = "/api/files";
 	$scope.assembly_mapping = "/api/assembly";

 	$scope.selectedFile = "";
 	$scope.selectedFunction = "";
 	$scope.selectedFunction2 = "";
 	$scope.selectedFunction3 = "";

 	$scope.currentAssembly = "";

	$scope.filesList = [];
	$scope.assemblyDict = {};
 	
 	$scope.init = function(){
 		$http.get($scope.files_mapping).success(function (data) {
 			$scope.filesList = data;
 			$scope.source = data;
 		});
 	}

 	$scope.init();

 	$scope.setFile = function(fileName){
 		$scope.selectedFile = fileName;
 		$http.get($scope.functions_mapping, {params:{filename:fileName}}).success(function (data) {
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
 		$http.get($scope.assembly_mapping, {params:{filename:fileName, functionname: functionName}, cache:true}).success(function (data) {
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
 		$http.get($scope.assembly_mapping, {params:{filename:fileName, functionname: functionName}, cache:true}).success(function (data) {
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
 		$http.get($scope.assembly_mapping, {params:{filename:fileName, functionname: functionName}, cache:true}).success(function (data) {
 			$scope.currentAssembly3 = data;
 		});
 	};

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
 		if($scope.textFilter.length == 0){
 			$scope.functionsList = $scope.source;
 		} else {
 			$scope.functionsList = $scope.source.filter(
 				function(a){
 					var name = a.name.toLowerCase();
 					var address = a.address.toLowerCase();
 					try {
 						//valid regex
 						var regex = new RegExp($scope.textFilter);
 						return regex.test(name);
 					} catch (e) {
 						return (name.indexOf($scope.textFilter.toLowerCase()) > -1 || address.indexOf($scope.textFilter.toLowerCase()) > -1);	
 					}
 					//return (name.indexOf($scope.textFilter.toLowerCase()) > -1 || address.indexOf($scope.textFilter.toLowerCase()) > -1);
 				}
 			);
 		}
 	};
 });

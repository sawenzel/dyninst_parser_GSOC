'use strict';
/**
 * Created by mindroc on 10/8/14.
 */
 angular.module('candyUiApp')
 .controller('AsmCtrl', function ($rootScope, $scope, $http, $modal, $log) {
 	$rootScope.imageURI = {};
 	$rootScope.currentController = 'asm';

 	$scope.archiveFuncsEndpoint = "/api/archivefuncs";
 	$scope.archiveAssemblyEndpoint = "/api/archive";

 	$scope.functionsEndpoint = "/api/functions";
 	$scope.filesEndpoint = "/api/files";
 	$scope.assemblyEndpoint = "/api/assembly";

 	$scope.selectedFile = "";
 	$scope.selectedFunction = "";
 	$scope.selectedFunction2 = "";
 	$scope.selectedFunction3 = "";

 	$scope.currentAssembly = "";

 	$scope.filesList = [];
 	$scope.functionsList = undefined;
 	$scope.assemblyDict = {};

 	//we don't have endsWith on safari
 	if (!String.prototype.endsWith) {
 		String.prototype.endsWith = function(searchString, position) {
 			var subjectString = this.toString();
 			if (position === undefined || position > subjectString.length) {
 				position = subjectString.length;
 			}
 			position -= searchString.length;
 			var lastIndex = subjectString.indexOf(searchString, position);
 			return lastIndex !== -1 && lastIndex === position;
 		};
 	}

 	$scope.setObjectFile = function(fileName){
 		$scope.selectedObjectFile = fileName;
 		$scope.functionsList = $scope.archiveMap[fileName];
 		$scope.source = $scope.archiveMap[fileName];

 		$scope.selectedFunction = "";
 		$scope.selectedFunction2 = "";
 		$scope.selectedFunction3 = "";
 	}

 	$scope.checkSizeToFilterData = function(){
 		if($scope.functionsList.length < 1000)
 			$scope.filterTableData();
 	}

 	$scope.filterObjectTableData = function(){
 		var textFilter = $scope.objectTextFilter;
 		if(textFilter.length == 0){
 			$scope.archiveFiles = $scope.originalArchiveFiles;
 		} else {
 			$scope.archiveFiles = $scope.originalArchiveFiles.filter(
 				function(a){
 					return $scope.archiveMap[a].map(function(x){return x['name']}).indexOf(textFilter) != -1;
 				}
 			);
 		}
 	}

 	$scope.setFile = function(fileName){
 		$scope.selectedFile = fileName;
 		$scope.functionsList = undefined;
 		$scope.archiveMap = undefined;
 		$scope.isCurrentFileArchive = false;

 		$scope.error = "";
 		if(fileName.endsWith(".a")){
 			$http.get($scope.archiveFuncsEndpoint, {params:{filename:fileName}}).success(function (data) {
 				$scope.archiveMap = data;
 				$scope.archiveFiles = Object.keys(data);
 				$scope.originalArchiveFiles = Object.keys(data);
 				$scope.isCurrentFileArchive = true;

 				// console.log(data);
 				$scope.autoCompleteValues = [];
 				$scope.objectFunctions = [];
 				for (var i in data){
 					$scope.autoCompleteValues = $scope.autoCompleteValues.concat(data[i].map(function(x){return x['name']}));
 				}
 			});
 		} else {
 			$http.get($scope.functionsEndpoint, {params:{filename:fileName}}).success(function (data) {
 				if("error" in data){
 					$scope.error = data["error"];
 					$scope.functionsList = [];
 					$scope.assemblyDict = {};
 					$scope.selectedFile = "";
 				} else {
 					$scope.functionsList = data;
 					$scope.source = data;
 					$scope.textFilter = "";
 				}
 			});
 		}
 		$scope.selectedFunction = "";
 		$scope.selectedFunction2 = "";
 		$scope.selectedFunction3 = "";
 	};

 	$scope.setFunction = function(functionName, address){
 		$scope.selectedFunction = functionName;
 		$scope.selectedFunctionAddress = address;

 		var fileName = $scope.selectedFile;
 		var addressVal = address;
 		if($scope.isCurrentFileArchive == false){
 			$http.get($scope.assemblyEndpoint, {params:{filename:fileName, functionname: functionName}, cache:true}).success(function (data) {
 				$scope.currentAssembly = data;
 			});

 			$scope.selectedFunction2 = "";
 			$scope.selectedFunction3 = "";
 		} else {
 			var objectName = $scope.selectedObjectFile;
 			$http.get($scope.archiveAssemblyEndpoint, {params:{filename:fileName, objectname: objectName, address:addressVal, functionname: functionName}, cache:true}).success(function (data) {
 				$scope.currentAssembly = data;
 			});
 		}
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
 			windowClass: 'app-modal-window',
 			resolve: {
 				functionName: function () {
 					return $scope.selectedFunction;
 				},
 				fileName: function () {
 					return $scope.selectedFile;
 				},
 				objectFileName : function() {
 					return $scope.selectedObjectFile;
 				},
 				address : function(){
 					return $scope.selectedFunctionAddress;
 				},
 				isCurrentFileArchive: function() {
 					return $scope.isCurrentFileArchive;
 				},
 				prevFunction: function(){
 					return undefined;
 				}
 			}
 		});
 	};

 	$scope.init = function(){
 		$http.get($scope.filesEndpoint).success(function (data) {
 			$scope.filesList = data;
 			$scope.source = data;
 		});
 	}

 	$scope.init();


 	$scope.getBackgroundStyle = function(entry, entrySetName){
 		if(entrySetName == "files"){
 			if($scope.selectedFile == entry){
 				return {'background-color': '#B2DDEB'}
 			}
 		} else if(entrySetName == "object files"){
 			if($scope.selectedObjectFile == entry){
 				return {'background-color': '#B2DDEB'}
 			}
 		} else if(entrySetName == "functions"){
 			if($scope.selectedFunction == entry.name && $scope.selectedFunctionAddress == entry.address){
 				return {'background-color': '#B2DDEB'}
 			}
 		}
 	};

 	$scope.getCodeStyle = function(instr){
 		if(instr.indexOf("call") == 0)
 			if(instr.indexOf("RIP") == -1)
 				return 'callInstructionNotClickable boldText';
 			else
 				return 'callInstruction boldText';
 			if(instr.indexOf("j") == 0)
 				return 'jmpInstruction';
 		}

 		$scope.format = function(line){
 			var name = line.name;
 			if(line.dest != undefined && name.indexOf("call") == 0 && name.indexOf("RIP") != -1)
 				return "call " + line.dest
 			else
 				return line.name;
 		}

 		$scope.numPerPage = 10;
 		$scope.currentPage = 1;
 		$scope.currentPageArchive = 1;

 		$scope.paginateArchive = function(value){
 			var begin, end, index;
 			begin = ($scope.currentPageArchive - 1) * $scope.numPerPage;
 			end = begin + $scope.numPerPage;
 			index = $scope.archiveFiles.indexOf(value);
 			return (begin <= index && index < end);
 		};

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
 							var regex = new RegExp(textFilter);
 							return regex.test(name);
 						} catch (e) {
 							return (name.indexOf(textFilter) > -1 || address.indexOf(textFilter) > -1);	
 						}
 					}
 				);
 			}
 		};
 	});

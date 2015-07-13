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
 	$scope.selectedFunction = [];
 	$scope.currentAssembly = [];

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

 	$scope.setFile = function(fileName){
 		$scope.selectedFile = fileName;
 		$scope.functionsList = []
 		$scope.source = [];

 		$scope.error = "";
 		if(fileName.endsWith(".a")){
 			$http.get($scope.archiveFuncsEndpoint, {params:{filename:fileName}}).success(function (data) {
 				for(var i in data){
 					$scope.functionsList = $scope.functionsList.concat(data[i].map(function(x){x['obj']=i; return x}));
 				}
 				$scope.source = $scope.functionsList.slice(0);
 				$scope.isCurrentFileArchive = true;
 			});
 		} else {
 			$http.get($scope.functionsEndpoint, {params:{filename:fileName}}).success(function (data) {
 				if("error" in data){
 					$scope.error = data["error"];
 					$scope.assemblyDict = {};
 					$scope.selectedFile = "";
 				} else {
 					$scope.functionsList = data;
 					$scope.textFilter = "";
 				}
 				$scope.source = $scope.functionsList.slice(0);
 				$scope.isCurrentFileArchive = false;
 			});
 		}

 		$scope.selectedFunction = [];
 		$scope.textFilter = "";
 	};


 	function findFuncByName(functionName){
 		for(var i in $scope.source){
			if($scope.source[i].name == functionName){
				return $scope.source[i];
			}
		}
 	}

 	$scope.setFunction = function(functionEntry, index){
 		if(index == 0)
 			$scope.selectedFunction = [];

 		var functionName = functionEntry['name'];
 		var functionObjFile = functionEntry['obj'];
 		var functionAddr = functionEntry['address'];

 		if('dest' in functionEntry){
			//set a destination function
			functionName = functionEntry['dest'];
			var destFunc = findFuncByName(functionName);

			functionObjFile = destFunc.obj;
			functionAddr = destFunc.address;
		}

 		$scope.selectedFunction[index] = {};
 		$scope.selectedFunction[index].name = functionName;
 		$scope.selectedFunction[index].addr = functionAddr;
 		$scope.selectedFunction[index].obj = functionObjFile;

 		var fileName = $scope.selectedFile;

 		if($scope.isCurrentFileArchive == true){
 			$http.get($scope.archiveAssemblyEndpoint, {params:{filename:fileName, objectname: functionObjFile, address:functionAddr, functionname: functionName}, cache:true}).success(function (data) {
 				$scope.currentAssembly[index] = data;
 			});
 		} else {
 			$http.get($scope.assemblyEndpoint, {params:{filename:fileName, functionname: functionName}, cache:true}).success(function (data) {
 				$scope.currentAssembly[index] = data;
 			});
 		}

 		$scope.textFilter = "";
 	};

 	$scope.openStatsModal = function (functionEntry) {
 		var modalInstance = $modal.open({
 			animation: $scope.animationsEnabled,
 			templateUrl: 'views/statsTemplate.html',
 			controller: 'statsCtrl',
 			windowClass: 'app-modal-window',
 			resolve: {
 				functionName: function () {
 					return functionEntry.name;
 				},
 				fileName: function () {
 					return $scope.selectedFile;
 				},
 				objectFileName : function() {
 					return functionEntry.obj;
 				},
 				address : function(){
 					return functionEntry.addr;
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
 							return (regex.test(name) || regex.test(address));
 						} catch (e) {
 							return (name.indexOf(textFilter) > -1 || address.indexOf(textFilter) > -1);	
 						}
 					}
 					);
 			}
 		};
 	});

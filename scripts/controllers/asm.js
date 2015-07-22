'use strict';
/**
 * Created by mindroc on 10/8/14.
 */
 angular.module('candyUiApp')
 .controller('AsmCtrl', function ($rootScope, $scope, $http, $modal, $anchorScroll, $location) {

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
 	$scope.assemblyLoading = [];

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

 	if (!String.prototype.startsWith) {
 		String.prototype.startsWith = function(searchString, position) {
 			position = position || 0;
 			return this.indexOf(searchString, position) === position;
 		};
 	}

 	$scope.setFile = function(fileName, sortBy, sortDirection){
 		$scope.selectedFile = fileName;
 		$scope.sortBy = sortBy;
 		$scope.sortDirection = sortDirection;
 		$scope.functionsList = []
 		$scope.source = [];

 		$scope.functionsLoading = true;

 		$scope.error = "";
 		if(fileName.endsWith(".a")){
 			$http.get($scope.archiveFuncsEndpoint, {params:{filename:fileName, sortby:sortBy, sortdirection:sortDirection}}).
 				success(function (data) {
 				if((typeof data) == 'string' && data.startsWith("error")){
 					$scope.error = data;
 					$scope.assemblyDict = {};
 					$scope.selectedFile = "";
 					$scope.functionsList = undefined;
 				} else {
 					$scope.functionsList = data;
 					$scope.source = $scope.functionsList.slice(0);
 				}

 				$scope.isCurrentFileArchive = true;
 				$scope.functionsLoading = false;
 				});
 		} else {
 			$http.get($scope.functionsEndpoint, {params:{filename:fileName, sortby:sortBy, sortdirection:sortDirection}}).
 				success(function (data) {
 				if((typeof data) == 'string' && data.startsWith("error")){
 					$scope.error = data;
 					$scope.assemblyDict = {};
 					$scope.selectedFile = "";
 					$scope.functionsList = undefined;
 				} else {
 					$scope.functionsList = data;
 					$scope.source = $scope.functionsList.slice(0);
 					$scope.textFilter = "";
 				}

 				$scope.isCurrentFileArchive = false;
 				$scope.functionsLoading = false;
 			});
 		}

 		$scope.selectedFunction = [];
 		$scope.textFilter = "";
 	};

 	$scope.setFunction = function(functionEntry){
 		$scope.selectedFunction = [];


 		var functionName = functionEntry['name'];
 		var functionObjFile = functionEntry['obj'];
 		var functionAddr = functionEntry['address'];
 		var fileName = $scope.selectedFile;

 		$scope.assemblyLoading[0] = true;

 		$scope.selectedFunction[0] = {};
 		$scope.selectedFunction[0].name = functionName;
 		$scope.selectedFunction[0].address = functionAddr;
 		$scope.selectedFunction[0].obj = functionObjFile;

 		if($scope.isCurrentFileArchive == true){
 			$http.get($scope.archiveAssemblyEndpoint, {params:{filename:fileName, objectname: functionObjFile, address:functionAddr, functionname: functionName}, cache:true}).success(function (data) {
 				$scope.currentAssembly[0] = data;
 				$scope.assemblyLoading[0] = false;
 			});
 		} else {
 			$http.get($scope.assemblyEndpoint, {params:{filename:fileName, functionname: functionName, address: functionAddr}, cache:true}).success(function (data) {
 				$scope.currentAssembly[0] = data;
 				$scope.assemblyLoading[0] = false;
 			});
 		}

 		$scope.textFilter = "";
 	};

 	$scope.setFunction2 = function(assemblyEntry, index){
 		var functionName = assemblyEntry['destName'];
 		var functionObjFile = $scope.selectedFunction[0].obj;
 		var functionAddr = assemblyEntry['destAddr'];
 		var fileName = $scope.selectedFile;

 		$scope.assemblyLoading[index] = true;

 		$scope.selectedFunction[index] = {};
 		$scope.selectedFunction[index].name = functionName;
 		$scope.selectedFunction[index].address = functionAddr;
 		$scope.selectedFunction[index].obj = functionObjFile;

 		if($scope.isCurrentFileArchive == true){
 			$http.get($scope.archiveAssemblyEndpoint, {params:{filename:fileName, objectname: functionObjFile, address:functionAddr, functionname: functionName}, cache:true}).success(function (data) {
 				$scope.currentAssembly[index] = data;
 				$scope.assemblyLoading[index] = false;
 			});
 		} else {
 			$http.get($scope.assemblyEndpoint, {params:{filename:fileName, functionname: functionName, address: functionAddr}, cache:true}).success(function (data) {
 				$scope.currentAssembly[index] = data;
 				$scope.assemblyLoading[index] = false;
 			});
 		}

 		$scope.textFilter = "";
 	};

 	$scope.openChartModal = function (functionEntry) {
 		var modalInstance = $modal.open({
 			animation: $scope.animationsEnabled,
 			templateUrl: 'views/statsTemplate.html',
 			controller: 'statsCtrl',
 			windowClass: 'app-modal-window',
 			resolve: {
 				crtFunction: function () {
 					return functionEntry;
 				},
 				fileName: function () {
 					return $scope.selectedFile;
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

 	$scope.openDiffModal = function (functionList) {
 		var modalInstance = $modal.open({
 			animation: $scope.animationsEnabled,
 			templateUrl: 'views/diffTemplate.html',
 			controller: 'diffCtrl',
 			windowClass: 'app-modal-window',
 			resolve: {
 				functionList: function () {
 					return functionList;
 				},
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
 				return {'font-weight' : 'bolder'}
 			}
 		} else if(entrySetName == "object files"){
 			if($scope.selectedObjectFile == entry){
 				return {'font-weight' : 'bolder'}
 			}
 		} else if(entrySetName == "functions"){
 			if($scope.selectedFunction[0]){
 				if($scope.selectedFunction[0].name == entry.name && $scope.selectedFunction[0].address == entry.address && $scope.selectedFunction[0].obj == entry.obj){
 					return {'font-weight' : 'bolder'}
 				}
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
 			if(line.destName != undefined && name.indexOf("call") == 0 && name.indexOf("RIP") != -1)
 				return "call " + line.destName;
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
 						if(a.obj){
 							var obj = a.obj.toLowerCase();
 						}
 						try {
 							var regex = new RegExp(textFilter);
 							return regex.test(name + address + obj);
 						} catch (e) {
 							if($scope.isCurrentFileArchive == true)
 								return (name.indexOf(textFilter) > -1 || address.indexOf(textFilter) > -1 || obj.indexOf(textFilter) > -1);	
 							else
 								return (name.indexOf(textFilter) > -1 || address.indexOf(textFilter) > -1);		
 						}
 					}
 					);
 			}
 		};


 	//diff drop box control
 	$scope.showDiffBox = false;
 	$scope.diffList = [];

 	$scope.remove = function(l, o) {
 		var index = l.indexOf(o);
 		if (index > -1) {
 			l.splice(index, 1);
 		}
 	};

 	$scope.onDragStart = function(data, dragElement) {
 		$scope.showDiffBox = true;
 		$scope.diffBoxClass = "opaque";
 	};

 	$scope.onDataEnd = function() {
 		if($scope.diffList.length < 2){
 			$scope.diffBoxClass = "fade-diff-box";
 		}
 	};

 	$scope.onDragOver = function() {

 	};

 	$scope.onDrop = function(data, dragElement, dropElement) {
 		var id = dragElement.el.context.id;
 		//if a function name is dropped, set it by DOM id, because ad-drag doesn't corectly send data arg
 		if(id != 'address'){
 			data = $scope.selectedFunction[id];
 		}
 		if (data) {
 			data['file'] = $scope.selectedFile.slice(0);
 			$scope.diffList.push(data)

 			if($scope.diffList.length > 2)
 				$scope.diffList.shift();
 		}
 		if($scope.diffList.length < 2){
 			$scope.diffBoxClass = "fade-diff-box";
 		}
 	};
 	
 });

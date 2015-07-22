 angular.module('candyUiApp')
 .controller('diffCtrl', function ($rootScope, $scope, $modalInstance, $http, $modal, $q, functionList) {
 	$scope.functionList = functionList;

 	$scope.diffUsingJS = function(viewType) {
 		"use strict";
 		var byId = function (id) { return document.getElementById(id); },
 		base = difflib.stringAsLines($scope.text1),
 		newtxt = difflib.stringAsLines($scope.text2),
 		sm = new difflib.SequenceMatcher(base, newtxt),
 		opcodes = sm.get_opcodes(),
 		diffoutputdiv = byId("diffoutput");

 		diffoutputdiv.innerHTML = "";

 		var name1 = $scope.functionList[0].name.substring(0, 40) + ($scope.functionList[0].name.length > 40 ? '...' : '');
 		var name2 = $scope.functionList[1].name.substring(0, 40) + ($scope.functionList[1].name.length > 40 ? '...' : '');

 		diffoutputdiv.appendChild(diffview.buildView({
 			baseTextLines: base,
 			newTextLines: newtxt,
 			opcodes: opcodes,
 			baseTextName: name1,
 			newTextName: name2,
 			contextSize: null,
 			viewType: viewType
 		}));
 	}

 	$scope.archiveAssemblyEndpoint = "/api/archive";
 	$scope.assemblyEndpoint = "/api/assembly";

 	$scope.assembly = [];

 	$scope.fillForms = function(func1, func2){
 		$scope.text1 = "";
 		$scope.text2 = "";

 		func1 = $scope.assembly[0];
 		func2 = $scope.assembly[1];

 		for(var i in func1){
 			var obj = func1[i];
 			$scope.text1 += obj["name"] + "\n";
 		}
 		for(var i in func2){
 			var obj = func2[i];
 			$scope.text2 += obj["name"] + "\n";
 		}
 	}

 	//promises here nigga

 	$scope.init = function(){
 		var promises = [];
 		for(i in $scope.functionList){
 			var func = $scope.functionList[i];

 			if(func.obj){
 				//static lib
 				promises.push($http.get($scope.archiveAssemblyEndpoint, {params:{filename:func.file, 
 					objectname:func.obj, address:func.address, functionname:func.name}, cache:true}));
 			} else {
 				//simple object file
 				promises.push($http.get($scope.assemblyEndpoint, {params:{filename:func.file,
 					functionname:func.name, address:func.address}, cache:true}));
 			}
 		}

 		var results = $q.all(promises);
 		results.then(function(result){
 			for(i in result){
 				$scope.assembly[i] = result[i].data;
 			}
 			$scope.fillForms();
 		});
 	};

 	$scope.init();

 	$scope.$on('$viewContentLoaded', function(){
  	});

	
 	$scope.exit = function() {
 		$modalInstance.close();
 	};


/*
 	$scope.text1 = "";
 	$scope.text2 = "";

 	$scope.diffFunctions = [];

 	$scope.switchDiff = function(entry) {
 		var index = $scope.diffFunctions.indexOf(entry.name);
 		if(index == -1)
 			$scope.diffFunctions.push(entry.name);
 		else{
 			$scope.diffFunctions.splice(index, 1);
 		}

 		if($scope.diffFunctions.length > 2)
 			$scope.diffFunctions.shift();
 		
 		$scope.fillForms();
 	}

 	$scope.fillForms = function(func1, func2){
 		$scope.text1 = "";
 		$scope.text2 = "";

 		func1 = $scope.diffFunctions[0];
 		func2 = $scope.diffFunctions[1];

 		for(var key in $scope.assemblyDict[func1]){
 			var obj = $scope.assemblyDict[func1][key];
 			$scope.text1 += obj["name"] + "\n";
 		}
 		for(var key in $scope.assemblyDict[func2]){
 			var obj = $scope.assemblyDict[func2][key];
 			$scope.text2 += obj["name"] + "\n";
 		}
 	}

 	angular.element(document).ready(function () {
 	});

 	$scope.numPerPage = 20;
 	$scope.currentPage = 1;


 	$scope.paginate = function (value) {
 		var begin, end, index;
 		begin = ($scope.currentPage - 1) * $scope.numPerPage;
 		end = begin + $scope.numPerPage;
 		index = $scope.tableItems.indexOf(value);
 		return (begin <= index && index < end);
 	};

 	$scope.setAssembly = function(name){
 		$scope.assembly = $scope.assemblyDict[name];
 		$scope.selectedFunction = name;
 		$scope.selectedFunction2 = undefined;
 	};

 	$scope.setAssembly2 = function(name){
 		$scope.assembly2 = $scope.assemblyDict[name];
 		$scope.selectedFunction2 = name;
 	};

 	$scope.checkFilterEmpty = function(){
 		if($scope.textFilter.length == 0)
 			$scope.tableItems = $scope.source;
 	};

 	$scope.filterTableData = function(){
 		$scope.tableItems = $scope.source.filter(
 			function(a){
 				var name = a.name.toLowerCase();
 				var address = a.address.toLowerCase();
 				return (name.indexOf($scope.textFilter.toLowerCase()) > -1 || address.indexOf($scope.textFilter.toLowerCase()) > -1);
 			}
 			);
 	};
 	*/
 });

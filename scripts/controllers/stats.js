 angular.module('candyUiApp')
 .controller('statsCtrl', function ($scope, $modalInstance, $http, functionName, fileName, assemblyEndpoint) {

 	$scope.functionName = functionName;
 	$scope.fileName = fileName;
 	$scope.assemblyEndpoint = assemblyEndpoint;
 	$scope.currentAssembly = {};

 	branchType = ['jmp', 'jz', 'jnz', 'je', 'jne'];
 	logicType = ['and', 'or', 'xor'];
 	arithmeticType = ['add', 'mul', 'div', 'sub'];

 	$scope.exit = function () {
 		$modalInstance.close();
 	};

 	isBranchType = function(instrName) {
 		for (i in branchType) {
 			if (instrName.startsWith(branchType[i])){
 				return true;
 			}
 		}
 		return false;
 	};

 	isLogicType = function(instrName) {
 		for (i in logicType) {
 			if (instrName.startsWith(logicType[i]))
 				return true;
 		}
 		return false;
 	};

 	isArithmeticType = function(instrName) {
 		for (i in arithmeticType) {
 			if (instrName.startsWith(arithmeticType[i]))
 				return true;
 		}
 		return false;
 	};

 	isMovType = function(instrName) {
 		return instrName.startsWith('mov');
 	};

 	isPushType = function(instrName) {
 		return instrName.startsWith('push');
 	};

 	isPopType = function(instrName) {
 		return instrName.startsWith('pop');
 	};

 	isCallType = function(instrName) {
 		return instrName.startsWith('call');
 	};


 	var chart1 = {};
 	chart1.type = "BarChart";
 	chart1.displayed = false;

 	chart1.data = {
 		"cols": [
 			{id: "instruction-type", type: "string"},
 			{id: "count", type: "number"},
 			],
 		"rows": []
 	};

 	chart1.options = {
 		displayAnnotationsFilter: true,
 		displayLegendValues: false,
 		displayLegendDots: false,
 		legend: {
 			position: 'none'
 		},
 		lineWidth: 1,
 		selectionMode: 'multiple',
 		interpolateNulls: true,
 		colors: ['#428BCA'],

 		explorer: {
 			keepInBounds: true,
 			// axis: 'horizontal',
 			// maxZoomIn: 0.2,
 			// zoomDelta: 1.1
 		},
 		vAxis: {
 			viewWindow: {
 				// max: 5.2,
 				min: 0
 			}
 		},
 		hAxis: {
 			viewWindowMode: "pretty",
 			gridlines: {count: 2},
 			maxTextLines: 3,
 			slantedText: false,
 			minTextSpacing: 50,
 			maxAlternation: 1
 		},
 		annotations: {
 			textStyle: {
 				fontSize: 12
 			}
 		},
 		chartArea: {
 			left: 20,
 			top: 50,
 			width: '100%',
 			height: '70%'
 		}
 	};

 	$scope.chart = chart1;


 	$scope.getInstructions = function(){
 		var fileName = $scope.fileName;
 		var functionName = $scope.functionName;

 		$http.get($scope.assemblyEndpoint, {params:{filename:fileName, functionname: functionName}, cache:true}).success(function (data) {
 			$scope.currentAssembly = data;

 			namesList = data.map(function (a){
 				return a['name'];
 			});
 			
 			$scope.movCounter = namesList.filter(isMovType).length;
 			$scope.logicCounter = namesList.filter(isLogicType).length;
 			$scope.branchCounter = namesList.filter(isBranchType).length;
 			$scope.arithmeticCounter = namesList.filter(isArithmeticType).length;
 			$scope.pushCounter = namesList.filter(isPushType).length;
 			$scope.popCounter = namesList.filter(isPopType).length;
 			$scope.callCounter = namesList.filter(isCallType).length;

 			$scope.otherCounter = namesList.length - $scope.movCounter - $scope.logicCounter - $scope.branchCounter - $scope.arithmeticCounter - $scope.pushCounter -$scope.popCounter - $scope.callCounter;


 			// $scope.chart.data.rows.length = 0;
 			// $scope.chart.data.cols[1].label = $scope.functionName;


			$scope.chart.data.rows.push({c: [
				{v: "mov"},
                {v: $scope.movCounter}
            ]});

			$scope.chart.data.rows.push({c: [
				{v: "logic"},
                {v: $scope.logicCounter}
            ]});

			$scope.chart.data.rows.push({c: [
				{v: "branch"},
                {v: $scope.branchCounter}
            ]});

			$scope.chart.data.rows.push({c: [
				{v: "arithmetic"},
                {v: $scope.arithmeticCounter}
            ]});

			$scope.chart.data.rows.push({c: [
				{v: "push"},
                {v: $scope.pushCounter}
            ]});

			$scope.chart.data.rows.push({c: [
				{v: "pop"},
                {v: $scope.popCounter}
            ]});

			$scope.chart.data.rows.push({c: [
				{v: "call"},
                {v: $scope.callCounter}
            ]});

 		});
 	};

 	$scope.getInstructions();

 	// $scope.cancel = function () {
 	// 	$modalInstance.dismiss('cancel');
 	// };
 });

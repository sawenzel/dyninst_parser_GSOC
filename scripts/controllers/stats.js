 angular.module('candyUiApp')
 .controller('statsCtrl', function ($rootScope, $scope, $modalInstance, $http, functionName, fileName, assemblyEndpoint) {

 	$scope.functionName = functionName;
 	$scope.fileName = fileName;
 	$scope.assemblyEndpoint = assemblyEndpoint;
 	$scope.currentAssembly = {};

 	$scope.instrTypes = {
 		'mov' : ['mov'],
 		'logic' : ['and', 'or', 'xor'],
 		'branch' : ['jmp', 'jz', 'jnz', 'je', 'jne'],
 		'arithmetic' : ['add', 'mul', 'div', 'sub'],
 		'push' : ['push'],
 		'pop' : ['pop'],
 		'call' : ['call'],
 	};

 	$scope.exit = function () {
 		$modalInstance.close();
 	};

 	getInstrCount = function(instrArray, typeToCount){
 		result = [];
 		for (t in $scope.instrTypes[typeToCount]){
 			result[t] = 0;
	 		for (i in instrArray){
 				if(instrArray[i].startsWith($scope.instrTypes[typeToCount][t])){
 					result[t]++;
 				}
 			}	
 		}

 		return result;
 	}

 	getInstrType = function(instrName){
 		for (key in $scope.instrTypes){
 			for(type in $scope.instrTypes[key]){
 				var crtType = $scope.instrTypes[key][type];
				if(instrName.startsWith(crtType))
 					return key;
 			}
 		}

 		return 'other';
 	}

 	$scope.mainChart = {};
 	$scope.mainChart.name = "mainChart";
 	$scope.mainChart.type = "BarChart";

 	$scope.mainChart.data = {
 		"cols": [
 			{id: "instr-type", type: "string"},
 			{id: "count", type: "number"},
 			{role: "tooltip", type: "string", p: {'html': true}},
 			{role: "annotation", type:"string"}
 			],
 		"rows": []
 	};

 	$scope.mainChart.options = {
 		legend: {
 			position: 'none'
 		},
 		tooltip: {
 			ignoreBounds: true,
 			isHtml: true
 		},
 		colors: ['#428BCA'],
 		vAxis: {
 			viewWindowMode: "pretty"
 		},
 		hAxis: {
			scaleType: "mirrorLog",
 		},
 	};

 	$scope.mainChart.data.rows=[];

 	setChartOptions = function(chart){
 			chart.options = {
 				legend: {
 					position: 'none'
 				},
 				colors: ['#428BCA'],
 				hAxis: {
					scaleType: "mirrorLog",
 				},
 			}
 	}

 	setMainChartData = function(instrType){
		$scope.mainChart.data.rows.push({c: [
			{v: instrType},
            {v: $scope.instTypeCount[instrType]},
            {},
            {v: $scope.instTypeCount[instrType]},
        ]});
 	}

 	$scope.getinstrs = function(){
 		var fileName = $scope.fileName;
 		var functionName = $scope.functionName;

 		$http.get($scope.assemblyEndpoint, {params:{filename:fileName, functionname: functionName}, cache:true}).success(function (data) {
 			$scope.currentAssembly = data;

 			namesList = data.map(function (a){
 				return a['name'];
 			});
 			
 			$scope.instTypeCount = {};
 			for (i in $scope.instrTypes){
 				$scope.instTypeCount[i] = namesList.filter(function(x){return (getInstrType(x) == i)}).length;
				setMainChartData(i);
   	 		}

   	 		var otherInstrCount = namesList.length;
   	 		for(i in $scope.instTypeCount){
   	 			otherInstrCount -= $scope.instTypeCount[i];
   	 		}

   	 		//add 'other' count
   	 		$scope.mainChart.data.rows.push({c: [
				{v: 'other'},
            	{v: otherInstrCount},
            	{},
            	{v: otherInstrCount},
        	]});

			$scope.branchTypeCount = getInstrCount(namesList, 'branch');
			$scope.arithmeticTypeCount = getInstrCount(namesList, 'arithmetic');
			$scope.logicTypeCount = getInstrCount(namesList, 'logic');

			console.log($scope.arithmeticTypeCount);

 			$scope.branchChart = {};
 			$scope.branchChart.name = "branchChart";
 			$scope.branchChart.type = "BarChart";

 			$scope.branchChart.data = {
	 			"cols": [
 					{id: "instr-type", type: "string"},
 					{id: "count", type: "number"},
 					{role: "annotation", type: "string"}
 				],
	 			"rows": []
 			};

 			$scope.logicChart = {};
 			$scope.logicChart.name = "logicChart";
 			$scope.logicChart.type = "BarChart";

 			$scope.logicChart.data = {
	 			"cols": [
 					{id: "instr-type", type: "string"},
 					{id: "count", type: "number"},
 					{role: "annotation", type: "string"}
 				],
	 			"rows": []
 			};
 			
 			$scope.arithmeticChart = {};
 			$scope.arithmeticChart.name = "arithmeticChart";
 			$scope.arithmeticChart.type = "BarChart";

 			$scope.arithmeticChart.data = {
	 			"cols": [
 					{id: "instr-type", type: "string"},
 					{id: "count", type: "number"},
 					{role: "annotation", type: "string"}
 				],
	 			"rows": []
 			};

 			setChartOptions($scope.branchChart);
 			setChartOptions($scope.logicChart);
 			setChartOptions($scope.arithmeticChart);


 			var it = 0;
 			for (i in $scope.instrTypes['logic']){
 				$scope.logicChart.data.rows.push({c: [
					{v: $scope.instrTypes['logic'][i]},
	                {v: getInstrCount(namesList, 'logic')[it]},
	                {v: getInstrCount(namesList, 'logic')[it]},
            	]});
            	it++;
 			}

 			it = 0;
 			for (i in $scope.instrTypes['branch']){
 				$scope.branchChart.data.rows.push({c: [
					{v: $scope.instrTypes['branch'][i]},
	                {v: getInstrCount(namesList, 'branch')[it]},
	                {v: getInstrCount(namesList, 'branch')[it]},
            	]});
            	it++;
 			}

 			it = 0;
 			for (i in $scope.instrTypes['arithmetic']){
 				$scope.arithmeticChart.data.rows.push({c: [
					{v: $scope.instrTypes['arithmetic'][i]},
	                {v: getInstrCount(namesList, 'arithmetic')[it]},
	                {v: getInstrCount(namesList, 'arithmetic')[it]},
            	]});
            	it++;
 			}
 		});
 	};

 	$scope.mainChartReady = function(){
 	}

 	getHtmlTooltip = function(tooltipName, title){
 		return '<div class="modal-header"><h4 class="modal-title">' +
 			title +
 			'</h4></div><div class="modal-body"><img src="' +
 			$rootScope.imageURI[tooltipName] + '"></div>';
 	}

 	$scope.setToolTipChart = function(){
 		$scope.mainChart.data.rows[1].c[2] = {v: getHtmlTooltip('logicChart', 'logic instructions distribution')};
 		$scope.mainChart.data.rows[2].c[2] = {v: getHtmlTooltip('branchChart', 'branch instructions distribution')};
 		$scope.mainChart.data.rows[3].c[2] = {v: getHtmlTooltip('arithmeticChart', 'arithmetic instructions distribution')};
 		// console.log($rootScope.imageURI);
		// $scope.mainChart.data.rows[0].c[2] = '<img src="' + $rootScope.imageURI + '">';
 	}

 	$scope.mainChartBefore = function(){
 		// console.log("before");
 	}

 	$scope.getinstrs();

 	// $scope.cancel = function () {
 	// 	$modalInstance.dismiss('cancel');
 	// };
 });

 angular.module('candyUiApp')
 .controller('statsCtrl', function ($rootScope, $scope, $modalInstance, $http, $modal, functionName,
 	fileName, objectFileName, address, isCurrentFileArchive, prevFunction) {

 	$scope.archiveAssemblyEndpoint = "/api/archive";
 	$scope.assemblyEndpoint = "/api/assembly";


 	$scope.isCurrentFileArchive = isCurrentFileArchive;
 	$scope.objectFileName = objectFileName;
 	$scope.functionName = functionName;
 	$scope.fileName = fileName;
 	$scope.currentAssembly = {};
 	$scope.prevFunction = prevFunction;
 	$scope.address = address;

 	branchChart = {};
 	logicChart = {};
 	arithmeticChart = {};
 	otherChart = {};
 	$scope.mainChart = {};

 	$scope.mainChartReady = false;

 	$scope.instrTypes = {
 		'mov' : ['movsd', 'mov'],
 		'logic' : ['and', 'or', 'xorpd', 'xor'],
 		'branch' : ['jmp', 'jz', 'jnz', 'je', 'jne', 'jns', 'jnle', 'jle', 'jnl', 'js', 'jl', 'jnbe'],
 		'arithmetic' : ['add', 'mul', 'div', 'sub', 'shl', 'shr', 'sar'],
 		'push' : ['push'],
 		'pop' : ['pop'],
 		'call' : ['call'],
 		'other' : ['other']
 	};

 	//we don't have startsWith on safari
 	if (!String.prototype.startsWith) {
 		String.prototype.startsWith = function(searchString, position) {
 			position = position || 0;
 			return this.indexOf(searchString, position) === position;
 		};
 	}


 	$scope.exit = function() {
 		$modalInstance.close();
 	};

 	$scope.openStatsModal = function(functionName) {
 		var modalInstance = $modal.open({
 			animation: $scope.animationsEnabled,
 			templateUrl: 'views/statsTemplate.html',
 			controller: 'statsCtrl',
 			windowClass: 'app-modal-window',
 			resolve: {
 				functionName: function () {
 					return functionName;
 				},
 				fileName: function () {
 					return $scope.fileName;
 				},
 				objectFileName : function() {
 					return $scope.objectFileName;
 				},
 				address : function() {
 					return $scope.address;
 				},
 				isCurrentFileArchive: function() {
 					return $scope.isCurrentFileArchive;
 				},
 				prevFunction: function(){
 					return $scope.functionName;
 				}
 			}
 		});
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

 	setToolTipChartOptions = function(chart){
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

 	setToolTipChartStructure = function(chart, name){
 		chart.name = name
 		chart.type = "BarChart";

 		chart.data = {
 			"cols": [
 			{id: "instr-type", type: "string"},
 			{id: "count", type: "number"},
 			{role: "annotation", type: "string"}
 			],
 			"rows": []
 		};
 	}

 	setToolTipChartData = function(namesList, chart, instrType){
 		var index = 0;
 		for (key in $scope.instrTypes[instrType]){
 			if(getInstrCount(namesList, instrType)[index] > 0){
 				chart.data.rows.push({c: [
 					{v: $scope.instrTypes[instrType][key]},
 					{v: getInstrCount(namesList, instrType)[index]},
 					{v: getInstrCount(namesList, instrType)[index]},
 					]});
 			}
 			index++;
 		}
 	}

 	updateData = function(data){
 		$scope.currentAssembly = data;

 			namesList = data.map(function (a){
 				return a['name'];
 			});

 			$scope.allInstrs = namesList;
 			$scope.callDestinations = data.filter(function(x){return ('dest' in x)});

 			$scope.instTypeCount = {};
 			for (i in $scope.instrTypes){
 				$scope.instTypeCount[i] = namesList.filter(function(x){return (getInstrType(x) == i)}).length;
 				if($scope.instTypeCount[i] > 0)
 					setMainChartData(i);
 			}

 			var otherInstrCount = namesList.length;
 			for(i in $scope.instTypeCount){
 				otherInstrCount -= $scope.instTypeCount[i];
 			}

 			$scope.branchTypeCount = getInstrCount(namesList, 'branch');
 			$scope.arithmeticTypeCount = getInstrCount(namesList, 'arithmetic');
 			$scope.logicTypeCount = getInstrCount(namesList, 'logic');

 			setToolTipChartStructure(branchChart, 'branchChart');
 			setToolTipChartStructure(logicChart, 'logicChart');
 			setToolTipChartStructure(arithmeticChart, 'arithmeticChart');
 			setToolTipChartStructure(otherChart, 'otherChart');

 			setToolTipChartOptions(branchChart);
 			setToolTipChartData(namesList, branchChart, 'branch');

 			setToolTipChartOptions(logicChart);
 			setToolTipChartData(namesList, logicChart, 'logic');

 			setToolTipChartOptions(arithmeticChart);
 			setToolTipChartData(namesList, arithmeticChart, 'arithmetic');

 			setToolTipChartOptions(otherChart);

 			//yay for async loading: links to ng-google-chart are made only after all the fields of those objects
 			//have been set
 			$scope.branchChart = branchChart;
 			$scope.logicChart = logicChart;
 			$scope.arithmeticChart = arithmeticChart;
 			$scope.otherChart = otherChart;

 			otherInstrs = namesList.filter(function(x){
 				return (getInstrType(x) == 'other');
 			}).map(function(x){
 				return x.split(" ")[0];
 			});

 			uniqueOthers = otherInstrs.filter(function(item, pos, self) {return self.indexOf(item) == pos;});

 			for (key in uniqueOthers){
 				$scope.otherChart.data.rows.push({c: [
 					{v: uniqueOthers[key]},
 					{v: otherInstrs.filter(function(x){return (x.startsWith(uniqueOthers[key]))}).length},
 					{v: otherInstrs.filter(function(x){return (x.startsWith(uniqueOthers[key]))}).length},
 					]});
 			}
 	}

 	$scope.getinstrs = function(){
 		var fileName = $scope.fileName;
 		var functionName = $scope.functionName;
 		var objectName = $scope.objectFileName;

 		if($scope.isCurrentFileArchive == true){
 			$http.get($scope.archiveAssemblyEndpoint, {params:{filename:fileName, objectname:objectName, address: $scope.address, functionname: functionName}, cache:true}).success(function (data) {
	 			updateData(data);
 			});
 		} else {
 			$http.get($scope.assemblyEndpoint, {params:{filename:fileName, functionname: functionName}, cache:true}).success(function (data) {
	 			updateData(data);
 			});
 		}
};

getHtmlTooltip = function(tooltipName, title){
	return '<div class="modal-header"><h4 class="modal-title">' +
	title +
	'</h4></div><div class="modal-body"><img src="' +
	$rootScope.imageURI[tooltipName] + '"></div>';
}

$scope.setToolTipChartPNG = function(){
	for (i in $scope.mainChart.data.rows){
		if($scope.mainChart.data.rows[i].c[0]['v'] == 'logic'){
			$scope.mainChart.data.rows[i].c[2] = {v: getHtmlTooltip('logicChart', 'logic instructions distribution')};
		}
		if($scope.mainChart.data.rows[i].c[0]['v'] == 'branch'){
			$scope.mainChart.data.rows[i].c[2] = {v: getHtmlTooltip('branchChart', 'branch instructions distribution')};
		}
		if($scope.mainChart.data.rows[i].c[0]['v'] == 'arithmetic'){
			$scope.mainChart.data.rows[i].c[2] = {v: getHtmlTooltip('arithmeticChart', 'arithmetic instructions distribution')};
		}
		if($scope.mainChart.data.rows[i].c[0]['v'] == 'other'){
			$scope.mainChart.data.rows[i].c[2] = {v: getHtmlTooltip('otherChart', 'other instructions distribution')};
		}

	}
}

$scope.getinstrs();
});

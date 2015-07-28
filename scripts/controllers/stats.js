 angular.module('candyUiApp')
 .controller('statsCtrl', function ($rootScope, $scope, $modalInstance, $http, $modal,
 	crtFunction, fileName, isCurrentFileArchive, prevFunction) {

 	$scope.archiveAssemblyEndpoint = "/api/archive";
 	$scope.assemblyEndpoint = "/api/assembly";

 	$scope.crtFunction = crtFunction;
 	$scope.isCurrentFileArchive = isCurrentFileArchive;
 	$scope.fileName = fileName;
 	$scope.prevFunction = prevFunction;

 	$scope.currentAssembly = {};
 	
 	movChart = {};
 	logicChart = {};
 	branchChart = {};
 	arithmeticChart = {};
 	otherChart = {};
 	$scope.mainChart = {};

 	$scope.mainChartReady = false;

 	$scope.instrTypes = {
 		'mov' : ['movsd', 'movapd', 'cmovnb', 'movzx', 'mov'],
 		'logic' : ['and', 'or', 'xorpd', 'xor'],
 		'branch' : ['jmp', 'jz', 'jnz', 'je', 'jne', 'jns', 'jnle', 'jle', 'jnl', 'js', 'jl', 'jnbe'],
 		'arithmetic' : ['mulsd', 'addsd', 'subsd', 'add', 'mul', 'div', 'sub', 'shl', 'shr', 'sar'],
 		'push' : ['push'],
 		'pop' : ['pop'],
 		'call' : ['call'],
 		'other' : ['other']
 	};

 	$scope.exit = function() {
 		$modalInstance.close();
 	};

 	$scope.openStatsModal = function(functionEntry) {
 		var modalInstance = $modal.open({
 			animation: $scope.animationsEnabled,
 			templateUrl: 'views/statsTemplate.html',
 			controller: 'statsCtrl',
 			windowClass: 'app-modal-window',
 			resolve: {
 				crtFunction: function () {
 					if('destName' in functionEntry)
 						return {address:functionEntry.destAddr, name: functionEntry.destName, obj: $scope.crtFunction.obj};
 					else
 						return functionEntry;
 				},
 				fileName: function () {
 					return $scope.fileName;
 				},
 				isCurrentFileArchive: function() {
 					return $scope.isCurrentFileArchive;
 				},
 				prevFunction: function(){
 					return $scope.crtFunction;
 				}
 			}
 		});
 	};

 	getInstrCount = function(instrArray, typeToCount){
 		result = [];
 		for (t in $scope.instrTypes[typeToCount]){
 			result[t] = 0;
 			for (i in instrArray){
 				if(instrArray[i].split(" ")[0] == $scope.instrTypes[typeToCount][t]){
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
 				if(instrName.split(" ")[0] == crtType)
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

 	setMainChartData = function(instrType){
 		$scope.mainChart.data.rows.push({c: [
 			{v: instrType},
 			{v: $scope.instTypeCount[instrType]},
 			{},
 			{v: $scope.instTypeCount[instrType]},
 			]});
 	}

 	initToolTipChart = function(chart, name){
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
 		if(data == undefined || data.length == 0){
 			return;
 		}
 		$scope.currentAssembly = data;

 		namesList = data.map(function (a){
 			return a['name'];
 		});

 		$scope.allInstrs = namesList;
 		$scope.callDestinations = data.filter(function(x){return ('destName' in x)});

 		$scope.instTypeCount = {};
 		for (i in $scope.instrTypes){
 			$scope.instTypeCount[i] = namesList.filter(function(x){return (getInstrType(x) == i)}).length;
 			if($scope.instTypeCount[i] > 0){
 				setMainChartData(i);
 			}
 		}

 		var otherInstrCount = namesList.length;
 		for(i in $scope.instTypeCount){
 			otherInstrCount -= $scope.instTypeCount[i];
 		}

 		$scope.movTypeCount = getInstrCount(namesList, 'mov');
 		$scope.branchTypeCount = getInstrCount(namesList, 'branch');
 		$scope.arithmeticTypeCount = getInstrCount(namesList, 'arithmetic');
 		$scope.logicTypeCount = getInstrCount(namesList, 'logic');

 		initToolTipChart(movChart, 'movChart');
 		initToolTipChart(branchChart, 'branchChart');
 		initToolTipChart(logicChart, 'logicChart');
 		initToolTipChart(arithmeticChart, 'arithmeticChart');
 		initToolTipChart(otherChart, 'otherChart');

 		setToolTipChartData(namesList, branchChart, 'branch');
 		setToolTipChartData(namesList, logicChart, 'logic');
 		setToolTipChartData(namesList, arithmeticChart, 'arithmetic');
 		setToolTipChartData(namesList, movChart, 'mov');

		//yay for async loading: links to ng-google-chart are made only after all the fields of those objects
 		//have been set
 		$scope.movChart = movChart;
 		$scope.branchChart = branchChart;
 		$scope.logicChart = logicChart;
 		$scope.arithmeticChart = arithmeticChart;
 		$scope.otherChart = otherChart;

 		//initialize chart with uncategorized isntructions
 		otherInstrs = namesList.filter(function(x){
 			return (getInstrType(x) == 'other');
 		}).map(function(x){
 			return x.split(" ")[0];
 		});
 		uniqueOthers = otherInstrs.filter(function(item, pos, self) {return self.indexOf(item) == pos;});
 		for (key in uniqueOthers){
 			$scope.otherChart.data.rows.push({c: [
 				{v: uniqueOthers[key]},
 				{v: otherInstrs.filter(function(x){return (x.split(" ")[0] == uniqueOthers[key])}).length},
 				{v: otherInstrs.filter(function(x){return (x.split(" ")[0] == uniqueOthers[key])}).length},
 				]});
 		}
 	}

 	$scope.init = function(){
 		var fileName = $scope.fileName;
 		var functionName = $scope.crtFunction.name;
 		var objectName = $scope.crtFunction.obj;
 		var functionAddr = $scope.crtFunction.address;

 		if($scope.isCurrentFileArchive == true){
 			$http.get($scope.archiveAssemblyEndpoint, {params:{filename:fileName, objectname:objectName, address: functionAddr, functionname: functionName}, cache:true}).success(function (data) {
 				updateData(data);
 			});
 		} else {
 			$http.get($scope.assemblyEndpoint, {params:{filename:fileName, functionname: functionName, address: functionAddr}, cache:true}).success(function (data) {
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
 			if($scope.mainChart.data.rows[i].c[0]['v'] == 'mov'){
 				$scope.mainChart.data.rows[i].c[2] = {v: getHtmlTooltip('movChart', 'mov instructions distribution')};
 			}
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

 	$scope.init();
 });

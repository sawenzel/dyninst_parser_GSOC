'use strict';
/**
 * Created by mindroc on 10/8/14.
 */
 angular.module('candyUiApp')
 .controller('AsmCtrl', function ($rootScope, $scope, $http) {
 	$rootScope.currentController = 'asm';

 	$scope.files_mapping = "/api/files";

 	$scope.init = function(){
	    $http.get($scope.files_mapping).success(function (data) {
		    $scope.filesList = data;
		    $scope.source = data;
	    });
 	}

 	$scope.filesList = [];

 	$scope.init();

 	$scope.functions_mapping = "/api/functions";

 	$scope.setFunctions = function(fileName){
 		$http.get($scope.functions_mapping, { params:{filename:fileName} }).success(function (data) {
		    $scope.functionsList = data;
			$scope.source = data;
			$scope.textFilter = "";
	    });
 	}

 	$scope.assemblyDict = {	
 		"_init" : [
 		{address:"4003e0", name: "sub RSP, 8"},
 		{address:"4003e4", name: "mov RAX, [RIP + 200c0d]"},
 		{address:"4003eb", name: "test RAX, RAX"},
 		{address:"4003ee", name: "jz 5 + RIP + 2"},
 		{address:"4003f0", name: "call 3b + RIP + 5", dest: "__gmon_start__"},
 		{address:"4003f5", name: "add RSP, 8"},
 		{address:"4003f9", name: "ret near [RSP]"},
 		],

 		"printf" : [
 		{address:"400410", name: "jmp [RIP + 200c02]"},
 		{address:"400416", name: "push 0, RSP"},
 		{address:"40041b", name: "jmp ffffffe0 + RIP + 5"},
 		{address:"400420", name: "jmp [RIP + 200bfa]"},
 		{address:"400426", name: "push 1, RSP"},
 		{address:"40042b", name: "jmp ffffffd0 + RIP + 5"},
 		{address:"400430", name: "jmp [RIP + 200bf2]"},
 		{address:"400436", name: "push 2, RSP"},
 		{address:"40043b", name: "jmp ffffffc0 + RIP + 5"},
 		{address:"400440", name: "xor EBP, EBP"},
 		{address:"400442", name: "mov R9, RDX"},
 		{address:"400445", name: "pop RSI, RSP"},
 		{address:"400446", name: "mov RDX, RSP"},
 		{address:"400449", name: "and RSP, f0"},
 		{address:"40044d", name: "push RAX, RSP"},
 		{address:"40044e", name: "push RSP, RSP"},
 		{address:"40044f", name: "mov R8, 400640"},
 		{address:"400456", name: "mov RCX, 4005d0"},
 		{address:"40045d", name: "mov RDI, 400573"},
 		{address:"400464", name: "call ffffffb7 + RIP + 5", dest: "__libc_start_main"},
 		{address:"400469", name: "hlt "},
 		{address:"40046a", name: "nop [RAX + RAX * 1 + 0]"},
 		{address:"400470", name: "mov RAX, 601047"},
 		{address:"400475", name: "push RBP, RSP"},
 		{address:"400476", name: "sub RAX, 601040"},
 		{address:"40047c", name: "cmp RAX, e"},
 		{address:"400480", name: "mov RBP, RSP"},
 		{address:"400483", name: "jnbe 2 + RIP + 2"},
 		{address:"400485", name: "pop RBP, RSP"},
 		{address:"400486", name: "ret near [RSP]"},
 		],

 		"__libc_start_main" : [
 		{address:"400420", name: "jmp [RIP + 200bfa]"},
 		{address:"400426", name: "push 1, RSP"},
 		{address:"40042b", name: "jmp ffffffd0 + RIP + 5"},
 		{address:"400430", name: "jmp [RIP + 200bf2]"},
 		{address:"400436", name: "push 2, RSP"},
 		{address:"40043b", name: "jmp ffffffc0 + RIP + 5"},
 		{address:"400440", name: "xor EBP, EBP"},
 		{address:"400442", name: "mov R9, RDX"},
 		{address:"400445", name: "pop RSI, RSP"},
 		{address:"400446", name: "mov RDX, RSP"},
 		{address:"400449", name: "and RSP, f0"},
 		{address:"40044d", name: "push RAX, RSP"},
 		{address:"40044e", name: "push RSP, RSP"},
 		{address:"40044f", name: "mov R8, 400640"},
 		{address:"400456", name: "mov RCX, 4005d0"},
 		{address:"40045d", name: "mov RDI, 400573"},
 		{address:"400464", name: "call ffffffb7 + RIP + 5", dest: "__libc_start_main"},
 		{address:"400469", name: "hlt "},
 		{address:"40046a", name: "nop [RAX + RAX * 1 + 0]"},
 		{address:"400470", name: "mov RAX, 601047"},
 		{address:"400475", name: "push RBP, RSP"},
 		{address:"400476", name: "sub RAX, 601040"},
 		{address:"40047c", name: "cmp RAX, e"},
 		{address:"400480", name: "mov RBP, RSP"},
 		{address:"400483", name: "jnbe 2 + RIP + 2"},
 		{address:"400485", name: "pop RBP, RSP"},
 		{address:"400486", name: "ret near [RSP]"},
 		],

 		"__gmon_start__" : [
 		{address:"400430", name: "jmp [RIP + 200bf2]"},
 		{address:"400436", name: "push 2, RSP"},
 		{address:"40043b", name: "jmp ffffffc0 + RIP + 5"},
 		{address:"400440", name: "xor EBP, EBP"},
 		{address:"400442", name: "mov R9, RDX"},
 		{address:"400445", name: "pop RSI, RSP"},
 		{address:"400446", name: "mov RDX, RSP"},
 		{address:"400449", name: "and RSP, f0"},
 		{address:"40044d", name: "push RAX, RSP"},
 		{address:"40044e", name: "push RSP, RSP"},
 		{address:"40044f", name: "mov R8, 400640"},
 		{address:"400456", name: "mov RCX, 4005d0"},
 		{address:"40045d", name: "mov RDI, 400573"},
 		{address:"400464", name: "call ffffffb7 + RIP + 5", dest: "__libc_start_main"},
 		{address:"400469", name: "hlt "},
 		{address:"40046a", name: "nop [RAX + RAX * 1 + 0]"},
 		{address:"400470", name: "mov RAX, 601047"},
 		{address:"400475", name: "push RBP, RSP"},
 		{address:"400476", name: "sub RAX, 601040"},
 		{address:"40047c", name: "cmp RAX, e"},
 		{address:"400480", name: "mov RBP, RSP"},
 		{address:"400483", name: "jnbe 2 + RIP + 2"},
 		{address:"400485", name: "pop RBP, RSP"},
 		{address:"400486", name: "ret near [RSP]"},
 		],

 		"_start" : [
 		{address:"400440", name: "xor EBP, EBP"},
 		{address:"400442", name: "mov R9, RDX"},
 		{address:"400445", name: "pop RSI, RSP"},
 		{address:"400446", name: "mov RDX, RSP"},
 		{address:"400449", name: "and RSP, f0"},
 		{address:"40044d", name: "push RAX, RSP"},
 		{address:"40044e", name: "push RSP, RSP"},
 		{address:"40044f", name: "mov R8, 400640"},
 		{address:"400456", name: "mov RCX, 4005d0"},
 		{address:"40045d", name: "mov RDI, 400573"},
 		{address:"400464", name: "call ffffffb7 + RIP + 5", dest: "__libc_start_main"},
 		{address:"400469", name: "hlt "},
 		{address:"40046a", name: "nop [RAX + RAX * 1 + 0]"},
 		{address:"400470", name: "mov RAX, 601047"},
 		{address:"400475", name: "push RBP, RSP"},
 		{address:"400476", name: "sub RAX, 601040"},
 		{address:"40047c", name: "cmp RAX, e"},
 		{address:"400480", name: "mov RBP, RSP"},
 		{address:"400483", name: "jnbe 2 + RIP + 2"},
 		{address:"400485", name: "pop RBP, RSP"},
 		{address:"400486", name: "ret near [RSP]"},
 		],

 		"deregister_tm_clones" : [
 		{address:"400470", name: "mov RAX, 601047"},
 		{address:"400475", name: "push RBP, RSP"},
 		{address:"400476", name: "sub RAX, 601040"},
 		{address:"40047c", name: "cmp RAX, e"},
 		{address:"400480", name: "mov RBP, RSP"},
 		{address:"400483", name: "jnbe 2 + RIP + 2"},
 		{address:"400485", name: "pop RBP, RSP"},
 		{address:"400486", name: "ret near [RSP]"},
 		],

 		"register_tm_clones" : [
 		{address:"4004a0", name: "mov RAX, 601040"},
 		{address:"4004a5", name: "push RBP, RSP"},
 		{address:"4004a6", name: "sub RAX, 601040"},
 		{address:"4004ac", name: "sar RAX, 3"},
 		{address:"4004b0", name: "mov RBP, RSP"},
 		{address:"4004b3", name: "mov RDX, RAX"},
 		{address:"4004b6", name: "shr RDX, 3f"},
 		{address:"4004ba", name: "add RAX, RDX"},
 		{address:"4004bd", name: "sar RAX, 1"},
 		{address:"4004c0", name: "jnz 2 + RIP + 2"},
 		{address:"4004c2", name: "pop RBP, RSP"},
 		{address:"4004c3", name: "ret near [RSP]"},
 		],

 		"__do_global_dtors_aux" : [
 		{address:"4004e0", name: "cmp [RIP + 200b59], 0"},
 		{address:"4004e7", name: "jnz 11 + RIP + 2"},
 		{address:"4004e9", name: "push RBP, RSP"},
 		{address:"4004ea", name: "mov RBP, RSP"},
 		{address:"4004ed", name: "call ffffff7e + RIP + 5", dest: "deregister_tm_clones"},
 		{address:"4004f2", name: "pop RBP, RSP"},
 		{address:"4004f3", name: "mov [RIP + 200b46], 1"},
 		{address:"4004fa", name: "REP ret near [RSP]"},
 		],

 		"frame_dummy" : [
 		{address:"400500", name: "cmp [RIP + 200918], 0"},
 		{address:"400508", name: "jz 1e + RIP + 2"},
 		{address:"40050a", name: "mov RAX, 0"},
 		{address:"40050f", name: "test RAX, RAX"},
 		{address:"400512", name: "jz 14 + RIP + 2"},
 		{address:"400514", name: "push RBP, RSP"},
 		{address:"400515", name: "mov RDI, 600e20"},
 		{address:"40051a", name: "mov RBP, RSP"},
 		{address:"40051d", name: "call RAX"},
 		{address:"40051f", name: "pop RBP, RSP"},
 		{address:"400520", name: "jmp ffffff7b + RIP + 5"},
 		{address:"400525", name: "nop [RAX]"},
 		{address:"400528", name: "jmp ffffff73 + RIP + 5"},
 		{address:"40052d", name: "push RBP, RSP"},
 		{address:"40052e", name: "mov RBP, RSP"},
 		{address:"400531", name: "mov [RBP + fffffffffffffff8], RDI"},
 		{address:"400535", name: "mov RAX, [RBP + fffffffffffffff8]"},
 		{address:"400539", name: "mov [RAX], 0"},
 		{address:"40053f", name: "pop RBP, RSP"},
 		{address:"400540", name: "ret near [RSP]"},
 		],

 		"func1" : [
 		{address:"40052d", name: "push RBP, RSP"},
 		{address:"40052e", name: "mov RBP, RSP"},
 		{address:"400531", name: "mov [RBP + fffffffffffffff8], RDI"},
 		{address:"400535", name: "mov RAX, [RBP + fffffffffffffff8]"},
 		{address:"400539", name: "mov [RAX], 0"},
 		{address:"40053f", name: "pop RBP, RSP"},
 		{address:"400540", name: "ret near [RSP]"},
 		],

 		"func2" : [
 		{address:"400541", name: "push RBP, RSP"},
 		{address:"400542", name: "mov RBP, RSP"},
 		{address:"400545", name: "mov [RBP + fffffffffffffffc], EDI"},
 		{address:"400548", name: "mov EAX, [RBP + fffffffffffffffc]"},
 		{address:"40054b", name: "add EAX, EAX"},
 		{address:"40054d", name: "pop RBP, RSP"},
 		{address:"40054e", name: "ret near [RSP]"},
 		],

 		"func3" : [
 		{address:"40054f", name: "push RBP, RSP"},
 		{address:"400550", name: "mov RBP, RSP"},
 		{address:"400553", name: "sub RSP, 8"},
 		{address:"400557", name: "mov [RBP + fffffffffffffffc], EDI"},
 		{address:"40055a", name: "cmp [RBP + fffffffffffffffc], 0"},
 		{address:"40055e", name: "jnz 7 + RIP + 2"},
 		{address:"400560", name: "mov RAX, 0"},
 		{address:"400565", name: "jmp a + RIP + 2"},
 		{address:"400567", name: "mov EAX, [RBP + fffffffffffffffc]"},
 		{address:"40056a", name: "mov EDI, EAX"},
 		{address:"40056c", name: "call ffffffd0 + RIP + 5", dest: "func2"},
 		{address:"400571", name: "leave "},
 		{address:"400572", name: "ret near [RSP]"},
 		],

 		"main" : [
 		{address:"400573", name: "push RBP, RSP"},
 		{address:"400574", name: "mov RBP, RSP"},
 		{address:"400577", name: "sub RSP, 10"},
 		{address:"40057b", name: "mov [RBP + fffffffffffffffc], 1"},
 		{address:"400582", name: "mov EAX, [RBP + fffffffffffffffc]"},
 		{address:"400585", name: "mov EDI, EAX"},
 		{address:"400587", name: "call ffffffc3 + RIP + 5", dest: "func3"},
 		{address:"40058c", name: "mov ESI, EAX"},
 		{address:"40058e", name: "mov RDI, 400654"},
 		{address:"400593", name: "mov RAX, 0"},
 		{address:"400598", name: "call fffffe73 + RIP + 5", dest: "printf"},
 		{address:"40059d", name: "lea RAX, RBP + fffffffffffffffc"},
 		{address:"4005a1", name: "mov RDI, RAX"},
 		{address:"4005a4", name: "call ffffff84 + RIP + 5", dest: "func1"},
 		{address:"4005a9", name: "mov EAX, [RBP + fffffffffffffffc]"},
 		{address:"4005ac", name: "mov EDI, EAX"},
 		{address:"4005ae", name: "call ffffff9c + RIP + 5", dest: "func3"},
 		{address:"4005b3", name: "mov ESI, EAX"},
 		{address:"4005b5", name: "mov RDI, 400654"},
 		{address:"4005ba", name: "mov RAX, 0"},
 		{address:"4005bf", name: "call fffffe4c + RIP + 5", dest: "printf"},
 		{address:"4005c4", name: "mov RAX, 0"},
 		{address:"4005c9", name: "leave "},
 		{address:"4005ca", name: "ret near [RSP]"},
 		],

 		"__libc_csu_init" : [
 		{address:"4005d0", name: "push R15, RSP"},
 		{address:"4005d2", name: "mov R15, EDI"},
 		{address:"4005d5", name: "push R14, RSP"},
 		{address:"4005d7", name: "mov R14, RSI"},
 		{address:"4005da", name: "push R13, RSP"},
 		{address:"4005dc", name: "mov R13, RDX"},
 		{address:"4005df", name: "push R12, RSP"},
 		{address:"4005e1", name: "lea R12, RIP + 200828"},
 		{address:"4005e8", name: "push RBP, RSP"},
 		{address:"4005e9", name: "lea RBP, RIP + 200828"},
 		{address:"4005f0", name: "push RBX, RSP"},
 		{address:"4005f1", name: "sub RBP, R12"},
 		{address:"4005f4", name: "xor EBX, EBX"},
 		{address:"4005f6", name: "sar RBP, 3"},
 		{address:"4005fa", name: "sub RSP, 8"},
 		{address:"4005fe", name: "call fffffddd + RIP + 5", dest: "_init"},
 		{address:"400603", name: "test RBP, RBP"},
 		{address:"400606", name: "jz 1e + RIP + 2"},
 		{address:"400608", name: "nop [RAX + RAX * 1 + 0]"},
 		{address:"400610", name: "mov RDX, R13"},
 		{address:"400613", name: "mov RSI, R14"},
 		{address:"400616", name: "mov EDI, R15"},
 		{address:"400619", name: "call [R12 + RBX * 8]"},
 		{address:"40061d", name: "add RBX, 1"},
 		{address:"400621", name: "cmp RBX, RBP"},
 		{address:"400624", name: "jnz ffffffffffffffea + RIP + 2"},
 		{address:"400626", name: "add RSP, 8"},
 		{address:"40062a", name: "pop RBX, RSP"},
 		{address:"40062b", name: "pop RBP, RSP"},
 		{address:"40062c", name: "pop R12, RSP"},
 		{address:"40062e", name: "pop R13, RSP"},
 		{address:"400630", name: "pop R14, RSP"},
 		{address:"400632", name: "pop R15, RSP"},
 		{address:"400634", name: "ret near [RSP]"},
 		],

 		"__libc_csu_fini" : [
 		{address:"400640", name: "REP ret near [RSP]"},
 		],

 		"_fini" : [
 		{address:"400644", name: "sub RSP, 8"},
 		{address:"400648", name: "add RSP, 8"},
 		{address:"40064c", name: "ret near [RSP]"},
 		],
 	}	

 	$scope.numPerPage = 20;
 	$scope.currentPage = 1;

 	$scope.paginate = function(value){
 		var begin, end, index;
 		begin = ($scope.currentPage - 1) * $scope.numPerPage;
 		end = begin + $scope.numPerPage;
 		index = $scope.functionsList.indexOf(value);
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
 			$scope.functionsList = $scope.source;
 	};

 	$scope.filterTableData = function(){
 		$scope.functionsList = $scope.functionsList.filter(
 			function(a){
 				var name = a.name.toLowerCase();
 				var address = a.address.toLowerCase();
 				return (name.indexOf($scope.textFilter.toLowerCase()) > -1 || address.indexOf($scope.textFilter.toLowerCase()) > -1);
 			}
 		);
 	};
});

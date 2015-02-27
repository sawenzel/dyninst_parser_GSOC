'use strict';
/**
 * Created by mindroc on 10/8/14.
 */
 angular.module('candyUiApp')
 .controller('AsmCtrl', function ($rootScope, $scope) {
 	$rootScope.currentController = 'asm';

 	$scope.list = ["i", "like", "turltes"];
 	$scope.source = [
 	{address: "4003e0", name: "_init"},
 	{address: "400410", name: "printf"},
 	{address: "400420", name: "__libc_start_main"},
 	{address: "400430", name: "__gmon_start__"},
 	{address: "400440", name: "_start"},
 	{address: "400470", name: "deregister_tm_clones"},
 	{address: "4004a0", name: "register_tm_clones"},
 	{address: "4004e0", name: "__do_global_dtors_aux"},
 	{address: "400500", name: "frame_dummy"},
 	{address: "40052d", name: "func1"},
 	{address: "40053c", name: "func2"},
 	{address: "400564", name: "func3"},
 	{address: "400590", name: "main"},
 	{address: "400600", name: "__libc_csu_init"},
 	{address: "400670", name: "__libc_csu_fini"},
 	{address: "400674", name: "_fini"},

 	];

 	$scope.tableItems = $scope.source;

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
 		{address:"40044f", name: "mov R8, 400670"},
 		{address:"400456", name: "mov RCX, 400600"},
 		{address:"40045d", name: "mov RDI, 400590"},
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
 		{address:"40044f", name: "mov R8, 400670"},
 		{address:"400456", name: "mov RCX, 400600"},
 		{address:"40045d", name: "mov RDI, 400590"},
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
 		{address:"40044f", name: "mov R8, 400670"},
 		{address:"400456", name: "mov RCX, 400600"},
 		{address:"40045d", name: "mov RDI, 400590"},
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
 		{address:"40044f", name: "mov R8, 400670"},
 		{address:"400456", name: "mov RCX, 400600"},
 		{address:"40045d", name: "mov RDI, 400590"},
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
 		{address:"400531", name: "mov [RBP + fffffffffffffffc], EDI"},
 		{address:"400534", name: "mov EAX, [RBP + fffffffffffffffc]"},
 		{address:"400537", name: "add EAX, 1"},
 		{address:"40053a", name: "pop RBP, RSP"},
 		{address:"40053b", name: "ret near [RSP]"},
 		],

 		"func1" : [
 		{address:"40052d", name: "push RBP, RSP"},
 		{address:"40052e", name: "mov RBP, RSP"},
 		{address:"400531", name: "mov [RBP + fffffffffffffffc], EDI"},
 		{address:"400534", name: "mov EAX, [RBP + fffffffffffffffc]"},
 		{address:"400537", name: "add EAX, 1"},
 		{address:"40053a", name: "pop RBP, RSP"},
 		{address:"40053b", name: "ret near [RSP]"},
 		],

 		"func2" : [
 		{address:"40053c", name: "push RBP, RSP"},
 		{address:"40053d", name: "mov RBP, RSP"},
 		{address:"400540", name: "sub RSP, 10"},
 		{address:"400544", name: "mov [RBP + fffffffffffffffc], EDI"},
 		{address:"400547", name: "mov EAX, [RBP + fffffffffffffffc]"},
 		{address:"40054a", name: "mov EDI, EAX"},
 		{address:"40054c", name: "call ffffffdc + RIP + 5", dest: "func1"},
 		{address:"400551", name: "mov ESI, EAX"},
 		{address:"400553", name: "mov RDI, 400684"},
 		{address:"400558", name: "mov RAX, 0"},
 		{address:"40055d", name: "call fffffeae + RIP + 5", dest: "printf"},
 		{address:"400562", name: "leave "},
 		{address:"400563", name: "ret near [RSP]"},
 		],

 		"func3" : [
 		{address:"400564", name: "push RBP, RSP"},
 		{address:"400565", name: "mov RBP, RSP"},
 		{address:"400568", name: "sub RSP, 10"},
 		{address:"40056c", name: "mov [RBP + fffffffffffffffc], EDI"},
 		{address:"40056f", name: "cmp [RBP + fffffffffffffffc], 0"},
 		{address:"400573", name: "jnle c + RIP + 2"},
 		{address:"400575", name: "mov EAX, [RBP + fffffffffffffffc]"},
 		{address:"400578", name: "mov EDI, EAX"},
 		{address:"40057a", name: "call ffffffae + RIP + 5", dest: "func1"},
 		{address:"40057f", name: "jmp d + RIP + 2"},
 		{address:"400581", name: "mov EAX, [RBP + fffffffffffffffc]"},
 		{address:"400584", name: "sub EAX, 1"},
 		{address:"400587", name: "mov EDI, EAX"},
 		{address:"400589", name: "call ffffffd6 + RIP + 5", dest: "func3"},
 		{address:"40058e", name: "leave "},
 		{address:"40058f", name: "ret near [RSP]"},
 		],

 		"main" : [
 		{address:"400590", name: "push RBP, RSP"},
 		{address:"400591", name: "mov RBP, RSP"},
 		{address:"400594", name: "sub RSP, 10"},
 		{address:"400598", name: "mov [RBP + fffffffffffffffc], 3"},
 		{address:"40059f", name: "mov EAX, [RBP + fffffffffffffffc]"},
 		{address:"4005a2", name: "mov ESI, EAX"},
 		{address:"4005a4", name: "mov RDI, 400684"},
 		{address:"4005a9", name: "mov RAX, 0"},
 		{address:"4005ae", name: "call fffffe5d + RIP + 5", dest: "printf"},
 		{address:"4005b3", name: "mov EAX, [RBP + fffffffffffffffc]"},
 		{address:"4005b6", name: "mov EDI, EAX"},
 		{address:"4005b8", name: "call ffffff70 + RIP + 5", dest: "func1"},
 		{address:"4005bd", name: "mov ESI, EAX"},
 		{address:"4005bf", name: "mov RDI, 400684"},
 		{address:"4005c4", name: "mov RAX, 0"},
 		{address:"4005c9", name: "call fffffe42 + RIP + 5", dest: "printf"},
 		{address:"4005ce", name: "mov EAX, [RBP + fffffffffffffffc]"},
 		{address:"4005d1", name: "mov EDI, EAX"},
 		{address:"4005d3", name: "call ffffff64 + RIP + 5", dest: "func2"},
 		{address:"4005d8", name: "mov EAX, [RBP + fffffffffffffffc]"},
 		{address:"4005db", name: "mov ESI, EAX"},
 		{address:"4005dd", name: "mov RDI, 400684"},
 		{address:"4005e2", name: "mov RAX, 0"},
 		{address:"4005e7", name: "call fffffe24 + RIP + 5", dest: "printf"},
 		{address:"4005ec", name: "mov RAX, 0"},
 		{address:"4005f1", name: "leave "},
 		{address:"4005f2", name: "ret near [RSP]"},
 		],

 		"__libc_csu_init" : [
 		{address:"400600", name: "push R15, RSP"},
 		{address:"400602", name: "mov R15, EDI"},
 		{address:"400605", name: "push R14, RSP"},
 		{address:"400607", name: "mov R14, RSI"},
 		{address:"40060a", name: "push R13, RSP"},
 		{address:"40060c", name: "mov R13, RDX"},
 		{address:"40060f", name: "push R12, RSP"},
 		{address:"400611", name: "lea R12, RIP + 2007f8"},
 		{address:"400618", name: "push RBP, RSP"},
 		{address:"400619", name: "lea RBP, RIP + 2007f8"},
 		{address:"400620", name: "push RBX, RSP"},
 		{address:"400621", name: "sub RBP, R12"},
 		{address:"400624", name: "xor EBX, EBX"},
 		{address:"400626", name: "sar RBP, 3"},
 		{address:"40062a", name: "sub RSP, 8"},
 		{address:"40062e", name: "call fffffdad + RIP + 5", dest: "_init"},
 		{address:"400633", name: "test RBP, RBP"},
 		{address:"400636", name: "jz 1e + RIP + 2"},
 		{address:"400638", name: "nop [RAX + RAX * 1 + 0]"},
 		{address:"400640", name: "mov RDX, R13"},
 		{address:"400643", name: "mov RSI, R14"},
 		{address:"400646", name: "mov EDI, R15"},
 		{address:"400649", name: "call [R12 + RBX * 8]"},
 		{address:"40064d", name: "add RBX, 1"},
 		{address:"400651", name: "cmp RBX, RBP"},
 		{address:"400654", name: "jnz ffffffffffffffea + RIP + 2"},
 		{address:"400656", name: "add RSP, 8"},
 		{address:"40065a", name: "pop RBX, RSP"},
 		{address:"40065b", name: "pop RBP, RSP"},
 		{address:"40065c", name: "pop R12, RSP"},
 		{address:"40065e", name: "pop R13, RSP"},
 		{address:"400660", name: "pop R14, RSP"},
 		{address:"400662", name: "pop R15, RSP"},
 		{address:"400664", name: "ret near [RSP]"},
 		],

 		"__libc_csu_fini" : [
 		{address:"400670", name: "REP ret near [RSP]"},
 		],

 		"_fini" : [
 		{address:"400674", name: "sub RSP, 8"},
 		{address:"400678", name: "add RSP, 8"},
 		{address:"40067c", name: "ret near [RSP]"},
 		],
 	};

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
 });

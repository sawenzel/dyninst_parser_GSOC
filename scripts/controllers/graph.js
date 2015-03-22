'use strict';
/**
 * Created by mindroc on 10/8/14.
 */
 angular.module('candyUiApp')
 .controller('GraphCtrl', function ($rootScope, $scope) {
 	$rootScope.currentController = 'graph';

 	$scope.source = [
 	{address: "400564", instr: "push RBP, RSP"},
 	{address: "400565", instr: "mov RBP, RSP"},
 	{address: "400568", instr: "sub RSP, 10"},
 	{address: "40056c", instr: "mov [RBP + fffffffffffffffc], EDI"},
 	{address: "40056f", instr: "cmp [RBP + fffffffffffffffc], 0"},
 	{address: "400573", instr: "jnle c + RIP + 2"},
 	{address: "400575", instr: "mov EAX, [RBP + fffffffffffffffc]"},
 	{address: "400578", instr: "mov EDI, EAX"},
 	{address: "40057a", instr: "call ffffffae + RIP + 5"},
 	{address: "40057f", instr: "jmp d + RIP + 2"},
 	{address: "400581", instr: "mov EAX, [RBP + fffffffffffffffc]"},
 	{address: "400584", instr: "sub EAX, 1"},
 	{address: "400587", instr: "mov EDI, EAX"},
 	{address: "400589", instr: "call ffffffd6 + RIP + 5", dest:"400564"},
 	{address: "40058e", instr: "leave "},
 	{address: "40058f", instr: "ret near [RSP]"}
 	];
});

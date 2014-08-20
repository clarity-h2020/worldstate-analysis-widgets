angular.module(
    'eu.crismaproject.worldstateAnalysis.controllers'
    ).controller(
    'eu.crismaproject.worldstateAnalysis.controllers.CriteriaFunctionManagerDirectiveController',
    [
        '$scope',
        function ($scope) {
            'use strict';
            $scope.editable = [];
            $scope.currentIntervalFunctions = [];
            $scope.selectedCriteriaFunctionIndex = -1;
            $scope.tooltipDelete = {
                title: 'Delete this criteria function'
            };
            $scope.tooltipAdd = {
                title: 'Create a new criteria function'
            };
            $scope.tooltipSave = {
                title: 'Save changes'
            };
            $scope.tooltipRename = {
                title: 'Rename criteria function'
            };
            $scope.tooltipRenameDone = {
                title: 'Done'
            };

            $scope.addCriteriaFunction = function () {
                var i, criteriaFunctions = [];
                for (i = 0; i < $scope.indicators.length; i++) {
                    criteriaFunctions.push({
                        lowerBoundary: {
                            criteriaValue: 0,
                            indicatorValue: 0
                        },
                        upperBoundary: {
                            criteriaValue: 100,
                            indicatorValue: 0
                        },
                        intervals: []
                    });
                }
                $scope.criteriaFunctionSet.push({
                    name: 'Criteria function ' + ($scope.criteriaFunctionSet.length + 1),
                    criteriaFunctions: criteriaFunctions
                });
                $scope.editable.push(false);
            };

            $scope.removeCriteriaFunction = function () {
                $scope.criteriaFunctionSet.splice($scope.selectedCriteriaFunctionIndex, 1);
            };

            $scope.isActiveItem = function (index) {
                if ($scope.selectedCriteriaFunctionIndex === index) {
                    return 'list-group-item-info';
                } else {
                    return '';
                }
            };

            $scope.setSelectedCriteriaFunction = function (index) {
                $scope.selectedCriteriaFunctionIndex = index;
                $scope.currentCriteriaFunction = $scope.criteriaFunctionSet[$scope.selectedCriteriaFunctionIndex];
            };

//            $scope.saveCriteriaFunctions = function () {
//                var i, critFunc;
//                for (i = 0; i < $scope.criteriaFunctions.length; i++) {
//                    critFunc = $scope.criteriaFunctions[i];
//                    if (critFunc.name === $scope.currentCriteriaFunction.name) {
//                        $scope.criteriaFunctions[i] = $scope.currentCriteriaFunction;
//                        break;
//                    }
//                }
//            };

        }
    ]
    );




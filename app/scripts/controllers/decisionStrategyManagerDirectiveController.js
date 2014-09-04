angular.module(
    'eu.crismaproject.worldstateAnalysis.controllers'
    ).controller(
    'eu.crismaproject.worldstateAnalysis.controllers.decisionStrategyManagerDirectiveController',
    [
        '$scope',
        'de.cismet.crisma.ICMM.Worldstates',
        function ($scope, Worldstates) {
            'use strict';
            $scope.editable = [];
            $scope.currentIntervalFunctions = [];
            $scope.selectedDecisionStrategyIndex = -1;
            $scope.tooltipDelete = {
                title: 'Delete this decision strategy'
            };
            $scope.tooltipAdd = {
                title: 'Create a new decision strategy'
            };
            $scope.tooltipSave = {
                title: 'Save changes'
            };
            $scope.tooltipRename = {
                title: 'Rename decision strategy'
            };
            $scope.tooltipRenameDone = {
                title: 'Done'
            };

            $scope.addDecisionStrategy = function () {
                var i, decisionStrategy = [];
                for (i = 0; i < $scope.worldstates.length; i++) {
                    decisionStrategy.push({
                        indicator: $scope.worldstates[i].displayName,
                    });
                }
                $scope.decisionStrategies.push({
                    name: 'Decision Strategy ' + ($scope.decisionStrategies.length + 1),
                });
                $scope.editable.push(false);
            };

            $scope.decisionStrategy = function () {
                $scope.decisionStrategies.splice($scope.selectedDecisionStrategyIndex, 1);
            };

            $scope.isActiveItem = function (index) {
                if ($scope.selectedDecisionStrategyIndex === index) {
                    return 'list-group-item-info';
                } else {
                    return '';
                }
            };

            $scope.setSelectedDecisionStrategy = function (index) {
                $scope.selectedDecisionStrategyIndex = index;
                $scope.currentDecisionStrategy = $scope.decisionStrategies[$scope.selectedDecisionStrategyIndex];
            };

            $scope.updateModel = function () {
                var i, indicatorGroup, indicatorProp, iccObject, group;
                $scope.indicatorVector = [];
                for (i = 0; i < $scope.worldstates.length; i++) {

                    iccObject = Worldstates.utils.stripIccData([$scope.worldstates[i]], false)[0];
                    for (indicatorGroup in iccObject.data) {
                        if (iccObject.data.hasOwnProperty(indicatorGroup)) {
                            group = iccObject.data[indicatorGroup];
                            for (indicatorProp in group) {
                                if (group.hasOwnProperty(indicatorProp)) {
                                    if (indicatorProp !== 'displayName' && indicatorProp !== 'iconResource') {
                                        $scope.indicatorVector.push(group[indicatorProp]);
                                    }
                                }
                            }
                        }
                    }
                }
            };
            $scope.worldstates = $scope.worldstates || [];
            $scope.$watch('worldstates', function () {
                $scope.updateModel();
            }, true);
        }
    ]
    );



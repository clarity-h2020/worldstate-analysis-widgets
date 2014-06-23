angular.module(
    'eu.crismaproject.worldstateAnalysis.controllers',
    []
).controller(
    'eu.crismaproject.worldstateAnalysis.controllers.IndicatorCriteriaTableDirectiveController',
    [
        '$scope',
        '$filter',
        'de.cismet.crisma.ICMM.Worldstates',
        'ngTableParams',
        function ($scope, $filter, WorldstateService, NgTableParams) {
            'use strict';
            var getOrderedProperties = function (obj) {
                var p, keys;
                keys = [];
                for (p in obj) {
                    if (obj.hasOwnProperty(p)) {
                        keys.push(p);
                    }
                }
                keys.sort();
                return keys;
            },
                updateTable = function () {
                    var field, group, i, iccData, j, k_outer, k_inner, keys_outer, keys_inner, prop, val,
                        dataVector = WorldstateService.utils.stripIccData($scope.worldstates, $scope.forCriteria);
                    if (!(!$scope.worldstates || $scope.worldstates.length === 0)) {
                        $scope.rows = [];
                        $scope.columns = [{
                            title: $scope.forCriteria ? 'Criteria' : 'Indicators',
                            field: 'f1',
                            visible: true
                        }];
                        j = 0;
                        iccData = dataVector[0].data;
                        keys_outer = getOrderedProperties(iccData);
                        for (k_outer = 0; k_outer < keys_outer.length; ++k_outer) {
                            group = iccData[keys_outer[k_outer]];
                            $scope.rows[j++] = {
                                f1: {
                                    name: group.displayName,
                                    icon: group.iconResource
                                }
                            };
                            keys_inner = getOrderedProperties(group);
                            for (k_inner = 0; k_inner < keys_inner.length; ++k_inner) {
                                prop = keys_inner[k_inner];
                                if (prop !== 'displayName' && prop !== 'iconResource') {
                                    $scope.rows[j++] = {
                                        f1: {
                                            name: group[prop].displayName,
                                            icon: group[prop].iconResource
                                        }
                                    };
                                }
                            }
                        }
                        for (i = 0; i < dataVector.length; ++i) {
                            field = 'f' + (i + 2);
                            $scope.columns.push({
                                title: dataVector[i].name,
                                field: field,
                                visible: true
                            });
                            iccData = dataVector[i].data;
                            j = 0;
                            keys_outer = getOrderedProperties(iccData);
                            for (k_outer = 0; k_outer < keys_outer.length; ++k_outer) {
                                group = iccData[keys_outer[k_outer]];
                                $scope.rows[j++][field] = null;
                                keys_inner = getOrderedProperties(group);
                                for (k_inner = 0; k_inner < keys_inner.length; ++k_inner) {
                                    prop = keys_inner[k_inner];
                                    if (prop !== 'displayName' && prop !== 'iconResource') {
                                        val = group[prop].value;
                                        if (val % 1 !== 0) {
                                            val = $filter('number')(val, 2);
                                        }
                                        $scope.rows[j++][field] = {name: val + ' ' + group[prop].unit};
                                    }
                                }
                            }
                        }
                    }
                    if ($scope.tableParams) {
                        $scope.tableParams.reload();
                    } else {
                        $scope.tableParams = new NgTableParams({
                            page: 1,
                            count: $scope.rows.length
                        }, {
                            counts: [],
                            total: $scope.worldstates.length,
                            getData: function ($defer, params) {
                                if ($scope.worldstates.length <= 0) {
                                    return null;
                                }
                                $defer.resolve($scope.rows.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                            }
                        });
                    }
                };

            $scope.tableVisibleSwitch = '0';
            $scope.isGroupRow = function (row) {
                return row.f2 === null;
            };

            $scope.getRowStyle = function (index) {
                var row = $scope.rows[index],
                    groupRowStyle = {
                        'font-weight': 'bold'
                    };
                return $scope.isGroupRow(row) ? groupRowStyle : '';
            };

            $scope.$watchCollection('worldstates', function () {
                if ($scope.worldstates) {
                    updateTable();
                }
            });
            $scope.$watch('forCriteria', function (newVal, oldVal) {
                if (newVal !== oldVal && $scope.worldstates) {
                    updateTable();
                }
            });
        }
    ]
);
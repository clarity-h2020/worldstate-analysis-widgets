angular.module(
    'eu.crismaproject.worldstateAnalysis.directives'
).directive(
    'criteriaRadar',
    [
        'de.cismet.crisma.ICMM.Worldstates',
        function (WorldstateService) {
            'use strict';

            var scope;
            scope = {
                worldstates: '='
            };

            return {
                scope: scope,
                restrict: 'A',
                link: function (scope, elem) {
                    var dataVector, convertToChartDataStructure, chartData,
                        LegendOptions = [], cfg, drawLegend;
                    //we want the chart to adjust to the size of the element it is placed in
                    cfg = {
                        w: elem.width(),
                        h: elem.width(),
                        maxValue: 100,
                        levels: 4
                    };

                    convertToChartDataStructure = function (criteriaVector) {
                        var i, criteriaData, groupName, group, criteriaProp,
                            criteria, result, dataItem;
                        result = [];
                        LegendOptions = [];
                        for (i = 0; i < criteriaVector.length; i++) {
                            dataItem = [];
                            criteriaData = criteriaVector[i].data;
                            LegendOptions.push(criteriaVector[i].name);
                            for (groupName in criteriaData) {
                                if (criteriaData.hasOwnProperty(groupName)) {
                                    group = criteriaData[groupName];
                                    for (criteriaProp in group) {
                                        if (group.hasOwnProperty(criteriaProp) &&
                                                criteriaProp !== 'displayName' &&
                                                criteriaProp !== 'iconResource') {
                                            criteria = group[criteriaProp];
                                            dataItem.push({
                                                axis: criteria.displayName,
                                                value: criteria.value
                                            });
                                        }
                                    }
                                }
                            }
                            result.push(dataItem);
                        }
                        return result;
                    };

                    drawLegend = function () {
                        var colorscale = d3.scale.category10();
                        var legendSvg = d3.select(elem[0])
                            .append('div')
                            .append('svg')
                            .attr('width', cfg.w)
                            .attr('height', 5);
//                                    
                        //Create the title for the legend
//                                var text = svg.append("text")
//                                    .attr("class", "title")
////                                    .attr('transform', 'translate(90,0)')
//                                    .attr("x", 10)
//                                    .attr("y", 10)
//                                    .attr("font-size", "12px")
//                                    .attr("fill", "#404040")
//                                    .text("Worldstates");

                        //Initiate Legend
                        var legendContainer = legendSvg.append('g')
                            .attr('class', 'legend')
                            .attr('height', 5)
                            .attr('width', 50);

                        //Create colour squares
                        var rects = legendContainer.selectAll('rect')
                            .data(LegendOptions)
                            .enter()
                            .append('rect')
                            .attr('y', 15)
                            .attr('x', function (d, i) {
                                return i * 20;
                            })
                            .attr('width', 10)
                            .attr('height', 10)
                            .style('fill', function (d, i) {
                                return colorscale(i);
                            })
                            ;
                        //Create text next to squares
                        var labels = legendContainer.selectAll('text')
                            .data(LegendOptions)
                            .enter()
                            .append('text')
                            .attr('y', 24)
                            .attr('x', function (d, i) {
                                return i * 30 + 15;
                            })
                            .attr('font-size', '11px')
                            .attr('fill', '#737373')
                            .text(function (d) {
                                return d;
                            });

//                      we need to adjust the position of the legend
//                     labels and break the line if necessary
                        var xOff = [0];
                        var yOff = 0;
                        var xCorr = 0;
                        labels.attr('transform', function (data, i) {
                            var width = d3.select(this).node().getBBox().width;
                            var oldXOff = xOff.reduce(function (prev, curr) {
                                return prev + curr;
                            });
                            xOff.push(width);
                            if (oldXOff + width - xCorr > cfg.w) {
                                yOff += 20;
                                xCorr = oldXOff + i * 30;
                            }
                            var off = oldXOff - xCorr;
                            var res = 'translate(' + off + ',' + yOff + ')';
                            return res;
                        });

                        yOff = 0;
                        xCorr = 0;
                        rects.attr('transform', function (data, i) {
                            var off = xOff.reduce(function (prev, curr, index) {
                                if (index - 1 < i) {
                                    return prev + curr;
                                }
                                return prev;
                            });
                            if (off + xOff[i] - xCorr > cfg.w) {
                                yOff += 20;
                                xCorr = off + i * 30;
                            }
                            off = off - xCorr;
                            off = off + i * 10;
                            return 'translate(' + off + ',' + yOff + ')';
                        });

                        //set the size of the legend containers correctly
                        legendSvg.attr('height', yOff + 50);
                        legendContainer.attr('height', yOff + 50);
                    };

                    scope.$watch('worldstates', function (newVal, oldVal) {
                        if (newVal !== oldVal) {
                            if (scope.worldstates && scope.worldstates.length > 0) {
                                // we are only interest in criteria data
                                dataVector = WorldstateService.utils.stripIccData(scope.worldstates, true);
                                // remove everything from the element...
                                elem.removeData();
                                elem.empty();
                                elem[0].empty();
                                chartData = convertToChartDataStructure(dataVector);

                                var divNode = d3.select(elem[0]).append('div')
                                    .attr('style', 'display:block;margin: 0 auto;')
                                    .node();

                                RadarChart.draw(divNode, chartData, cfg);
                                drawLegend();
                            }
                        }

                    });
                }
            };
        }
    ]
);
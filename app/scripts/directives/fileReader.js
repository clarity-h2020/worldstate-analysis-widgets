angular.module(
    'eu.crismaproject.worldstateAnalysis.directives'
).directive(
    'fileInput',
    [
        '$parse',
        function ($parse) {
            'use strict';

            return {
                restrict: 'A',
                link: function(scope, elem, attrs){
                    elem.bind('change', function(){
                        $parse(attrs.fileInput).assign(scope, elem[0].files);
                        scope.$apply();
                    });
                }
            };
        }
    ]
);
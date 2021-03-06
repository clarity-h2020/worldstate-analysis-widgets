//<!-- https://github.com/clarity-h2020/scenario-analysis/raw/dev/app/scripts/connectors/nodeConnector.js -->
//<script type="text/javascript">
'use strict';
/* global $ */
/* jshint ignore:start */
if (typeof $ === 'undefined') {
    var $ = jQuery;
}
if (typeof $ === 'undefined') {
    var $ = window.jQuery;
}
/* jshint ignore:end */

window.Drupal.behaviors.myBehavior = {
    attach: function (context, drupalSettings) {
        // Using once() to apply the scenarioAnalysisIFrameBehavior effect when you want to run just one function.
        $(window, context).once('scenarioAnalysisIFrameBehavior').each(function () {
            // now using the csisHelpers Module (https://github.com/clarity-h2020/csis-helpers-module)

            var studyInfo;
            if (undefined !== drupalSettings && undefined !== drupalSettings.csisHelpers && undefined !== drupalSettings.csisHelpers.studyInfo) {
                studyInfo = drupalSettings.csisHelpers.studyInfo;
            } else {
                console.error('no global csisHelpers object found, probably not connected to Drupal!');
            }

            // ugly workaround for https://github.com/clarity-h2020/csis-helpers-module/issues/9#issuecomment-539436236
            //var baseTag = document.createElement('base');
            //var prependURL = 'https://csis.myclimateservice.eu/apps/scenario-analysis/app/';
            //baseTag.href = prependURL ;
            //$('#scenario-analysis').contents().find('head').append(baseTag);

            var connectCount = 0;
            // for some unknown the reason angular directive controler of the embedded child iframe
            // does not recieve the event when it's not fired from the onConnect method.
            var scenarioAnalysisApp = window.seamless(document.getElementById('scenario-analysis'),
                {
                    onConnect: function () {
                        // FIXME: for some unknown reason, onConnect is called if no child frame has actively connected
                        // by invoking seamless.connect() resulting in the onConnect function called twice!
                        if (connectCount === 1) {
                            scenarioAnalysisApp.send(studyInfo);
                        } else {
                            //ignore
                            console.log('ignoring pre/re connection #:' + connectCount);
                        }
                        connectCount++;
                    }
                });
        });
    }
};
//</script>
//<iframe id="scenario-analysis" src="/apps/scenario-analysis/app/index.html"></iframe>
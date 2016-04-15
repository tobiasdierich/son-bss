/**
 * Created by Shivali on 7/3/15.
 */

angular.module('SonataBSS')
    .directive('tooltipInit', function () {
        return{
            restrict:"A",
            link:function(scope,elem){
                jQuery(elem).tooltip();
            }
        }
    })
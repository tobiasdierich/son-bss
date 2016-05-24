/**
 * Created by Shivali on 6/30/15.
 */

angular.module('NSD')
    .factory('NSDServices',["$http","$q",function ($http,$q) {
        return {
            retrieveNSDs:function(ENV){

                var defer=$q.defer();
		var maxSafeInteger = Math.pow(2,32) - 1;
		$http.get(ENV.apiEndpoint+"/services?limit="+maxSafeInteger+"&offset=0")
                    .success(function(result){
					defer.resolve(result)})
                    .error(function(error){defer.reject(error)});
                return defer.promise;
            },
          
            instantiateNSD:function(id,ENV){				
                var defer=$q.defer();
				$http.post(ENV.apiEndpoint+"/requests?service_uuid="+encodeURIComponent(id))
                    .success(function(result){defer.resolve(result)})
                    .error(function(error){defer.reject(error)});
											
                return defer.promise;
            }
        }
    }]);
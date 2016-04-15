/**
 * Created by Shivali on 6/30/15.
 */

angular.module('NSD')
    .factory('NSDServices',["$http","$q",function ($http,$q) {
        return {
            retrieveNSDs:function(ENV){

                var defer=$q.defer();
		$http.get(ENV.apiEndPoint||"/test/NSD/json_example.json")
                    .success(function(result){defer.resolve(result)})
                    .error(function(error){defer.reject(error)});
                return defer.promise;
            },
          
            instantiateNSD:function(id,ENV){

                var defer=$q.defer();
                $http.post(ENV.apiEndPoint||"/instances/"+id,id)
                    .success(function(result){defer.resolve(result)})
                    .error(function(error){defer.reject(error)});

                return defer.promise;
            },
            retrieveNSDById:function(id){

                var defer=$q.defer();
                $http.get("nSD/"+id)
                    .success(function(result){defer.resolve(result)})
                    .error(function(error){defer.reject(error)});
                return defer.promise;
            }
        }
    }]);
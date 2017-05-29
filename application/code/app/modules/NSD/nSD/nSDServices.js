/**
 * Copyright (c) 2015 SONATA-NFV [, ANY ADDITIONAL AFFILIATION]
 * ALL RIGHTS RESERVED.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 * Neither the name of the SONATA-NFV [, ANY ADDITIONAL AFFILIATION]
 * nor the names of its contributors may be used to endorse or promote 
 * products derived from this software without specific prior written 
 * permission.
 * 
 * This work has been performed in the framework of the SONATA project,
 * funded by the European Commission under Grant number 671517 through 
 * the Horizon 2020 and 5G-PPP programmes. The authors would like to 
 * acknowledge the contributions of their colleagues of the SONATA 
 * partner consortium (www.sonata-nfv.eu).* dirPagination - AngularJS module for paginating (almost) anything.
 */

 angular.module('NSD')
 .factory('NSDServices',["$http","$q",function ($http,$q) {
    return {
        retrieveNSDs:function(ENV, offset){

            var defer=$q.defer();		        
            $http.get(ENV.apiEndpoint+"/services?status=active&limit="+10+"&offset="+offset)
            .then(function successCallback(result){
                defer.resolve(result)})
            .catch(function errorCallback(error){
                defer.reject(error)});
            return defer.promise;
        },
        
        instantiateNSD:function(id, ingresses, egresses, ENV){				
            var defer=$q.defer();

            /* check for empty ingress/egress */

            if (Object.keys(ingresses).length > 1) {
                var element = ingresses.pop();
                if ( angular.toJson(element) != "{}") {
                    ingresses.push(element);
                }
            }

            if (Object.keys(egresses).length > 1) {
                var element = egresses.pop();
                if ( angular.toJson(element) != "{}") {
                    egresses.push(element);
                }
            }

            var data={"service_uuid":id, "ingress": ingresses, "egress":egresses};
            $http.post(ENV.apiEndpoint+"/requests",data)
            .then(function successCallback(result){defer.resolve(result)})
            .catch(function errorCallback(error){defer.reject(error)});
            
            return defer.promise;
        },

        getUserLicenses:function(ENV, username){
            var defer=$q.defer();
                           
            if (ENV.licenseManagementEnabled == 'false') { 
                defer.resolve(true);
            } else {
                var maxSafeInteger = Math.pow(2,16) - 1;            
                //$http.get(ENV.apiEndpoint+"/licenses?username="+username+"&limit="+maxSafeInteger+"&offset=0")
                $http.get(ENV.apiEndpoint+"/licenses?username="+username)
                .then(function successCallback(result){                
                    defer.resolve(result)})
                .catch(function errorCallback(error){                
                    defer.reject(error)});
            }  
            return defer.promise;
        },

        requestLicense:function(ENV, id, username){                
            var defer=$q.defer();
            var data={"service_uuid":id, "username":username};
            $http.post(ENV.apiEndpoint+"/licenses",data)
            .then(function successCallback(result){defer.resolve(result)})
            .catch(function errorCallback(error){defer.reject(error)});
            
            return defer.promise;
        }
    }
}]);
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

angular.module('InstantiationRequests')
    .controller('InstantiationRequestsCtrl', ["$scope", "$rootScope", "InstantiationRequestsServices","ENV", function ($scope, $rootScope,InstantiationRequestsServices,ENV) {

        $scope.currentInstantiationRequests= {};

        // retrieve InstantiationRequests to server
        $scope.retrieveInstantiationRequests = (function(){
            InstantiationRequestsServices.retrieveInstantiationRequests(ENV)
                .then(function(result){
                    $rootScope.InstantiationRequests = result;
                    },function(error){
                        alert(error);
                    })
            });
	    
	$scope.retrieveInstantiationRequests();
			
        $scope.openUpdateInstantiationRequests=function(data){
            $scope.currentInstantiationRequests=angular.copy(data);
			$('#updateInstantiationRequests.modal').modal('show');
			$($(".key.ng-binding.ng-scope")[0]).text("InstantiationRequest#"+$scope.currentInstantiationRequests.requestId);
        }

        //update data to server
        $scope.updateInstantiationRequests = function(){
            InstantiationRequestsServices.updateInstantiationRequests($scope.currentInstantiationRequests)
            .then(function(result){
                for(var key in $rootScope.InstantiationRequests){
                    if(result.id==$rootScope.InstantiationRequests[key].id)
                        $rootScope.InstantiationRequests[key] = result;
                }
                },function(error){
                    alert(error);
                })
        }

        $scope.emptyInstantiationRequests = function(){
            $scope.currentInstantiationRequests={};
        }
    }]);
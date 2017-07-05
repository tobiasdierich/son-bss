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

angular.module('Licenses')
    .controller('LicensesCtrl', ["$scope", "$rootScope", "$localStorage", "LicensesServices", "ENV", "linkHeaderParser", function ($scope, $rootScope, $localStorage, LicensesServices, ENV, linkHeaderParser) {

        
        $scope.offset = 0;
        $scope.pageSize = 10;
        $scope.currentPage = 1;
        $scope.user_name = $localStorage.currentUser.username;

        $scope.retrieveLicenses = (function (page) {
            LicensesServices.retrieveNSDs(ENV)
            .then(function (result) {
                var nSDs = result.data;
                
                LicensesServices.retrieveAllUserLicenses(ENV)
                .then( function (result){
                    var uslic = result.data;

                    $scope.licenses = [];

                    //$scope.licenses generation

                    for (x in nSDs) {
                        if ($localStorage.currentUser.user_role === "customer") {
                            //customer license
                            $scope.licenses.push({"service_name":nSDs[x].nsd.name,"service_id":nSDs[x].uuid,"license_type":nSDs[x].nsd.licenses[0].type, "license_use":"Instantiation"}); 
                        } else if ($localStorage.currentUser.user_role === "developer"){
                            //developer license
                            $scope.licenses.push({"service_name":nSDs[x].nsd.name,"service_id":nSDs[x].uuid,"license_type":nSDs[x].nsd.licenses[0].type, "license_use":"Package Creation"});
                        } else {
                            //both customer and developer licenses
                            $scope.licenses.push({"service_name":nSDs[x].nsd.name,"service_id":nSDs[x].uuid,"license_type":nSDs[x].nsd.licenses[0].type, "license_use":"Instantiation"});
                            $scope.licenses.push({"service_name":nSDs[x].nsd.name,"service_id":nSDs[x].uuid,"license_type":nSDs[x].nsd.licenses[0].type, "license_use":"Package Creation"});
                        }
                    }

                    // already purchased field
                    for (x in $scope.licenses) {
                        $scope.licenses[x].already_purchased = "No"
                        for (y in uslic){
                            if ($scope.licenses[x].license_type.toUpperCase() === "PUBLIC") {
                                $scope.licenses[x].already_purchased = "Not Needed"
                            } else if (($scope.licenses[x].service_name === uslic[y].service_name)&&($scope.licenses[x].license_type.toUpperCase() === uslic[y].license_type.toUpperCase())
                                        &&($scope.licenses[x].license_use.toUpperCase() === uslic[y].license_use.toUpperCase())) {
                                $scope.licenses[x].already_purchased = "Yes"
                            }
                        }
                    }

                    //pagination
                    $scope.totalRecords = $scope.licenses.length;
                    $scope.pagedLicenses = [];
                    var pos = (page-1)*$scope.pageSize;
                    for (x=pos; x < Math.min((pos+$scope.pageSize),$scope.licenses.length); x++) {
                        $scope.pagedLicenses.push($scope.licenses[x]);
                    }

                }, function (error) {
                    if (JSON.stringify(error.data.code).indexOf('401') >= 0) {
                        $scope.pagedLicenses = '';
                    }
                    $scope.error = angular.copy(JSON.stringify(error.data.message));
                $   ('#error.modal').modal('show');
                })

            }, function (error) {
                if (JSON.stringify(error.data.code).indexOf('401') >= 0) {
                    $scope.licenses = '';
                }
                $scope.error = angular.copy(JSON.stringify(error.data.message));
                $('#error.modal').modal('show');
            })
        });

        $scope.openDetailedLicense = function (data) {
            $scope.currentLicense = angular.copy(data);
            console.log($scope.currentLicense);
            $('#detailedLicense.modal').modal('show');
            $($(".key.ng-binding.ng-scope")[0]).text("License#" + $scope.currentLicense.service_name);
        }


        $scope.showModalRequestingLicense = function(data) {
           $scope.service_id = angular.copy(data);
           $('#getLicense.modal').modal('show');
         }


         $scope.requestLicense = function(service_id) {
           //console.log("$scope.currentNSD.uuid: "+$scope.currentNSD.uuid);
           LicensesServices.requestLicense(ENV, service_id)
           .then(function(result) {
             $('#getLicense.modal').modal('hide');   
             $scope.licenseRequest = result.data;
             $('#getLicenseResponse.modal').modal('show');    
           }, function(error) {
             $scope.error = angular.copy(JSON.stringify(error.data.message));
             $('#error.modal').modal('show');   
           })
         }


        $scope.clickPageButton = function (page) {
            $scope.retrieveLicenses(page);
        }

        $rootScope.$on("reloadLicenses", function(){
            $scope.reload();
        });

        $scope.reload = function () {
            $scope.currentPage = 1;
            $scope.retrieveLicenses(1);
        }

        $scope.retrieveLicenses(1);
    }
]);

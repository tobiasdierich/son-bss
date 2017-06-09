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
 .controller('NSDCtrl', ["$scope", "$rootScope", "NSDServices", "ENV", "linkHeaderParser", function($scope, $rootScope, NSDServices, ENV, linkHeaderParser) {

  $scope.currentNSD = {};
  $scope.offset = 0;
  $scope.limit = 10;
  $scope.ingresses = [{}];
  $scope.egresses = [{}];

$scope.getUserLicenses = function(callback) {
  //console.log("-------------- getUserLicenses");
  NSDServices.getUserLicenses(ENV, $rootScope.username)
  .then(function(result) {   
   $rootScope.userLicenses = result.data;
   callback(result.data);
 }, function(error) {
  $scope.error = angular.copy(JSON.stringify(error.data.message));
  $('#error.modal').modal('show');   
})
}

  // retrieve NSD to server
  $scope.retrieveNSDs = (function(offset) {    

    $scope.getUserLicenses(function(){
      //console.log("-------------- retrieveNSDs");
      NSDServices.retrieveNSDs(ENV, offset)
      .then(function(result) {

       var nSDs = result.data;
       var licenses = $rootScope.userLicenses;
       var today = new Date();
       var validityDate;     

       for (x in nSDs) {      
        nSDs[x].userPermission="false";
        nSDs[x].comment="";
        for (y in licenses) {     
          validityDate = new Date(licenses[y].valid_until);   
          if ((licenses[y].service_id === nSDs[x].uuid)&&(licenses[y].license_use === "Instantiation")&&(validityDate > today)) {
            nSDs[x].userPermission="true";
            nSDs[x].comment="";
            break;
          }else{
            if ((licenses[y].service_id === nSDs[x].uuid)&&(licenses[y].license_use === "Package Creation")) {
              nSDs[x].comment=". Instantiation License Required"; 
            }
            if ((licenses[y].service_id === nSDs[x].uuid)&&(licenses[y].license_use === "Instantiation")&&(validityDate <= today)) {
              nSDs[x].comment=". Instantiation License Expired";
            }
          }
        }
      }
      $rootScope.nSDs = nSDs;
      //console.log("-- final nSDs: "+JSON.stringify(nSDs));    

      //pagination
      var linkHeaderText = result.headers("Link");                    
      var link = linkHeaderParser.parse(linkHeaderText);                    
      $scope.totalPages = parseInt(link.last.offset)+1;
      $scope.limit = parseInt(link.last.limit);
      $scope.totalRecords = $scope.limit*$scope.totalPages;

      }, function(error) {      
        if(JSON.stringify(error.data.code).indexOf('401') >= 0) {
          $rootScope.nSDs = '';
          $rootScope.userLicenses = '';
        }
        $scope.error = angular.copy(JSON.stringify(error.data.message));
        $('#error.modal').modal('show');   
      })
    })    
  });

  //$scope.getUserLicenses();

  $scope.retrieveNSDs($scope.offset, $scope.userLicenses);

  $scope.openAddNSD = function() {
   $scope.currentNSD = {};
   $('#addNSD.modal').modal('show');
 }

  // save NSD to server
  $scope.saveNSD = function() {
   NSDServices.saveNSD($scope.currentNSD)
   .then(function(result) {
     $rootScope.nSDs.push(result.data);
   }, function(error) {
     $scope.error = angular.copy(JSON.stringify(error.data.message));
     $('#error.modal').modal('show');   
   })
 }

 $scope.openUpdateNSD = function(data) {
   $scope.currentNSD = angular.copy(data);
   $('#updateNSD.modal').modal('show');
   $($(".key.ng-binding.ng-scope")[0]).text("NSD#" + $scope.currentNSD.uuid);

   //$(".key.ng-binding.ng-scope").text("NSD")
 }

 $scope.openInstantiateNSD = function(data) {
   $scope.currentNSD = angular.copy(data);
   $('#instantiateNSD.modal').modal('show');
 }


 $scope.instantiateNSD = function() {
   //console.log("$scope.currentNSD.uuid: "+$scope.currentNSD.uuid);
   NSDServices.instantiateNSD($scope.currentNSD.uuid, $scope.ingresses, $scope.egresses, ENV)
   .then(function(result) {
     $('#instantiateNSD.modal').modal('hide');	 
     $scope.instantiateRequest = result.data;
     $('#instantiateRequest.modal').modal('show');    
   }, function(error) {
     $scope.error = angular.copy(JSON.stringify(error.data.message));
     $('#error.modal').modal('show');   
   })

   $scope.cleanInstantiationIngressEgress();

 }

 $scope.emptyNSD = function() {
   $scope.currentNSD = {};
   $scope.cleanInstantiationIngressEgress();
 };
 
 $scope.showPopover = function(nSD) {
   $scope.popoverIsVisible = true;
   $scope.hoveredNSD = nSD;
 };

 $scope.hidePopover = function() {
   $scope.popoverIsVisible = false;
 };

 $scope.clickPageButton=function(page){
   //console.log("button navigation clicked (page "+page+")");
   var offset = page-1;            
   $scope.retrieveNSDs(offset);
 }

 $scope.showModalRequestingLicense = function(data) {
   $scope.service_id = angular.copy(data);
   $('#getLicense.modal').modal('show');
 }


 $scope.requestLicense = function(service_id) {
   //console.log("$scope.currentNSD.uuid: "+$scope.currentNSD.uuid);
   NSDServices.requestLicense(ENV, service_id)
   .then(function(result) {
     $('#getLicense.modal').modal('hide');   
     $scope.licenseRequest = result.data;
     $('#getLicenseResponse.modal').modal('show');    
   }, function(error) {
     $scope.error = angular.copy(JSON.stringify(error.data.message));
     $('#error.modal').modal('show');   
   })
 }

 $scope.cleanInstantiationIngressEgress = function() {
   $scope.ingresses = [{}];
   $scope.egresses = [{}];
 }

}]);

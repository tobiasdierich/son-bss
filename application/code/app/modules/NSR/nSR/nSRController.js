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

angular.module('NSR')
 .controller('NSRCtrl', ["$scope", "$rootScope", "NSRServices", "NSDServices", "ENV", function($scope, $rootScope, NSRServices, NSDServices, ENV) {

  // retrieve NSD to server
  $scope.retrieveNSDs = (function() {
   NSRServices.retrieveNSDs(ENV)
    .then(function(result) {
     $rootScope.nSDs = result;
     $scope.generateNSDMap(result);
    }, function(error) {
     alert(error);
    })
  });
  
  $scope.retrieveNSDs();
  
  $scope.currentNSR = {};

  $scope.generateNSDMap = (function(obj){
	  
	  $rootScope.nSDsMap = new Object(); 	  
	  $rootScope.activeNSDsMap = new Object(); 	  
	  var uuid;
	  var name;
	  var vendor;
	  var version;
	  var descriptorVersion;
	  var status;
	  
	  for (var i=0; i<obj.length;i++){
		  for (var key in obj[i]) {		   
			if (key == "uuid") uuid=obj[i][key];		
			if (key == "name") name=obj[i][key];		
			if (key == "vendor") vendor=obj[i][key];		
			if (key == "version") version=obj[i][key];
			if (key == "descriptor_version") descriptorVersion=obj[i][key];
			if (key == "status") status=obj[i][key];		
	       }	  	       
	       $rootScope.nSDsMap[uuid] = name+"//"+vendor+"//"+version;
	       if (status == "active") $rootScope.activeNSDsMap[name+vendor] = descriptorVersion+"//"+uuid;
	}
	//console.log("----------------------"+JSON.stringify($rootScope.nSDsMap));
	//console.log("----------------------"+JSON.stringify($rootScope.activeNSDsMap));
	$scope.retrieveNSRs();
  });
  
   // retrieve NSR to server
  $scope.retrieveNSRs = (function() {
   NSRServices.retrieveNSRs(ENV)
    .then(function(result) {
     $rootScope.nSRs = result;
    }, function(error) {
     alert(error);
    })
  });

  //$scope.retrieveNSRs();
  
  $scope.openDetailedNSR = function(data) {
   $scope.currentNSR = angular.copy(data);
   $('#detailedNSR.modal').modal('show');
   $($(".key.ng-binding.ng-scope")[0]).text("NSR#" + $scope.currentNSR.uuid);   
  }

  $scope.openUpdateNSR = function(data) {
   $scope.currentNSR = angular.copy(data);
   $('#updateNSR.modal').modal('show');
  }


  $scope.updateNSR = function() {
   //console.log("$scope.currentNSD.uuid: "+$scope.currentNSD.uuid);
   NSRServices.updateNSR($scope.currentNSR.uuid,$scope.currentNSR.descriptor_reference,$scope.actualDescUuid, ENV)
    .then(function(result) {
     $('#updateNSR.modal').modal('hide');	 	 
	 $('#updateRequest.modal').modal('show');    
	}, function(error) {
     alert(error);
    })
  }
  
  $scope.getActualNSDVersion = function(nSR, nSDsMap, activeNSDsMap){
	  //console.log("descriptor_reference: "+nSR.descriptor_reference);
	  //console.log("original descriptor version: "+nSR.descriptor_version);
	  var nameVendorVersion = nSDsMap[nSR.descriptor_reference];	  
	  var nameVendor = nameVendorVersion.substring(0,nameVendorVersion.lastIndexOf("//"));
	  nameVendor = nameVendor.replace("//","");
	  var actualDescVersionUuid = activeNSDsMap[nameVendor];
	  //console.log("actual descriptor version: "+actualDescVersion);
	  
	  $scope.actualDescVersion = actualDescVersionUuid.substring(0,actualDescVersionUuid.lastIndexOf("//"));	  
	  $scope.actualDescUuid = actualDescVersionUuid.substring(actualDescVersionUuid.lastIndexOf("//")+2,actualDescVersionUuid.length);
	  
	  //console.log("actual desc version: "+$scope.actualDescVersion);
	  //console.log("actual desc uuid: "+$scope.actualDescUuid);
	  
	  return $scope.actualDescVersion;
  }

  $scope.emptyNSR = function() {
   $scope.currentNSR = {};
  };
  
  $scope.showPopover = function(nSR) {
   $scope.popoverIsVisible = true;
   $scope.hoveredNSR = nSR;
  };

  $scope.hidePopover = function() {
   $scope.popoverIsVisible = false;
  };

 }]);
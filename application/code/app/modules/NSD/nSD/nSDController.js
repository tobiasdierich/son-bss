/**
 * Created by Shivali on 6/30/15.
 */

angular.module('NSD')
    .controller('NSDCtrl', ["$scope", "$rootScope", "NSDServices","ENV",function ($scope, $rootScope,NSDServices,ENV) {

        $scope.currentNSD= {};
        
        // retrieve NSD to server
        $scope.retrieveNSDs = (function(){
            NSDServices.retrieveNSDs(ENV)
                .then(function(result){
                    $rootScope.nSDs = result;
                    },function(error){
                        alert(error);
                    })
            })();


        $scope.openAddNSD=function(){
            $scope.currentNSD= {};
            $('#addNSD.modal').modal('show');
        }

        // save NSD to server
        $scope.saveNSD = function(){
            NSDServices.saveNSD($scope.currentNSD)
            .then(function(result){
                    $rootScope.nSDs.push(result);
                },function(error){
                    alert(error);
                })
        }

        $scope.openUpdateNSD=function(data){
	    $scope.currentNSD=angular.copy(data);
            $('#updateNSD.modal').modal('show');	    
	    $($(".key.ng-binding.ng-scope")[0]).text("NSD#"+$scope.currentNSD.id);
	    
	    //$(".key.ng-binding.ng-scope").text("NSD")
        }

        //update data to server
        /**$scope.updateNSD = function(){
            NSDServices.updateNSD($scope.currentNSD)
            .then(function(result){
                for(var key in $rootScope.nSDs){
                    if(result.id==$rootScope.nSDs[key].id)
                        $rootScope.nSDs[key] = result;
                }
                },function(error){
                    alert(error);
                })
        }*/
	
	
	

        $scope.openInstantiateNSD=function(data){
            $scope.currentNSD=angular.copy(data);
            $('#instantiateNSD.modal').modal('show');
        }

        //delete data to server
        $scope.instantiateNSD = function(){
                NSDServices.instantiateNSD($scope.currentNSD.id,ENV)
                .then(function(result){
                    for(var key in $rootScope.nSDs){
                        if($scope.currentNSD.id==$rootScope.nSDs[key].id){
                            $rootScope.nSDs.splice(key,1);
                            break;
                        }
                }
                },function(error){
                    alert(error);
                })
        }
	

       /** $scope.openDeleteNSD=function(data){
            $scope.currentNSD=angular.copy(data);
            $('#instantiateNSD.modal').modal('show');
        }*/

        //delete data to server
       /** $scope.deleteNSD = function(){
                NSDServices.deleteNSD($scope.currentNSD.id)
                .then(function(result){
                    for(var key in $rootScope.nSDs){
                        if($scope.currentNSD.id==$rootScope.nSDs[key].id){
                            $rootScope.nSDs.splice(key,1);
                            break;
                        }
                }
                },function(error){
                    alert(error);
                })
        }*/

        $scope.emptyNSD = function(){
            $scope.currentNSD={};
	};    
	$scope.showPopover = function(nSD){
	$scope.popoverIsVisible = true; 
	$scope.hoveredNSD = nSD; 
	};

        $scope.hidePopover = function(){
	$scope.popoverIsVisible = false;
	};
    
    }]);
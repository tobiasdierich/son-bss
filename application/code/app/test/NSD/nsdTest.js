describe('NSD.NSDCtrl', function() {
  
  beforeEach(module('SonataBSS'));
  beforeEach(module('NSD'));
  var controller, scope;
  beforeEach(inject(function(_$rootScope_,_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    
	scope = _$rootScope_.$new();
	controller = _$controller_;
  }));
  
  
 describe('Check nSDs', function() {
    it('gets the list of NSDs', function() {
      
     
      expect(true).toBe(true);
    });})

});
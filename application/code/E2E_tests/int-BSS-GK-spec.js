describe('SonataBSS Retrieves Services and Instantiation Requests', function() {

   beforeEach(function() {
    browser.get('http://localhost:1337');
  });

  
  it('title must be SonataBSS', function() {
    expect(browser.getTitle()).toEqual('SonataBSS');
  });
  
  it ('default url is NSDs',function(){
	expect (browser.getCurrentUrl()).toBe('http://localhost:1337/#/nSDs');
  });

  
  
describe('NSDs View', function() {  

  beforeEach(function() {
    browser.get('http://localhost:1337/#/NSDs');
  });

  
  it('services list must not be empty', function() {
	
	var count=element.all(by.repeater('nSD in nSDs')).count();
	expect(count).toBeGreaterThan(0);
  });

  it('when clicked: "service details" shows the service descriptor details' , function() {
	
	var el=element.all(by.css('.btn-success')).get(0);
	
	el.click();
	
	var tree_el=element(by.tagName('json-tree'));
	
	
	expect(tree_el.getAttribute('object')).toBe('currentNSD');
  });

  });
describe('Instantiation Requests View', function() {  

  beforeEach(function() {
    browser.get('http://localhost:1337/#/InstantiationRequests');
  });

  
  it('instantiation requests list must not be empty', function() {
	
	var count=element.all(by.repeater('iR in InstantiationRequests')).count();
	expect(count).toBeGreaterThan(0);
  });

  it('when clicked: "request details" shows the instantiation request details' , function() {
	
	var el=element.all(by.css('.btn-success')).get(0);
	
	el.click();
	
	var tree_el=element(by.tagName('json-tree'));
	
	
	expect(tree_el.getAttribute('object')).toBe('currentInstantiationRequests');
  });

});  
  


});

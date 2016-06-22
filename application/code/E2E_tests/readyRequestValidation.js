describe('SonataBSS Ready Request Validation', function() {

    var requestId;
	var file = new File("ids.txt");

    it('instantiation request must be in the list', function() {

		file.open("r");
		requestId = file.readln();
		file.close();
	
        browser.get('http://localhost:1337/#/InstantiationRequests');
        
        var query = element(by.model('InstantiationRequestsSearch'));
        query.sendKeys(requestId);

        var data = element.all(by.repeater("InstantiationRequest in InstantiationRequests"));

        expect(data.count()).toBe(1);
		
		expect(data['status']).getText()).toEqual('ready');

    });

});
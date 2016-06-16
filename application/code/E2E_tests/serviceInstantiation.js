describe('SonataBSS Instantiates a Service', function() {

    var requestId;

    beforeEach(function() {
        browser.get('http://localhost:1337/#/NSDs');
    });


    it('services list must not be empty', function() {

        var count = element.all(by.repeater('nSD in nSDs')).count();
        expect(count).toBeGreaterThan(0);
    });

    it('when clicked: "request service instantiation" instantiates a new service', function() {

        var inst_el = element.all(by.css('.btn-danger')).get(0);

        inst_el.click();

        var parent = element(by.id('instantiateNSD'));
        var child = parent.element(by.binding('childBinding'));

        var yes_el = parent.element(by.css('.btn-success'));

        yes_el.click();
        browser.sleep(1500);

        parent = element(by.id('instantiateRequest'));
        expect(parent.isDisplayed()).toBe(true);

        parent.element(by.id('requestId')).getText().then(function(text) {
            requestId = text;
        });

    });

    it('instantiation request must be in the list', function() {

        browser.get('http://localhost:1337/#/InstantiationRequests');
        
        var query = element(by.model('InstantiationRequestsSearch'));
        query.sendKeys(requestId);

        var data = element.all(by.repeater("InstantiationRequest in InstantiationRequests"));

        expect(data.count()).toBe(1);

    });

});
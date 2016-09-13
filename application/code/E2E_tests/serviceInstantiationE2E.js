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

        parent = element(by.id('request'));
        expect(parent.isDisplayed()).toBe(true);

        parent.element(by.id('requestId')).getText().then(function(text) {
            requestId = text;
        });

    });

    it('instantiation request must be in the list', function() {

        browser.get('http://localhost:1337/#/requests');
        
        var query = element(by.model('RequestsSearch'));
        query.sendKeys(requestId);

        var data = element.all(by.repeater("Request in Requests"));

        expect(data.count()).toBe(1);

    });

	it('request must be ready after service instantiation process', function() {

		browser.get('http://localhost:1337/#/requests');

		var query = element(by.model('RequestsSearch'));
		query.sendKeys(requestId);

		var EC = protractor.ExpectedConditions;
		browser.wait(EC.textToBePresentInElement(element(by.repeater("Request in Requests").column('status')) ,'ready', 60000));

    });

});
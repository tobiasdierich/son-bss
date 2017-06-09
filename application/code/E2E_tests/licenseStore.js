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
 
describe('SonataBSS License Store', function() {

    var requestId;
	
    beforeEach(function() {
        browser.driver.manage().window().maximize();
        browser.get(browser.params.protocol+'://'+browser.params.hostname+':1337/#/login');
        browser.driver.findElement(by.id('username')).sendKeys('sonata');
        browser.driver.findElement(by.id('password')).sendKeys('sonata');
        browser.driver.findElement(by.xpath('//button[. = "Login"]')).click(); 
        browser.driver.findElement(by.xpath("//a[@href='#/licenses']")).click();       
    });


    it('licenses list', function() {
        //element(by.repeater('tab in tabs').row(0)).click();
        element(by.xpath("//*[contains(text(),'Service Licenses')]")).click()
        var count = element.all(by.repeater('license in pagedLicenses')).count();
        expect(count).toBeGreaterThan(0);
    });
  

    it('license request', function() {
	
        var EC = protractor.ExpectedConditions;

        var modal = element.all(by.css('[ng-click="showModalRequestingLicense(license[\'service_id\'])"]')).get(1).click();
        browser.wait(EC.visibilityOf(modal), 5000);        
        
        modal = element(by.id('getLicense'));
        var yes = modal.element(by.css('.btn-success'));

        yes.click();
        browser.sleep(1500);

        modal = element(by.id('getLicenseResponse'));
        expect(modal.isDisplayed()).toBe(true);   

    });

    it('user licenses list', function() {
        //element(by.repeater('tab in tabs').row(2)).click();
        //element(by.cssContainingText('.userLicenses', 'User Licenses')).click();
        element(by.xpath("//*[contains(text(),'User Licenses')]")).click()
        var count = element.all(by.repeater('userLicense in userLicenses')).count();
        expect(count).toBeGreaterThan(0);
    });
    
});
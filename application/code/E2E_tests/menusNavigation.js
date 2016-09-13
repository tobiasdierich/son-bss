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
 
describe('SonataBSS Retrieves Available Services, Instantiation Requests and Service Instances', function() {

    beforeEach(function() {
        browser.get('http://localhost:1337');
    });


    it('title must be SonataBSS', function() {
        expect(browser.getTitle()).toEqual('SonataBSS');
    });

    it('default url is NSDs', function() {
        expect(browser.getCurrentUrl()).toBe('http://localhost:1337/#/nSDs');
    });



    describe('NSDs View', function() {

        beforeEach(function() {
            browser.get('http://localhost:1337/#/NSDs');
        });


        it('services list must not be empty', function() {

            var count = element.all(by.repeater('nSD in nSDs')).count();
            expect(count).toBeGreaterThan(0);
        });

        it('when clicked: "service details" shows the service descriptor details', function() {

            var el = element.all(by.css('.btn-success')).get(0);

            el.click();

            var tree_el = element(by.tagName('json-tree'));


            expect(tree_el.getAttribute('object')).toBe('currentNSD');
        });

    });

    describe('Requests View', function() {

        beforeEach(function() {
            browser.get('http://localhost:1337/#/requests');
        });


        it('requests list must not be empty', function() {

            var count = element.all(by.repeater('Request in Requests')).count();
            expect(count).toBeGreaterThan(0);
        });

        it('when clicked: "request details" shows the request details', function() {

            var el = element.all(by.css('.btn-success')).get(0);

            el.click();

            var tree_el = element(by.tagName('json-tree'));


            expect(tree_el.getAttribute('object')).toBe('currentRequests');
        });

    });

    describe('Service Instances View', function() {

        beforeEach(function() {
            browser.get('http://localhost:1337/#/nSRs');
        });


        it('service instances list must not be empty', function() {

            var count = element.all(by.repeater('nSR in nSRs')).count();
            expect(count).toBeGreaterThan(0);
        });

        it('when clicked: "request details" shows the instantiation request details', function() {

            var el = element.all(by.css('.btn-success')).get(0);

            el.click();

            var tree_el = element(by.tagName('json-tree'));


            expect(tree_el.getAttribute('object')).toBe('currentNSR');
        });

    });

});
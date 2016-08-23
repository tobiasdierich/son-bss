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

var fmock =  function (req, res, next) {		
	//console.log("Mock: receiving "+req.method+" request");
	if (req.url.indexOf('/mock') === 0) {
 
		  // everything after /mock is the path that we need to mock
		  var path = req.url.substring(5);
		  var body = '';
		  if (req.method === 'OPTIONS') {		
			//console.log("OPTIONS");			
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.setHeader('Access-Control-Allow-Methods','POST, GET, OPTIONS, DELETE, PUT');
			res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');								  
			res.writeHeader(200, {
				"Content-Type": "application/json"
			});
			res.end(); 
		  };
		  if (req.method === 'POST') {		
			//console.log("POST");
			body += '{ "id": "12345" }';
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');								  
			res.writeHeader(200, {
				"Content-Type": "application/json"
				});
				res.write(body);
				res.end(); 
		  };
		  if (req.method === 'GET') {			  
			  if (path.indexOf('/services') === 0) {
				if (path.indexOf('/services?status=active') === 0) {
					//console.log("GET /services");
					//body response
					body += JSON.stringify(require('./examples/activeNSD.json'));											  
					//body response
					res.setHeader('Access-Control-Allow-Origin', '*');
					res.writeHeader(200, {
						"Content-Type": "application/json"
					});										  
					res.writeHead['content-type'] = 'application/json';
					res.write(body);
					res.end(); 
				} else {
					//console.log("GET /services");
					//body response
					body += JSON.stringify(require('./examples/allNSD.json'));											  
					//body response
					res.setHeader('Access-Control-Allow-Origin', '*');
					res.writeHeader(200, {
						"Content-Type": "application/json"
					});										  
					res.writeHead['content-type'] = 'application/json';
					res.write(body);
					res.end(); 
				};
			  } else {
				  if (path.indexOf('/requests') === 0) {
					  //console.log("GET /requests");
					  body += JSON.stringify(require('./examples/request.json'));
					  res.setHeader('Access-Control-Allow-Origin', '*');
					  res.writeHeader(200, {
						"Content-Type": "application/json"
					  });											  
					  res.write(body);
					  res.end();
				  } else {
					  if (path.indexOf('/records/services') === 0) {
						  //console.log("GET /records/services");
						  body += JSON.stringify(require('./examples/NSR.json'));
						  res.setHeader('Access-Control-Allow-Origin', '*');
						  res.writeHeader(200, {
							  "Content-Type":"application/json"
						  });
						  res.write(body);
						  res.end();
					  } else {
						//console.log("GET others");
						res.setHeader('Access-Control-Allow-Origin', '*');											  
						res.writeHeader(200, {
							"Content-Type": "application/json"
						});
						res.write(body);
						res.end();
					 }
				  }
			 }
		  };
		  if (req.method === 'PUT') {
			//console.log("PUT");
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.setHeader('Access-Control-Allow-Methods','POST, GET, OPTIONS, DELETE, PUT');
			res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');											  
			res.writeHeader(200, {
				"Content-Type": "application/json"
			});
			res.write(body);
			res.end();
		  };															
	}
};

module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			options: {
				livereload: true
			},      
			protractor: {        
				files: ['E2E_tests/todo*.js'],
				tasks: ['protractor:run']
			}
		},
		ngconstant: {
			// Options for all targets
			options: {
		    space: '  ',
		    wrap: '"use strict";\n\n {%= __ngModule %}',
		    name: 'config',
			livereload: true
		  },
		  // Environment targets
		  development: {
		    options: {
		      dest: 'app/config/config.js'
		    },
		    constants: {
		      ENV: {
				name: 'development',
				apiEndpoint: [grunt.option('gkApiUrl')]
		      }
		    }
		  },
		  integration: {
		    options: {
		      dest: 'app/config/config.js'
		    },
		    constants: {
		      ENV: {
				name: 'integration',
				apiEndpoint: [grunt.option('gkApiUrl')]
		      }
		    }
		  },
		  qualification: {
		    options: {
		      dest: 'app/config/config.js'
		    },
		    constants: {
		      ENV: {
				name: 'qualification',
				apiEndpoint: [grunt.option('gkApiUrl')]
		      }
		    }
		  }
		},
		connect: {			
			dist: {				
				options: {
					port: 1337,
					base: 'app'
				}
			},
			mock: {								
				options: {
					port: 1338,
					base: 'app',
					middleware: [
						fmock
					],
				},
			},									
			int: {
				options: {
					port: 1337,
					base: 'app'
				}				
			},
			qualif: {
				port: 1337,
				base: 'app'
			}
		},
		protractor: {
		  options: {
			configFile: "protractor.conf.js",		 
			noColor: false,
			keepAlive: true
		  },		  
		  run: {},
		  auto: {
			keepAlive: true,
			options: {
				args: {
					seleniumPort: 4444					
				}
			}
		  }
		},
		protractor_webdriver: {
			start: {
				options: {
					path: 'node_modules/protractor/bin/',
					keepAlive: true,
					command: 'webdriver-manager start'
				}
			}
		}
	});
    
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);	
	
	grunt.registerTask('default', 'connect:dist');
	grunt.registerTask('serve', function (target) {	
	
		if (target === 'development') {    
			return grunt.task.run(['ngconstant:development', 'connect:dist', 'connect:mock', 'watch:protractor']);
		}		
		if (target === 'unit_tests') {    
			return grunt.task.run(['ngconstant:development', 'connect:dist', 'connect:mock', 'protractor_webdriver', 'protractor:run', 'watch:protractor']);
		}
		if (target === 'integration_tests') {    
			return grunt.task.run(['ngconstant:integration','connect:int', 'protractor_webdriver', 'protractor:run', 'watch:protractor']);
		}
		if (target === 'integration') {    
			return grunt.task.run(['ngconstant:integration','connect:int', 'watch:protractor']);
		}
		if (target === 'qualification') {    
			return grunt.task.run(['ngconstant:qualification','connect:qualif', 'watch:protractor']);
		}  
	});
}; 

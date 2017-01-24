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

 var isAuthorizedUser = function (req, validUsername) {

	var jwt = require('jsonwebtoken');
	var token = req.headers.authorization;
	//console.log("token: "+ token);
	var decoded = jwt.decode(token);

	if ((decoded != null) && (validUsername === decoded.name)) {
		return true;
	} else {
		return false;
	}
}

var fmock = function (req, res, next) {
	var authorizedUser = {
		"username": "sonata",
		"password": "sonata"
	};
	var notAuthorizedUser = {
		"username": "test",
		"password": "test"
	};
	var AuthorizedUser = false;

	//console.log("Mock: receiving "+req.method+" request");
	if (req.url.indexOf('/mock') === 0) {

		// everything after /mock is the path that we need to mock
		var path = req.url.substring(5);
		var body = '';

		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
		res.setHeader('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
		res.setHeader('Access-Control-Expose-Headers', 'Link, X-Total-Count');	

		switch (req.method) {
		case 'OPTIONS':
			//console.log('OPTIONS...');
			res.writeHeader(200, {
				"Content-Type": "application/json"
			});
			res.end();
			break;
		case 'POST':
			//console.log('POST...');
			//authentication
			if (path.indexOf('/authenticate') === 0) {
				//console.log(req);
				var body = "";
				req.on('data', function (data) {
					body += data;
				});
				req.on('end', function () {
					var params = JSON.parse(body);

					if (params.username === authorizedUser.username && params.password === authorizedUser.password) {
						//console.log("Authenticated and Authorizated usr");
						body = '{"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6InNvbmF0YSIsImFkbWluIjp0cnVlfQ.AdgPchW4kBolbrVPn8YlrNIOx8XqcHcO_bCR2gclGyo"}';
						res.writeHeader(200, {
							"Content-Type": "application/json"
						});						
					} else {
						if (params.username === notAuthorizedUser.username && params.password === notAuthorizedUser.password) {
							// not AuthorizedUser: user is authenticated but token doesn't allow it to retrieve platform information
							//console.log("Authenticated but not Authorizated usr");
							body = '{"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6InRlc3QiLCJhZG1pbiI6ZmFsc2V9.ysMOZXnPs4VXMhgwhJmSPWjKW2trpjA8Ym-X4plfVrY"}';
							res.writeHeader(200, {
								"Content-Type": "application/json"
							});							
						} else {
							//console.log("not valid usr/pwd");							
							body = '{"code": "401", "message":"Not valid user/password"}';
							res.writeHeader(401);							
						}
					}
					res.write(body);
					res.end();
				});
			} else {				
				if (isAuthorizedUser(req, authorizedUser.username) === false) {
					body = '{"code": "401", "message":"Not Authorized User"}';
					res.writeHeader(401);
				} else {
					body += '{ "id": "1c58b169-7c38-4bcd-9421-a91bd786f100" }';
					res.writeHeader(200, {
						"Content-Type": "application/json"
					});
				}
				res.write(body);
				res.end();
			}
			break;
		case 'GET':
			//console.log('GET...');
			if (isAuthorizedUser(req, authorizedUser.username) === false) {					
				body = '{"code": "401", "message":"Not Authorized User"}';
				res.writeHeader(401);
			} else {
				if (path.indexOf('/services') === 0) {
					if (path.indexOf('/services?status=active') === 0) {
						//console.log("GET /services");
						//body response
						body += JSON.stringify(require('./examples/activeNSD.json'));
						//body response
						//res.setHeader('Access-Control-Allow-Origin', '*');
						res.writeHeader(200, {
							"Content-Type": "application/json",
							"Link": "<http://localhost:1338/mock/services?limit=10&offset=0>; rel=\"next\",<http://localhost:1338/mock/services?limit=10&offset=0>; rel=\"last\"",
						});
						res.writeHead['content-type'] = 'application/json';
					} else {
						//console.log("GET /services");
						//body response
						body += JSON.stringify(require('./examples/allNSD.json'));
						//body response
						//res.setHeader('Access-Control-Allow-Origin', '*');
						res.writeHeader(200, {
							"Content-Type": "application/json",
							"Link": "<http://localhost:1338/mock/services?limit=10&offset=0>; rel=\"next\",<http://localhost:1338/mock/services?limit=10&offset=0>; rel=\"last\"",
						});
						res.writeHead['content-type'] = 'application/json';
					};
				} else {
					if (path.indexOf('/requests') === 0) {
					    if (path.indexOf('/requests?limit=10&offset=1') === 0) {
						    body += JSON.stringify(require('./examples/request2.json'));							
							res.writeHeader(200, {
								"Content-Type": "application/json",
								"Link": "<http://localhost:1338/mock/requests?limit=10&offset=2>; rel=\"next\",<http://localhost:1338/mock/requests?limit=10&offset=3>; rel=\"last\""
							});
						} else {
							if (path.indexOf('/requests?limit=10&offset=2') === 0) {
								body += JSON.stringify(require('./examples/request3.json'));							
								res.writeHeader(200, {
									"Content-Type": "application/json",
									"Link": "<http://localhost:1338/mock/requests?limit=10&offset=3>; rel=\"next\",<http://localhost:1338/mock/requests?limit=10&offset=3>; rel=\"last\""
								});
							} else {
								if (path.indexOf('/requests?limit=10&offset=3') === 0) {
									body += JSON.stringify(require('./examples/request4.json'));							
									res.writeHeader(200, {
										"Content-Type": "application/json",
										"Link": "<http://localhost:1338/mock/requests?limit=10&offset=3>; rel=\"next\",<http://localhost:1338/mock/requests?limit=10&offset=3>; rel=\"last\""
									});
								} else {
									body += JSON.stringify(require('./examples/request.json'));							
									res.writeHeader(200, {
										"Content-Type": "application/json",
										"Link": "<http://localhost:1338/mock/requests?limit=10&offset=1>; rel=\"next\",<http://localhost:1338/mock/requests?limit=10&offset=3>; rel=\"last\""
									});
								}	
							}
						}
					} else {
						if (path.indexOf('/records/services') === 0) {							
							if (path.indexOf('/records/services?limit=10&offset=1') === 0) {
								body += JSON.stringify(require('./examples/NSR2.json'));							
								res.writeHeader(200, {
									"Content-Type": "application/json",
									"Link": "<http://localhost:1338/mock/records/services?limit=10&offset=1>; rel=\"next\",<http://localhost:1338/mock/records/services?limit=10&offset=1>; rel=\"last\"",
								});
							} else {
								body += JSON.stringify(require('./examples/NSR.json'));							
								res.writeHeader(200, {
									"Content-Type": "application/json",
									"Link": "<http://localhost:1338/mock/records/services?limit=10&offset=1>; rel=\"next\",<http://localhost:1338/mock/records/services?limit=10&offset=1>; rel=\"last\"",
								});
							}							
						} else {
							if (path.indexOf('/licenses') === 0) {
								body += JSON.stringify(require('./examples/userLicenses.json'));							
								res.writeHeader(200, {
									"Content-Type": "application/json",									
								});
							} else {
							//console.log("GET others");
							//res.setHeader('Access-Control-Allow-Origin', '*');
								res.writeHeader(200, {
									"Content-Type": "application/json",
									"Link": "<http://localhost:1338/mock/xxx?limit=10&offset=0>; rel=\"next\",<http://localhost:1338/mock/xxx?limit=10&offset=0>; rel=\"last\"",
								});
							}
						}
					}
				}
			}
			res.write(body);
			res.end();
			break;
		case 'PUT':
			//console.log('PUT...');
			if (isAuthorizedUser(req, authorizedUser.username) === false) {				
				body = '{"code": "401", "message":"Not Authorized User"}';
				res.writeHeader(401);
			} else {
				res.writeHeader(200, {
					"Content-Type": "application/json"
				});
			}
			res.write(body);
			res.end();
			break;
		}
	}
};

module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			options: {
				livereload: true//{
        			//port: 9000,
        			//key: grunt.file.read('E2E_tests/certs/mock.key'),
        			//cert: grunt.file.read('E2E_tests/certs/mock.crt')
        		//}
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
		  			apiEndpoint: [grunt.option('gkApiUrl')],
		  			userManagementEnabled: [grunt.option('userManagementEnabled')]
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
		  			apiEndpoint: [grunt.option('gkApiUrl')],
		  			userManagementEnabled: [grunt.option('userManagementEnabled')]
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
		  			apiEndpoint: [grunt.option('gkApiUrl')],
		  			userManagementEnabled: [grunt.option('userManagementEnabled')]
		  		}
		  	}
		  }
		},
		connect: {			
			dist: {				
				options: {
					protocol: 'https',
					key: grunt.file.read('app/certs/domain.key').toString(),
					cert: grunt.file.read('app/certs/domain.crt').toString(),					
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
					protocol: 'https',
					key: grunt.file.read('app/certs/domain.key').toString(),
					cert: grunt.file.read('app/certs/domain.crt').toString(),					
					port: 1337,
					base: 'app'
				}				
			},
			qualif: {
				protocol: 'https',
				key: grunt.file.read('app/certs/domain.key').toString(),
				cert: grunt.file.read('app/certs/domain.crt').toString(),
				options: {
					port: 1337,
					base: 'app'
				}				
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
					path: './node_modules/protractor/bin/',
					keepAlive: true,
					command: 'webdriver-manager start'
					//command: 'webdriver-manager start --standalone'
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

var fmock =  function (req, res, next) {		
							//console.log("Mock: receiving "+req.method+" request");
							if (req.url.indexOf('/mock') === 0) {
						 
							  // everything after /mock is the path that we need to mock
							  var path = req.url.substring(5);
							  var body = '';
							  if (req.method === 'OPTIONS') {		
							    //console.log("OPTIONS");
								
								res.setHeader('Access-Control-Allow-Origin', '*');
								res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');								  
								res.writeHeader(200, {
									"Content-Type": "application/json"
								});
								res.end(); 
							  } else {
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
								  } else {
									  if (req.method === 'GET') {
										  //console.log("GET");
										  if (path.indexOf('/services') === 0) {
											  //body response
											  body += JSON.stringify(require('./examples/NSD.json'));											  
											  //body response
											  res.setHeader('Access-Control-Allow-Origin', '*');
											  res.writeHeader(200, {
												"Content-Type": "application/json"
											  });										  
											  res.writeHead['content-type'] = 'application/json';
											  res.write(body);
											  res.end(); 
										  } else {
											  if (path.indexOf('/requests') === 0) {
												  body += JSON.stringify(require('./examples/request.json'));
												  res.setHeader('Access-Control-Allow-Origin', '*');
												  res.writeHeader(200, {
													"Content-Type": "application/json"
												  });											  
												  res.write(body);
												  res.end();
											  } else {
												  res.setHeader('Access-Control-Allow-Origin', '*');											  
												  res.writeHeader(200, {
													"Content-Type": "application/json"
												  });
												  res.write(body);
												  res.end();
											  }
										  }
									  } else {
											//console.log("OTHERS...");
											next();
										}  
								}	
							  }
							}
						};

var apiUrl;

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
			livereload: true,
			dest: 'app/config/config.js',
			apiEndpoint: apiUrl
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
	grunt.registerTask('serve', function (target, gkApiUrl) {	
	
		apiUrl = gkApiUrl;
		
		if (target === 'development') {    
			return grunt.task.run(['ngconstant', 'connect:dist', 'connect:mock', 'watch:protractor']);
		}		
		if (target === 'unit_tests') {    
			return grunt.task.run(['ngconstant', 'connect:dist', 'connect:mock', 'protractor_webdriver', 'protractor:run', 'watch:protractor']);
		}
		if (target === 'integration_tests') {    
			return grunt.task.run(['ngconstant','connect:int', 'protractor_webdriver', 'protractor:run', 'watch:protractor']);
		}
		if (target === 'integration') {    
			return grunt.task.run(['ngconstant','connect:int', 'watch:protractor']);
		}
		if (target === 'qualification') {    
			return grunt.task.run(['ngconstant','connect:qualif', 'watch:protractor']);
		}  
	});
}; 

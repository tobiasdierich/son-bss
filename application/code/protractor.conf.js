var HtmlScreenshotReporter = require('protractor-jasmine2-html-reporter');

//var reportName;

exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  seleniumServerJar: './node_modules/protractor/selenium/selenium-server-standalone-2.52.0.jar',
  //specs: ['E2E_tests/todo-spec.js'],
  suites: {
	  unitTests: ['E2E_tests/menusNavigation.js', 'E2E_tests/serviceInstantiation.js'],	  
	  menus_Navigation: ['E2E_tests/menusNavigation.js'],
	  service_Instantiation: ['E2E_tests/serviceInstantiation.js'],
	  service_Instantiation_E2E: ['E2E_tests/serviceInstantiationE2E.js']
  },
  
  capabilities: {
  'browserName': 'phantomjs',
    version: '',
    platform: 'ANY',
	'phantomjs.binary.path': './node_modules/phantomjs-prebuilt/bin/phantomjs',
	'phantomjs.ghostdriver.cli.args': ['--loglevel=DEBUG']
  },
     
  
  onPrepare: function() {
     /*process.argv.forEach((val, index, array) => {
        if (`${val}`=='--suite') {
                reportName = process.argv[`${index+1}`];
        }
     });*/    
     jasmine.getEnv().addReporter(
        new HtmlScreenshotReporter({
          savePath: 'E2E_tests/reports/',
          //filePrefix: reportName
        })
     );
   }
}
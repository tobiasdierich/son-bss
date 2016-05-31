# son-bss  [![Build Status](http://jenkins.sonata-nfv.eu/buildStatus/icon?job=son-bss)](http://jenkins.sonata-nfv.eu/job/son-bss) 

BSS GUI 
Very simple gui that allows customers to retrieve and inspect Network Services and additionally allows to request instantiations on them.
### Dependencies
 * Node.js
### Docker support
Build Docker container image 
```
docker rm -f son-bss

docker build -t son-yo-base .
docker build -t son-yo-gen generator/
docker build --no-cache -t son-yo-gen-bss application/ 
```


Run Docker container
```
docker run -d --name son-bss -p 25001:1337 -p 25002:1338 -it son-yo-gen-bss
docker exec -t -d son-bss grunt serve:unit_tests --gkApiUrl=[gatekeeper api url] --suite=unit
```
### Technologies

* [Grunt] (http://gruntjs.com/) - JavaScript Task Runner
* [AngularJS] (https://www.angularjs.org/) - JavaScript Framework for Web apps
* [Bower] (http://bower.io/) - Package manager for the web
* [npm] (https://www.npmjs.com/) -  Package manager for JavaScript
* [yeoman] (http://yeoman.io/) - Web Scaffolding Tool
* [node.js] (https://nodejs.org/en/) - JavaScript Runtime 

### Lead Developers
The following lead developers are responsible for this repository and have admin rights. They can, for example, merge pull requests.
 * Santiago Rodriguez (srodriguez)
 * Felipe Vicens (felipevicens)
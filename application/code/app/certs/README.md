# son-bss  

Grunt server will get the domain.crt and domain.key cert files from here.

NOTE: before the **docker exec -i -t son-bss grunt serve:<serve_type> --gkApiUrl=<gatekeeper_api_url>**,
docker cp domain.key son-bss:/usr/local/yeoman/SonataBSS/app/certs/domain.key
docker cp domain.crt son-bss:/usr/local/yeoman/SonataBSS/app/certs/domain.crt
were executed
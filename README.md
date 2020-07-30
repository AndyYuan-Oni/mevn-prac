# mevn-prac

Practise MEVN stack in a beginner way

## Use HTTPS as a server

generate your SSL key in `/sslcet` using the command

`openssl req -nodes -new -x509 -keyout server.key -out server.cert`

change `/client` side file `Api.vue` for the right URL

and open with FireFox for Chrome have small probs with https://localhost

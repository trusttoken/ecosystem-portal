#!/bin/bash
# Build docker image with correct heroku registry tag
docker build . -f Dockerfile.fe.prod -t registry.heroku.com/tt-ecosystem-portal-web/web

# Push image that was just created
docker push registry.heroku.com/tt-ecosystem-portal-web/web:latest

# Release image on heroku
heroku container:release web -a tt-ecosystem-portal-web

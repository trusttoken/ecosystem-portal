#!/bin/bash
# Build docker image with correct heroku registry tag
docker build . -f Dockerfile.be.prod -t registry.heroku.com/tt-ecosystem-portal-api/web --no-cache

# Push image that was just created
docker push registry.heroku.com/tt-ecosystem-portal-api/web:latest

# Release image on heroku
heroku container:release web -a tt-ecosystem-portal-api

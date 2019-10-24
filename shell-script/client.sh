#!/bin/sh

## This script expects a few rather standard tools available in most *nix systems are present; watch, curl and diff

watch -n1 '\
    touch current.new; \
    cp current.new current.old; \
    curl -s 127.0.0.1:8080/api/00000000-0000-0000-0000-000000000000/current > current.new; \
    diff current.old current.new | cp current.new current.json; \
'

## This script checks the API endpoint every second and - if result differs from the previous, updates current.json

## You can set up **another** script to check whenever current.json gets modified, parse it and... do what you want

#!/bin/bash

docker container stop formation-db && docker container rm formation-db 

echo "Docker arrêté"

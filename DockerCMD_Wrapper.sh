#!/bin/bash

# starting server

cd server
npm start &

# starting client

cd ../client
npm start
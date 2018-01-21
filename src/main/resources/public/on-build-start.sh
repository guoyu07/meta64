#!/bin/bash

echo "Running on-build-start.sh"

rm -rf ./dist/*

# To install Less CSS compiler run these commands:
#    sudo npm install -g less

# todo-2: there is an NPM package for lessc we could use, but i haven't bothered to learn that yet.
#         Update, actually the SASS plugin for webpack will be what I'll do here.
lessc ./css/meta64.less ./css/meta64.css
if [ $? -eq 0 ]
then
  echo "LESSC CSS generating successful."
else
  echo "LESSC compiler failed."
  exit 1
fi
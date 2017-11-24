#!/bin/bash

echo "Running on-build-start.sh"

# To install Less CSS compiler run these commands:
#    sudo npm install -g less

# todo-1: there is an NPM package for lessc we could use, but i haven't bothered to learn that yet.
lessc ./css/meta64.less ./css/meta64.css
if [ $? -eq 0 ]
then
  echo "LESSC CSS generating successful."
else
  echo "LESSC compiler failed."
  exit 1
fi
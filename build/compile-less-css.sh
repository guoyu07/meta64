#!/bin/bash
source ./setenv.sh

# To install Less CSS compiler run these commands:
#    sudo npm install -g less
cd $META64/src/main/resources/public/css
lessc meta64.less meta64.css
if [ $? -eq 0 ]
then
  echo "LESS CSS generating successful."
else
  echo "FAIL. LESS compiler reported ERRORS."
  sleep 7s
fi


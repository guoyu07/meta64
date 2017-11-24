#!/bin/bash
#NOTE: This file is called from the POM.XML file to make a maven build from inside Eclipse work.

source ./setenv.sh

rm -f $META64/src/main/resources/public/dist/*

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

cd $META64/src/main/resources/public
webpack
if [ $? -eq 0 ]
then
  echo "Webpack generating successful."
else
  echo "********** FAIL. Webpack reported ERRORS. **********"
  sleep 7s
  exit 1
fi

#fyi for Windows BAT: 
# exit /b %ERRORLEVEL%

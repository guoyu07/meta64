#!/bin/bash
#NOTE: This file is called from the POM.XML file to make a maven build from inside Eclipse work.

source ./setenv.sh

rm -rf $META64/src/main/resources/public/dist/*

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

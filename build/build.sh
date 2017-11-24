#!/bin/bash
source ./setenv.sh

export timestamp=`eval date +%Y-%m-%d-%s`
export backupFolder=$META64_BAK
export NODE_PATH=$META64/build/node_modules

rm -rf $META64/target/*
rm -rf $META64/src/main/resources/public/dist/*

cd $META64/src/main/resources/public
webpack --config webpack-prod.config.js
if [ $? -eq 0 ]
then
  echo "Webpack generating successful."
else
  echo "********** FAIL. Webpack reported ERRORS. **********"
  sleep 7s
  exit 1
fi

#go back to folder with this script in it. sort of 'home' for this script
cd $META64

mvn dependency:sources
mvn dependency:resolve -Dclassifier=javadoc
mvn clean package -DskipTests=true

rm -f $META64/build/*.sh~
rm -f $META64/src/main/resources/public/*.md~
rm -f $META64/*.md~

read -p "All done."

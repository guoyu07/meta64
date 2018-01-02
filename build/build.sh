#!/bin/bash
source ./setenv.sh

rm -rf $META64/target/*
rm -rf $META64/src/main/resources/public/dist/*

# The POM.XML will always call run-pom-exec.sh, and currently we don't have a way to run a build that specifies webpack-prod.config.js file
# but that is ok, the build can still function as a PROD build for now even using webpack.config.js, because the only difference between the two will
# be the tsconfig.json file designation, which currently is same for PROD+DEV. The eventual solution will be to use a "Maven Profile" to separate the
# PROD from DEV build and then we can have two versions of the run-pom-exec.sh.
# 
# cd $META64/src/main/resources/public
# webpack --config webpack-prod.config.js
# if [ $? -eq 0 ]
# then
#   echo "Webpack generating successful."
# else
#   echo "********** FAIL. Webpack reported ERRORS. **********"
#   sleep 7s
#   exit 1
# fi

#go back to folder with this script in it. sort of 'home' for this script
cd $META64

mvn dependency:sources
mvn dependency:resolve -Dclassifier=javadoc
mvn clean exec:exec package -DskipTests=true

rm -f $META64/build/*.sh~
rm -f $META64/src/main/resources/public/*.md~
rm -f $META64/*.md~

read -p "All done."

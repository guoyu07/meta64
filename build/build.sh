#!/bin/bash
source ./setenv.sh

#
# Trouble with Tidy? Check for "- -" where "--" was needed.
#
# Nodejs is required for the build for typescript compiler
# https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions
#

export timestamp=`eval date +%Y-%m-%d-%s`
export backupFolder=$META64_BAK

#Delete old JS files and MAP files. We also have jsconfig.json set to not emit on error
#find $META64/src/main/resources/public/js/meta64 -name "*.js" -type f -delete
#find $META64/src/main/resources/public/js/meta64 -name "*.map" -type f -delete

rm $META64/src/main/resources/public/js/meta64-app.js
rm $META64/src/main/resources/public/js/meta64-app.min.js
echo "Old JS files deleted."

# To install typescript compiler (tsc) run these commands:
#    curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
#    sudo apt-get install -y nodejs
#    sudo apt-get install -y build-essential
#    npm install -g typescript

cd $META64/src/main/resources/public/ts
tsc
if [ $? -eq 0 ]
then
  read -p "TypeScript generating successful."
else
  read -p "FAIL. TypeScript compiler reported ERRORS."
fi

cd $META64/build

#copy the readme.md from project root to published location (landing-page.md) where the app will
#be able to pick it up at runtime. The reason I don't just keep these two files in the 'static' folder
#only and always, is because GitHub looks in the root for readme.md at least
cp $META64/readme.md $META64/src/main/resources/public/doc/landing-page.md

#go back to folder with this script in it. sort of 'home' for this script
cd $META64/build

java -jar google-compiler.jar --js_output_file="../src/main/resources/public/js/meta64-app.min.js" ../src/main/resources/public/js/meta64-app.js

#java -jar google-compiler.jar --help
read -p "Google compiler done."


cd $META64

mvn dependency:sources
mvn dependency:resolve -Dclassifier=javadoc
mvn clean package -DskipTests=true

rm -f $META64/build/all.js
rm -f $META64/build/*.sh~
rm -f $META64/src/main/resources/public/js/meta64.min.js
rm -f $META64/src/main/resources/public/elements/main-tabs/main-tabs-out.html
rm -f $META64/src/main/resources/public/elements/main-tabs/main-tabs-20*.html
rm -f $META64/src/main/resources/templates/index-out.html
rm -f $META64/src/main/resources/templates/index-20*.html
rm -f $META64/src/main/resources/public/*.md~
rm -f $META64/*.md~

read -p "All done."

#!/bin/bash
source ./setenv.sh

#
# Trouble with Tidy? Check for "- -" where "--" was needed.
#
# Nodejs is required for the build for typescript compiler and less compiler
# https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions
#

export timestamp=`eval date +%Y-%m-%d-%s`
export backupFolder=$META64_BAK
export NODE_PATH=$META64/build/node_modules

#Delete old JS files and MAP files. We also have jsconfig.json set to not emit on error
#find $META64/src/main/resources/public/js/meta64 -name "*.js" -type f -delete
#find $META64/src/main/resources/public/js/meta64 -name "*.map" -type f -delete
rm -f $META64/src/main/resources/public/js/*.js
rm -f $META64/src/main/resources/public/js/*.map
echo "Old JS files deleted."

# ===================================================================
# To install typescript compiler (tsc) run these commands:
#
# Note: TSC Version 1.8.10, is the version i ended up with first time doing this.
# (Once you already have NODE, installed and you perhaps want to just upgrade TSC version, you can 
# just run the 'nmp install' shown here, and not the lines above it.
#
# Warning: Whenever you do update 'typescript' using the 'nmp install' below, you probably want to 
# also go manually download and update the copy of 'system.js' you have in your source
# folder of meta64, because using versions of typescript and system.js that are incompatable will 
# cause failures that are extremely hard to diagnose.
#
#    curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
#    sudo apt-get install -y nodejs
#    sudo apt-get install -y build-essential
#    sudo npm install -g typescript
#    read -p "TypeScript install complete."
#
# Update: now that typescript 2.1 is out I did this to update to it:
#    sudo npm install -g typescript@latest
#    tsc -v
#    read -p "TypeScript updated?"
#
#    If version still reports wrong after install, delete all these and try again..
#    delete /usr/bin/tsc
#           /usr/local/bin/tsc
#           /usr/local/lib/node_modules/typescript
# 
# =====================================================================
cd $META64/src/main/resources/public/ts
tsc -p tsconfig-dev.json
if [ $? -eq 0 ]
then
  read -p "TypeScript generating successful. Press ENTER key."
else
  read -p "FAIL. TypeScript compiler reported ERRORS."
fi

# To install WEBPACK
# (I experimented with webpack, and decided not to use it for now. TypeScript is capable of making a bundled file 
#  and that bundling of my own code is all I need for now)
#  I'm leaving these webpack commands in here just for future reference:
#
#     sudo npm install -g webpack
#     npm install --save-dev typescript awesome-typescript-loader source-map-loader
#     read -p "WebPack install complete."
#
#   Note: in the above you DO need 'typescipt' in the command even if you already have it, because --save-dev is there.      
#
# NOTE: awesome-typescript-loader is not the only loader for typescript. You could instead use ts-loader.
#       see: https://github.com/s-panferov/awesome-typescript-loader#differences-between-ts-loader
#
# cd $META64/src/main/resources/public/ts
# webpack 
# read -p "WebPack bundle complete."

# To install Less CSS compiler run these commands:
#    sudo npm install -g less
cd $META64/src/main/resources/public/css
lessc meta64.less meta64.css
if [ $? -eq 0 ]
then
  read -p "LESS CSS generating successful. Press ENTER key."
else
  read -p "FAIL. LESS compiler reported ERRORS."
fi

cd $META64/build

#copy the readme.md from project root to published location (landing-page.md) where the app will
#be able to pick it up at runtime. The reason I don't just keep these two files in the 'static' folder
#only and always, is because GitHub looks in the root for readme.md at least
cp $META64/readme.md $META64/src/main/resources/public/doc/landing-page.md

#go back to folder with this script in it. sort of 'home' for this script
cd $META64/build

#This command is the normal build command for minification, but i'm currently deploying NON-Minified builds so I can debug 
java -jar google-compiler.jar --js_output_file="../src/main/resources/public/js/meta64-app.min.js" ../src/main/resources/public/js/meta64-app.js

# This command was run just once to minify the SystemJS after the following hack I made to the source:
# Inside the 'fetchFetch()' function I added this:
# if (systemJsCacheBuster) {
#	  url += systemJsCacheBuster;
#  }
# This checks for existence of global variable for cache busting and uses it if found
#
# java -jar google-compiler.jar --js_output_file="../src/main/resources/public/js/systemjs/system.min.js" ../src/main/resources/public/js/systemjs/system.src.js

#Run only this command and not the one above for non-minified deployment
#cp ../src/main/resources/public/js/meta64-app.js ../src/main/resources/public/js/meta64-app.min.js

#java -jar google-compiler.jar --help
#read -p "Google compiler done."

cd $META64

mvn dependency:sources
mvn dependency:resolve -Dclassifier=javadoc
mvn clean package -DskipTests=true

rm -f $META64/build/*.sh~
rm -f $META64/src/main/resources/public/*.md~
rm -f $META64/*.md~

read -p "All done."

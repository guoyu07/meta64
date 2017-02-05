#!/bin/bash
#NOTE: This file is called from the POM.XML file to make a build from inside Eclipse work.
source ./setenv.sh

rm -f $META64/src/main/resources/public/js/*.js
rm -f $META64/src/main/resources/public/js/*.map

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

echo "Old JS file deleted."

cd $META64/src/main/resources/public/ts
tsc
if [ $? -eq 0 ]
then
  echo "TypeScript generating successful."
else
  echo "********** FAIL. TypeScript compiler reported ERRORS. **********"
  sleep 7s
fi

#commented, because we don't do minification in development.
#cd $META64/build
#java -jar google-compiler.jar --js_output_file="../src/main/resources/public/js/meta64-app.min.js" ../src/main/resources/public/js/meta64-app.js


# abandoning webpack (too many problems. too finicky, lacks any sensible error reporting)
# cd $META64/src/main/resources/public/ts
# webpack 
# if [ $? -eq 0 ]
# then
#   echo "Webpack generating successful."
# else
#   echo "********** FAIL. Webpack compiler reported ERRORS. **********"
#   sleep 7s
# fi



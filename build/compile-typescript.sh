#!/bin/bash
source ./setenv.sh

rm $META64/src/main/resources/public/js/meta64-app.js
rm $META64/src/main/resources/public/js/meta64-app.min.js
echo "Old JS file deleted."

cd $META64/src/main/resources/public/ts
tsc
if [ $? -eq 0 ]
then
  echo "TypeScript generating successful."
else
  echo "********** FAIL. TypeScript compiler reported ERRORS. **********"
  sleep 5s
fi

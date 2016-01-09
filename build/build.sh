#!/bin/bash
./setenv.sh


#
# Trouble with Tidy: check for "- -" where "--" was needed.
#

export timestamp=`eval date +%Y-%m-%d-%s`
export backupFolder=/ferguson/meta64Oak-private/auto-bak

#todo this tidy stuff should be wrapped in a callable script for DRY.

./run-tidy.sh /ferguson/meta64Oak/src/main/resources/templates index
./run-tidy.sh /ferguson/meta64Oak/src/main/resources/public/elements/main-tabs main-tabs
./run-tidy.sh /ferguson/meta64Oak/src/main/resources/public/elements/donate-panel donate-panel

read -p "temp halt"

#cd /ferguson/meta64Oak/src/main/resources/templates
#cp index.html $backupFolder/index-$timestamp.html
#tidy -config /ferguson/meta64Oak/tidy-config.txt index.html > $backupFolder/index-out.html
#cp $backupFolder/index-out.html index.html
#read -p "Tidy done. index.htm."


#cd /ferguson/meta64Oak/src/main/resources/public/elements/main-tabs
#cp main-tabs.html $backupFolder/main-tabs-$timestamp.html
#tidy -config /ferguson/meta64Oak/tidy-config.txt main-tabs.html > $backupFolder/main-tabs-out.html
#cp $backupFolder/main-tabs-out.html main-tabs.html
#read -p "Tidy done. /elements/main-tabs"


#go back to folder with this script in it. sort of 'home' for this script
cd /ferguson/meta64Oak/build
java -jar google-compiler.jar --js_output_file="../src/main/resources/public/js/meta64.min.js" "../src/main/resources/public/js/meta64/**.js"
read -p "Google compiler done."

cd /ferguson/meta64Oak
ant -buildfile build.xml all

mvn dependency:sources
mvn dependency:resolve -Dclassifier=javadoc
mvn clean package -DskipTests=true

cp -v ./target/com.meta64.mobile-0.0.1-SNAPSHOT.jar /run-root/com.meta64.mobile-0.0.1-SNAPSHOT.jar

read -p "All done."



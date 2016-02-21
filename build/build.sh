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

#copy the readme.md from project root to published location (landing-page.md) where the app will 
#be able to pick it up at runtime.
cp /ferguson/meta64Oak/readme.md /ferguson/meta64Oak/src/main/resources/static/landing-page.md

#go back to folder with this script in it. sort of 'home' for this script
cd /ferguson/meta64Oak/build

cat ../src/main/resources/public/js/meta64/cnst.js > all.js
cat ../src/main/resources/public/js/meta64/util.js >> all.js
cat ../src/main/resources/public/js/meta64/jcrCnst.js >> all.js
cat ../src/main/resources/public/js/meta64/attachment.js >> all.js
cat ../src/main/resources/public/js/meta64/edit.js >> all.js
cat ../src/main/resources/public/js/meta64/meta64.js >> all.js
cat ../src/main/resources/public/js/meta64/nav.js >> all.js
cat ../src/main/resources/public/js/meta64/prefs.js >> all.js
cat ../src/main/resources/public/js/meta64/props.js >> all.js
cat ../src/main/resources/public/js/meta64/render.js >> all.js
cat ../src/main/resources/public/js/meta64/search.js >> all.js
cat ../src/main/resources/public/js/meta64/share.js >> all.js
cat ../src/main/resources/public/js/meta64/user.js >> all.js
cat ../src/main/resources/public/js/meta64/view.js >> all.js
cat ../src/main/resources/public/js/meta64/pg/Dialog.js >> all.js
cat ../src/main/resources/public/js/meta64/pg/menuPanel.js >> all.js
cat ../src/main/resources/public/js/meta64/pg/ConfirmDlg.js >> all.js
cat ../src/main/resources/public/js/meta64/pg/DonateDlg.js >> all.js
cat ../src/main/resources/public/js/meta64/pg/MessageDlg.js >> all.js
cat ../src/main/resources/public/js/meta64/pg/searchResultsPg.js >> all.js
cat ../src/main/resources/public/js/meta64/pg/LoginDlg.js >> all.js
cat ../src/main/resources/public/js/meta64/pg/SignupDlg.js >> all.js
cat ../src/main/resources/public/js/meta64/pg/PrefsDlg.js >> all.js
cat ../src/main/resources/public/js/meta64/pg/ExportDlg.js >> all.js
cat ../src/main/resources/public/js/meta64/pg/importPg.js >> all.js
cat ../src/main/resources/public/js/meta64/pg/SearchDlg.js >> all.js
cat ../src/main/resources/public/js/meta64/pg/ChangePasswordDlg.js >> all.js
cat ../src/main/resources/public/js/meta64/pg/UploadDlg.js >> all.js
cat ../src/main/resources/public/js/meta64/pg/EditNodeDlg.js >> all.js
cat ../src/main/resources/public/js/meta64/pg/EditPropertyDlg.js >> all.js
cat ../src/main/resources/public/js/meta64/pg/ShareToPersonDlg.js >> all.js
cat ../src/main/resources/public/js/meta64/pg/SharingDlg.js >> all.js
cat ../src/main/resources/public/js/meta64/pg/RenameNodeDlg.js >> all.js
cat ../src/main/resources/public/js/meta64/pg/timelinePg.js


#java -jar google-compiler.jar --js_output_file="../src/main/resources/public/js/meta64.min.js" "../src/main/resources/public/js/meta64/**.js"
java -jar google-compiler.jar --js_output_file="../src/main/resources/public/js/meta64.min.js" all.js
 
#java -jar google-compiler.jar --help
read -p "Google compiler done."

cd /ferguson/meta64Oak
ant -buildfile build.xml all

mvn dependency:sources
mvn dependency:resolve -Dclassifier=javadoc
mvn clean package -DskipTests=true

cp -v ./target/com.meta64.mobile-0.0.1-SNAPSHOT.jar /run-root/com.meta64.mobile-0.0.1-SNAPSHOT.jar

read -p "All done."



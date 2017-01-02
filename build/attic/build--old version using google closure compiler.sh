#!/bin/bash
source ./setenv.sh

#
# Trouble with Tidy? Check for "- -" where "--" was needed.
#

export timestamp=`eval date +%Y-%m-%d-%s`
export backupFolder=$META64_BAK

#Delete old JS files and MAP files. We also have jsconfig.json set to not emit on error
find $META64/src/main/resources/public/js/meta64 -name "*.js" -type f -delete
find $META64/src/main/resources/public/js/meta64 -name "*.map" -type f -delete
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
./run-tidy.sh $META64/src/main/resources/templates index
./run-tidy.sh $META64/src/main/resources/public/elements/main-tabs main-tabs

#copy the readme.md from project root to published location (landing-page.md) where the app will
#be able to pick it up at runtime. The reason I don't just keep these two files in the 'static' folder
#only and always, is because GitHub looks in the root for readme.md at least
cp $META64/readme.md $META64/src/main/resources/public/doc/landing-page.md

#go back to folder with this script in it. sort of 'home' for this script
cd $META64/build

# Next step in updating build process to TypeScript will be to list these files in an ordering file
# and include it first, and use the reference directive to order the files below and also generate a single
# output file with them in which case the google-compiler (Closure) wil no longer be needed.
# http://www.typescriptlang.org/docs/handbook/triple-slash-directives.html
# Update: Investigate using 'webpack' for this. Single file approach.
cat ../src/main/resources/public/js/meta64/cnst.js > all.js
cat ../src/main/resources/public/js/meta64/models.js >> all.js
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
cat ../src/main/resources/public/js/meta64/menu.js >> all.js
cat ../src/main/resources/public/js/meta64/dlg/base/DialogBase.js >> all.js
cat ../src/main/resources/public/js/meta64/dlg/ConfirmDlg.js >> all.js
cat ../src/main/resources/public/js/meta64/dlg/ProgressDlg.js >> all.js
cat ../src/main/resources/public/js/meta64/dlg/MessageDlg.js >> all.js
cat ../src/main/resources/public/js/meta64/dlg/LoginDlg.js >> all.js
cat ../src/main/resources/public/js/meta64/dlg/SignupDlg.js >> all.js
cat ../src/main/resources/public/js/meta64/dlg/PrefsDlg.js >> all.js
cat ../src/main/resources/public/js/meta64/dlg/ManageAccountDlg.js >> all.js
cat ../src/main/resources/public/js/meta64/dlg/ExportDlg.js >> all.js
cat ../src/main/resources/public/js/meta64/dlg/ImportDlg.js >> all.js
cat ../src/main/resources/public/js/meta64/dlg/SearchContentDlg.js >> all.js
cat ../src/main/resources/public/js/meta64/dlg/SearchTagsDlg.js >> all.js
cat ../src/main/resources/public/js/meta64/dlg/ChangePasswordDlg.js >> all.js
cat ../src/main/resources/public/js/meta64/dlg/ResetPasswordDlg.js >> all.js
cat ../src/main/resources/public/js/meta64/dlg/UploadFromFileDlg.js >> all.js
cat ../src/main/resources/public/js/meta64/dlg/UploadFromUrlDlg.js >> all.js
cat ../src/main/resources/public/js/meta64/dlg/EditNodeDlg.js >> all.js
cat ../src/main/resources/public/js/meta64/dlg/EditPropertyDlg.js >> all.js
cat ../src/main/resources/public/js/meta64/dlg/ShareToPersonDlg.js >> all.js
cat ../src/main/resources/public/js/meta64/dlg/SharingDlg.js >> all.js
cat ../src/main/resources/public/js/meta64/dlg/RenameNodeDlg.js >> all.js
cat ../src/main/resources/public/js/meta64/panel/searchResultsPanel.js >> all.js
cat ../src/main/resources/public/js/meta64/panel/timelineResultsPanel.js  >> all.js

java -jar google-compiler.jar --js_output_file="../src/main/resources/public/js/meta64.min.js" all.js

#java -jar google-compiler.jar --help
read -p "Google compiler done."

cd $META64

mvn dependency:sources
mvn dependency:resolve -Dclassifier=javadoc
mvn clean package -DskipTests=true

cp -v ./target/com.meta64.mobile-0.0.1-SNAPSHOT.jar $META64_RUN/com.meta64.mobile-0.0.1-SNAPSHOT.jar

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

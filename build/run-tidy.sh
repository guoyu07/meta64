#!/bin/bash

#Runs tidy on one file. Backs up the current version of the file before running tidy
#in case something goes wrong, so it will be easy to revert back to prior copies of the file

#put command line parameters to this batch file, in more friendly-named variables
tidyPath=$1
tidyFileBase=$2

#change to path
cd $tidyPath

#make backup copy (timestamp-based) of the file we are about to overwrite
cp $tidyFileBase.html $backupFolder/$tidyFileBase-$timestamp.html

#run tidy on the file, targeting the same file but with "-out" suffix on its name
tidy -config $META64/tidy-config.txt $tidyFileBase.html > $backupFolder/$tidyFileBase-out.html

#now copy the output file into the actual file (overwriting original file, which is backed up)
#todo: I really need to check the return code from the 'tidy' command and check for sucess or fail.
cp $backupFolder/$tidyFileBase-out.html $tidyFileBase.html

#Make user press enter before continuing
read -p "Tidy processed $tidyFileBase.htm. Press ENTER."

#!/bin/bash
./setenv.sh

cd /home/clay/ferguson/meta64Oak/src/main/resources/public

sudo bower update --allow-root

#Now blow away the 'demo' and 'test' subfolders from every subfolder bower retrieves.
#The brilliant geniuses in charge of bower design stupidly decided there should be no way for bower to ignore the 'demo' and 'test' folders 
#so we just use a shell command to blow them away.
sudo find -type d -name demo -exec rm -rf {} \;
sudo find -type d -name test -exec rm -rf {} \;

read -p "All done."



#!/bin/bash
source ./setenv.sh
cd /home/clay/ferguson/meta64Oak/src/main/resources/public/ts

# sudo npm install -g typescript@latest

# IMPORTANT INFO!!!
# https://github.com/typings/typings/issues/766
# http://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html

# Creates @types folder that the latest TypeScript can use, and as for pulling in the
# dependencies at runtime, we just have the /js/react folder with two files in there that I 
# manually downloaded, and which are referenced by SystemJS individually by filename
# from entry-point.js 
sudo npm install --save @types/react @types/react-dom

read -p "All done."

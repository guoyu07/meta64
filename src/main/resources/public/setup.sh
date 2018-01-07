#!/bin/bash

# NOTE: This is just a file that i use to record what scripts i've run mainly for setting up
# NPM stuff, or parts of my build process that I only need to run once (i.e. not part of a build)

# Install NodeJS
# --------------
# https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions

# sudo apt-get update && sudo apt-get install curl
# curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
# sudo apt-get install -y nodejs
# sudo apt-get install -y build-essential
# node -v

# Install NPM (always run this update EVEN if you just freshly installed NodeJS)
# sudo chown -R $USER:$(id -gn $USER) /home/clay/.config
# sudo npm install npm@latest -g
# npm -v

# Next create folders:
# mkdir src
# cd src
# mkdir components
# cd ..

# Turn this folder into npm package
# sudo npm init

# sudo npm install -g less

# Ensure Webpack is installed globally
# sudo npm install -g webpack

# Install React:
# sudo npm install --save react react-dom @types/react @types/react-dom
# sudo npm install --save react-router @types/react-router

# sudo npm install --save axios
# sudo npm install --save popper.js 
# sudo npm install --save marked @types/marked
# sudo npm install --save @types/jquery

# Utilities install
# sudo npm install --save-dev typescript awesome-typescript-loader source-map-loader
# sudo npm install --save-dev script-loader
# sudo npm install circular-dependency-plugin
# sudo npm install webpack-shell-plugin
# sudo npm install webpack
# sudo npm install --save-dev html-webpack-plugin
# sudo npm install --save-dev html-loader

# sudo apt install git
# git config --global user.email "wclayf@gmail.com"
# git config --global user.name "Clay Ferguson"
# sudo npm install -g typescript

# https://github.com/webpack/webpack-dev-server
# after installing this just run 'webpack-dev-server' as a terminal command to start. Goes to port 8080
# sudo npm install -g webpack-dev-server

##NOTE: I think where i ended up with this is, is that it somehow requires me to run webpack and THEN webpack-dev-server BOTH 
# in order to deploy new changed files, and I never yet tried to figure out why that is the case. I think it has to do with me still
# hitting the SERVER (web app) that is serving up the HTML and the webpack-dev-server isn't which will require some rethink because
# that would be technically a CORS (which should work) when i run browser served from VSCode dev server, and let it hit the server
# running on a separate port?



read -p "All done."


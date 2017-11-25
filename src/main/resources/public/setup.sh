#!/bin/bash

# NOTE: This is just a file that i use to record what scripts i've run mainly for setting up
# NPM stuff, or parts of my build process that I only need to run once (i.e. not part of a build)

# Install NodeJS
# --------------
# https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions
# curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
# sudo apt-get install -y nodejs
# sudo apt-get install -y build-essential
# node -v

# Install NPM (always run this update EVEN if you just freshly installed NodeJS)
# sudo npm install npm@latest -g
# npm -v

# Next create folders:
# mkdir src
# cd src
# mkdir components
# cd ..

# Turn this folder into npm package
# sudo npm init

# Ensure Webpack is installed globally
# sudo npm install -g webpack

# Install React:
# sudo npm install --save react react-dom @types/react @types/react-dom

# Utilities install
# sudo npm install --save-dev typescript awesome-typescript-loader source-map-loader

# sudo npm install circular-dependency-plugin

# sudo npm install webpack-shell-plugin

# sudo npm install --save @types/polymer

read -p "All done."


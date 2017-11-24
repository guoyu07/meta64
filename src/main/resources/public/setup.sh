#!/bin/bash

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

sudo npm install webpack-shell-plugin

read -p "All done."


# About these BUILD files (in this folder)

The basic thing to know is this is a SpringBoot app, built with Maven, and using Webpack to generate a bundle JS file for execution in browser.

## build.sh

The build.sh script builds a PROD release, which ends up in the "/target" folder as the single uber JAR that is a SpringBoot runtime, with tomcat embedded.

## run-pom-exec.sh

Called by the POM.XML file as part of the Maven build, and this is where Webpack is run.

## bower-update.sh, react-setup.sh, edit-bower-json

These are all just some assorted scripts i ran to set things up. You don't need to run these if you
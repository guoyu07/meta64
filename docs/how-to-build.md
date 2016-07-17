# Production Build

The main builder is in ./build/build.sh. Be sure to edit setenv.sh file to contain the appropriate settings for your system.

# TypeScript

In general no JavaScript is written by hand, because the app uses TypeScript. The 'tsc' command you see in the build file is what compiles all the TypeScript, and there are notes inside the 'build.sh' file about how to install tsc.

# Eclipse Building

The way I build the app during development is by having a maven build configuation that runs this:

goal-> exec:exec package -DskipTests=true

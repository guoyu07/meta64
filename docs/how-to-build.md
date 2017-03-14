# Production Build

The main builder is in ./build/build.sh. Be sure to edit setenv.sh file to contain the appropriate settings for your system.


# Eclipse Building

The way I build the app during development is by having a maven build configuation that runs this:

goal-> exec:exec package -DskipTests=true

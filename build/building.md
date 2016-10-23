# Batch File Notes

#Note from the Meta64 developer:

I have included this little set of shell scripts mainly just to make it more clear exactly how I build the meta64 app. This is just standard maven stuff, but it may be helpful to see exactly how I'm calling Tidy, Bower, Typescript compiler, etc.

The uber jar that we generate does contain all the JS files individually, but they are not requested at runtime, if the spring profile in use is "PROD". Also, of course it's obvious but you will need to edit **setenv.sh** and make it match the locations and versions of Java and Maven installations on your own machine before you can actually run.

*Note also that the build batch file expects to see a 'run-root' folder at the level of your project root, which is where I put the uber jar for running outside the IDE.

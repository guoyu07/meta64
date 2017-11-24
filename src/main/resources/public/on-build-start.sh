#!/bin/bash

# Our pattern of how we manage Singletons in TypeScript requires us to use "d.ts" files from our own
# code, and unfortunately when you specify the  "declaration" and "declarationDir" options in the tsconfig.json
# file it works fine EXCEPT for it ignores (refuses to) creating "d.ts" files for 'interfaces' probably because
# interfaces are a 'compile-time' construct, but this breaks the internal consistency inside my './ts/types'
# folder structure when ALL the Interfaces are MISSING in there. So...this script file is solely for 
# the purpose of forcing all our interfaces to exist in './ts/types' folder since TSC refuses to.
#
# Note:
# If you want to see what the above statement means simply remove all the *Impl.ts files from anywhere under
# './ts/types' and then try a webpack build without this batch file enabled and you'll see the problem.
# 
echo "Running on-build-start.sh"

#at the moment we aren't doing anything in here, after all, but i will leave this hook (script) in place,
#in the build, in case i need it in the future.

#cp -rv ./ts/*Intf.ts ./ts/types/

#none in here yet -> ...
#cp -rv ./ts/plugins/*Intf.ts ./ts/types/plugins/
#cp -rv ./ts/widget/*Intf.ts ./ts/types/widget/
#cp -rv ./ts/widget/base/*Intf.ts ./ts/types/widget/base/

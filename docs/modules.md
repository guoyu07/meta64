JavaScript Modules (bundled v.s. separate files)

Code changes (edits) required to switch back and forth between single-file (bundled) deployment v.s. multiple individual deployment files:

------------------------------------------------------------
BUNDED Setup (single file deploy):

- bundled file will be /js/meta64-app.js, and that will be the ONLY js file that should be in the '/js/' folder. All moduels in this file. If minified then it will be named meta64-app.min.js
		
- index.html will have 'var bundled=true;' variable set in the javascript. 

- as the tsconfig.json file will be using tsconfig-bundled.json, by copying it over.
(the operative entry being that outFile is specified rather than ourDir)

- in the build.sh file, uncomment (enable) the call to google-compiler.jar to create the minified js from the js (meta64-app.js -> meta64-app.min.js)

------------------------------------------------------------
NON-BUNDLED (single file deploy):

- /js/ folder will contain each module as a separate JS file, each one being individually requested from the Browser. Standard type AMD pattern.
		
- index.html will have 'var bundled=false;' variable set in the javascript. 

- as the tsconfig.json file will be using tsconfig-nonbundled.json, by copying it over.
(the operative entry being that outDir is specified rather than ourFile)

- in the build.sh file, comment out (disable) the call to google-compiler.jar

- check in Factory.ts, and see if you need to add back in the '/js/' part of the path or not. Last time I had non-bundled mode running i DID have the /js/ path in there.

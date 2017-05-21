# Production Build

The main builder is in ./build/build.sh. Be sure to edit setenv.sh file to contain the appropriate settings for your system.


# Eclipse Building

The way I build the app during development, inside Eclipse, is by having a maven build configuration that runs this:

goal-> exec:exec clean package -DskipTests=true


# How to run in Eclipse

It is assumed you will already know how to run java apps in eclipse, and so here is the specific setup you need in your Eclipse Run Configuration. After running the build step mentioned above, the way I start the app is by creating an Eclipse Run Confg having this:

Main Class:
	com.meta64.mobile.AppServer

Program Arguments:
  --profileName=dev
  --logging.level.com.meta64.mobile=TRACE
  --enableRssDaemon=false
  --db.store.type=mongo
  --mongodb.host=127.0.0.1
  --mongodb.name=XXXXXX
  --mongodb.port=XXXXX
  --server.port=8181
  --metaHost=meta64-dev.com
  --solr.search.host=http://localhost:8983/solr/gettingstarted
  --allowFileSystemSearch=true
  --adminDataFolder=/home/clay/ferguson/jcr-admin
  --lucene.index.dir=/home/clay/ferguson/lucene-index
  --multipart.maxFileSize = 100Mb
  --multipart.maxRequestSize = 400Mb
  --jsBaseFolder=file:///home/clay/ferguson/meta64Oak/src/main/resources/public/js/
  --jcrAdminPassword=xxxxxxxxxxx
  --spring.config.location=classpath:/application.properties
  --mail.user=xxxxxx
  --mail.password=xxxxxxxxx
  --mail.host=xxxxx
  --aeskey=xxxxxxxx
  --testUserAccounts=adam:xxxxx:me@gmail.com,bob:xxxxx:me@gmail.com,cory:xxxxx:me@gmail.com
  -RUNNING_IN_ECLIPSE
  
  Note: The above prog args is assuming you're using MongoDB as your storage, but there is another way using RDBMS, and so to config to use an RDB you do the following,
  in addition to what is showing above. 
  
  (This is the settings to run embedded Derby, which is the simplest way, but better databases could be used (Oracle, MySQL)
  
  --db.store.type="rdb"
  --rdb.driver=org.apache.derby.jdbc.EmbeddedDriver
  --rdb.url=jdbc:derby:{user.dir}/derby-db;create=true
  --rdb.shutdown=jdbc:derby:{user.dir}/derby-db;shutdown=true
  --rdb.user=admin
  --rdb.password=xxxx  
  

# Shutdown during Eclipse Debugging

The RUNNING_IN_ECLIPSE flag above has a special usage to gracefully terminate the app and the MongoDB connection when terminating running from inside eclipse. What you should to, rather than just clicking the "stop button" in eclipse, is go to the console window, and click on it to focus it and then type the letter 'q' followed by enter. This initiates a termination that can be properly processed by eclipse to tell the app to shutdown. Any more abrupt shutdown than will be 'ungraceful' and tantamount to a hard kill of the task, which is less safe.

# How to modify TypeScript files WHILE the server is running/debugging in Eclipse.

In order to keep from having to wait for a full build every time I want to test out some editing I did to one or more TypeScript files, i created the shell script named
.../build/run-eclipse-pom-exec.sh, and then I created an Eclipse "External Tools Configuration" to run that, and it will rebuild the non-Java source. Part of what it takes to make this work is that you have to set the jsBaseFolder (see above), and the server itself (SubNode) is smart enough to reload the JS file from there when you refresh the browser rather than reading the one from the JAR file. Don't forget to refresh you eclipse workspace after running, because the VM will be using the eclipse cached version of the files.







# How to run in Eclipse

It is assumed you will already know how to run java apps in eclipse, and so here is the specific setup you need in your Eclipse Run Configuration:

Main Class:
com.meta64.mobile.AppServer

Program Arguments:
--jcrAdminPassword=xxxxxxxx 
--spring.config.location=classpath:/application.properties,classpath:/application-dev.properties 
--mail.user=noreply@someserver.com 
--mail.password=xxxxxxxx 
--mail.xxxhost=smtpout.someserver.net 
--aeskey=xxxxxxxx
--spring.social.twitter.app-id=xxxxxxxx
--spring.social.twitter.app-secret=xxxxxxxx
-RUNNING_IN_ECLIPSE

# Shutdown during Debugging

The RUNNING_IN_ECLIPSE flag above has a special usage to gracefully terminate the app and the MongoDB connection when terminating running from inside eclipse. What you should to, rather than just clicking the "stop button" in eclipse, is go to the console window, and click on it to focus it and then type the letter 'q' followed by enter. This initiates a termination that can be properly processed by eclipse to tell the app to shutdown. Any more abrupt shutdown than will be 'ungraceful' and tantamount to a hard kill of the task, which is less safe.
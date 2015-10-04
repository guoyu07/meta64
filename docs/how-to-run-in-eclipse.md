
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
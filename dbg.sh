#!/bin/bash
cd /home/clay/ferguson/meta64Oak
/usr/bin/mvn spring-boot:run \
    -Drun.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=8000" \
    -Drun.arguments="--spring.config.location=file:/home/clay/ferguson/meta64Oak-private/vscode-debugging/dev.properties,classpath:/application.properties"

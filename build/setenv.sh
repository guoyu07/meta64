#!/bin/bash

export MAVEN_TERMINATE_CMD=
export MAVEN_BATCH_ECHO=on
#export M2_HOME=/usr/bin/mvn
#export M2=$M2_HOME/bin
#export PATH=$M2:$PATH

export ANT_HOME=/usr/bin/ant
export JAVA_HOME=/usr/lib/jvm/java-8-oracle
export PATH=$PATH:$JAVA_HOME/bin

#directory to copy output of build into
export META64_RUN=/home/clay/ferguson/run-root

#directory that contains the project (pom.xml is here, for example)
export META64=/home/clay/ferguson/meta64Oak

#temporary backup location
export META64_BAK=/home/clay/auto-bak


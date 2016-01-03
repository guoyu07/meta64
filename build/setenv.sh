#!/bin/bash

export MAVEN_TERMINATE_CMD=
export MAVEN_BATCH_ECHO=on
export M2_HOME=/usr/bin/mvn
export M2=$M2_HOME/bin

export ANT_HOME=/usr/bin/ant

export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
export PATH=$PATH:$JAVA_HOME/bin

export PATH=$M2:$PATH

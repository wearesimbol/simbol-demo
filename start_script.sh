#!/bin/sh

# EXTERNAL_IP="$(curl -10 http://icanhazip.com 2>/dev/null)" \
#   INTERNAL_IP="$(ip a | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1')" \
#   node /app/config/set-vars.js
# cp /app/config/turnserver.conf /etc/
# cat /etc/turnserver.conf

# Start the first process
turnserver -o
status=$?
if [ $status -ne 0 ]; then
  echo "Failed to start turnserver: $status"
  exit $status
fi

# Start the second process
/app/simbol-demo/target/release/simbol-demo > simbol-demo.log 2>&1 &
status=$?
if [ $status -ne 0 ]; then
  echo "Failed to start simbol-demo: $status"
  exit $status
fi

# Naive check runs checks once a minute to see if either of the processes exited.
# This illustrates part of the heavy lifting you need to do if you want to run
# more than one service in a container. The container exits with an error
# if it detects that either of the processes has exited.
# Otherwise it loops forever, waking up every 60 seconds

while sleep 60; do
  ps aux |grep turnserver |grep -q -v grep
  PROCESS_1_STATUS=$?
  ps aux |grep simbol-demo |grep -q -v grep
  PROCESS_2_STATUS=$?
  # If the greps above find anything, they exit with 0 status
  # If they are not both 0, then something is wrong
  if [ $PROCESS_1_STATUS -ne 0 -o $PROCESS_2_STATUS -ne 0 ]; then
    echo "One of the processes has already exited."
    exit 1
  fi
done
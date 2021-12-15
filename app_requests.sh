#!/bin/bash

while read line
do
   sleep 3
   curl "http://localhost:3030/unique-addresses"
   curl "http://localhost:3030/addresses-receive"
   curl "http://localhost:3030/addresses-sent"
done < ./app/DailyActiveEthAddress.csv

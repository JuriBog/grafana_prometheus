#!/bin/bash

while read line
do
   curl "http://localhost:3030"
done < DailyActiveEthAddress.csv

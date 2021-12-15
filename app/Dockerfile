FROM node:17.1.0

WORKDIR /app

COPY app.js /app/app.js
COPY package.json /app/package.json
COPY DailyActiveEthAddress.csv /app/DailyActiveEthAddress.csv

RUN npm install 

ENTRYPOINT [ "node", "app.js" ]
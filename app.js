const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');
const client = require('prom-client')
const app = express();

app.listen(3030)



let totalUniqueAddresses = []

fs.createReadStream('DailyActiveEthAddress.csv')
    .pipe(csv())
    .on('data', row => {
        totalUniqueAddresses.push(row['Unique Address Total Count'])
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
        console.log(totalUniqueAddresses.length)
      });



let uniqueAddressTotalCount = new client.Counter({
    name: 'num_of_unique_addresses',
    help: 'Number of unique addresses',
    labelNames: ['uniqueAddress']
});

let addressReceiveCount = new client.Counter({
    name: 'addressReceive',
    help: 'Number of address receive',
    labelNames: ['addressReceive']
});

let uniqueAddressSentCount = new client.Counter({
    name: 'numOfUniqueAddressSent',
    help: 'Number of unique addresses sent',
    labelNames: ['addressSent']
});


let index = 0;
let lastValue = 0;
app.get('/',  (req, res) => {
    if(index <= totalUniqueAddresses.length-1){
        uniqueAddressTotalCount.inc(Number(totalUniqueAddresses[index]));
        index++;
        lastValue = totalUniqueAddresses[index]
        res.send(totalUniqueAddresses[index]+', ');
    }
    else{
        uniqueAddressTotalCount.inc(Number(lastValue + 10))
        res.send(lastValue + 10)
    }
    
})


app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
})






const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');
const client = require('prom-client')
const app = express();

app.listen(3030)

let uniqueAddr = []
let uniqueAddrReceive = []
let uniqueAddrSent = []

//read CSV file and populate the arrays accordingly to the headers of the columns.
fs.createReadStream('DailyActiveEthAddress.csv')
    .pipe(csv())
    .on('data', row => {
        uniqueAddr.push(row['Unique Address Total Count'])
        uniqueAddrReceive.push(row['Unique Address Receive Count'])
        uniqueAddrSent.push(row['Unique Address Sent Count'])
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
      });


//Prometheus metric Counter for total amount of unique addresses
let addrTotalCounter = new client.Counter({
    name: 'num_of_unique_addresses',
    help: 'Number of unique addresses',
    labelNames: ['unique_addresses']
});

//Counter for receiving addresses 
let addrReceiveCounter = new client.Counter({
    name: 'num_of_unique_addresses_receive',
    help: 'Number of unique addresses receive',
    labelNames: ['addresses_receive']
});

//Counter for sent to addresses
let addrSentCounter = new client.Counter({
    name: 'num_of_unique_addresses_sent',
    help: 'Number of unique addresses sent',
    labelNames: ['addresses_sent']
});


//Endpoint for unique addresses.Counter is incremented by the values from the CSV file after each request.
let addrIndex = 0;
let lastAddr = 0
app.get('/unique-addresses',  (req, res) => {
    if(addrIndex <= uniqueAddr.length-1){
        addrTotalCounter.inc(Number(uniqueAddr[addrIndex]));
        lastAddr = uniqueAddr[addrIndex]
        addrIndex++;        
        res.send(uniqueAddr[addrIndex]+', ');
    }
    //artficially rising the number of addresses after the end of total addresses from CSV file is reached
    else{
        addrTotalCounter.inc(Number(lastAddr + 10))
        lastAddr += 10
        res.send(lastAddr)
    }
    
})

//Incrementation of receiving addresses
let addrReceiveIndex = 0;
let lastAddrReceive = 0;
app.get('/addresses-receive',  (req, res) => {
    if(addrReceiveIndex <= uniqueAddr.length-1){
        addrReceiveCounter.inc(Number(uniqueAddrReceive[addrReceiveIndex]));
        lastAddrReceive = uniqueAddrReceive[addrReceiveIndex]  
        addrReceiveIndex++;         
        res.send(uniqueAddrReceive[addrReceiveIndex]+', ')
    }
    else{
        //artficially rising the number of addresses after the end of total addresses from CSV file is reached
        addrReceiveCounter.inc(Number(lastAddrReceive + 10))
        res.send(lastAddrReceive + 10)
    }
    
})

//Incrementation of sent to addresses
let addrSentIndex = 0;
let lastAddrSent= 0;
app.get('/addresses-sent',  (req, res) => {
    if(addrSentIndex <= uniqueAddr.length-1){
        addrSentCounter.inc(Number(uniqueAddrSent[addrSentIndex]));
        lastAddrSent = uniqueAddrSent[addrSentIndex]
        addrSentIndex++;       
        res.send(uniqueAddrSent[addrSentIndex]+', ');
    }
    else{
        //artficially rising the number of addresses after the end of total addresses from CSV file is reached
        addrSentCounter.inc(Number(lastAddrSent+ 10))
        res.send(lastValue + 10)
    }
    
})


//register prometheus
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
})






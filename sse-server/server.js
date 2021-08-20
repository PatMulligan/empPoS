//https://www.digitalocean.com/community/tutorials/nodejs-server-sent-events-build-realtime-app
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/status', (request, response) => response.json({clients: clients.length}));

const PORT = 3000;

let clients = [];
let invoices = [];

app.listen(PORT, () => {
  console.log(`Invoices Events service listening at http://localhost:${PORT}`)
})

// ...

function eventsHandler(request, response, next) {
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  response.writeHead(200, headers);

  const data = `data: ${JSON.stringify(invoices)}\n\n`;

  response.write(data);

  const clientId = Date.now();

  const newClient = {
    id: clientId,
    response
  };

  clients.push(newClient);

  request.on('close', () => {
    console.log(`${clientId} Connection closed`);
    clients = clients.filter(client => client.id !== clientId);
  });
}

app.get('/events', eventsHandler);

// ...

function sendEventsToAll(newInvoice) {
  clients.forEach(client => client.response.write(`data: ${JSON.stringify(newInvoice)}\n\n`))
}



var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

function getInvoice(invoiceId) {
    // TODO change url to local address on RPi
    var url = `https://btcpay.atitlan.io/api/v1/stores/AE5cyxSv4zBMadQVRVNJNjAdwYrjDozNFQm95gBE7EXJ/invoices/${invoiceId}`;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "token a93365e0652a556e6334b1de247655ae3ea9dd5f");
    
    let username = "patjmulligan@protonmail.com"
    let password = "uhq1GDB-exh1hbt-whu"
    xhr.setRequestHeader("username", username)
    xhr.setRequestHeader("password", password)

    return new Promise( function(resolve, reject) {
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
              if (xhr.status == 200) {
                console.log(xhr.status);
                console.log(xhr.responseText) 
                resolve(JSON.parse(xhr.responseText))
              }
              else {reject(xhr.status)}
            }}


    xhr.send()


    })
}

async function addInvoice(request, response, next) {
  console.log("meow", request.body)
  getInvoice(request.body.invoiceId)
    .then( (newInvoice) => {
      console.log(request.body.timestamp)
      newInvoice['time'] = request.body.timestamp
      invoices.push(newInvoice);
      response.json(newInvoice)
      return sendEventsToAll(newInvoice);
      })
    .catch((e) => console.log(e))
}

app.post('/invoicePaid', addInvoice);

// EXAMPLE POST
// {
//   afterExpiration: false,
//   deliveryId: 'FFPugSX5trrr2h1DgFDfro',
//   webhookId: 'TsibAR1suT8nE3GwpKAjMh',
//   originalDeliveryId: 'FFPugSX5trrr2h1DgFDfro',
//   isRedelivery: false,
//   type: 'InvoiceReceivedPayment',
//   timestamp: 1629384793,
//   storeId: 'AE5cyxSv4zBMadQVRVNJNjAdwYrjDozNFQm95gBE7EXJ',
//   invoiceId: 'FoABYVTS7DPpDoPbTwjZf3'
// }

// 200

// {"id":"FoABYVTS7DPpDoPbTwjZf3","storeId":"AE5cyxSv4zBMadQVRVNJNjAdwYrjDozNFQm95gBE7EXJ","amount":"12.0","checkoutLink":"https://btcpay.atitlan.io/i/FoABYVTS7DPpDoPbTwjZf3","status":"Settled","additionalStatus":"None","monitoringExpiration":1629471356,"expirationTime":1629384956,"createdTime":1629384776,"type":"Standard","currency":"GTQ","metadata":{"itemDesc":"Emporium Cafe and Bakery","physical":false},"checkout":{"speedPolicy":"MediumSpeed","paymentMethods":["BTC-LightningNetwork"],"expirationMinutes":3,"monitoringMinutes":1440,"paymentTolerance":0.0,"redirectURL":"https://btcpay.atitlan.io/apps/4R1zNJnzR6AGC7VhwJXFvJA4piSy/pos","redirectAutomatically":false,"defaultLanguage":null}}
//https://www.digitalocean.com/community/tutorials/nodejs-server-sent-events-build-realtime-app
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [ invoices, setInvoices ] = useState([]);
  const [ listening, setListening ] = useState(false);

  useEffect( () => {
    if (!listening) {
      const events = new EventSource('http://localhost:3000/events');

      events.onmessage = (event) => {
        console.log(event)
        const parsedData = JSON.parse(event.data);

        setInvoices((invoices) => invoices.concat(parsedData));
        };

      setListening(true);
      }
    }, [listening, invoices]);

  return (
    <body>
      <div id="outer">
      {
        invoices.slice().reverse().map((invoice, i) =>
          <div id="inner" class="card align-items-center" key={i}>
            <img src="https://btcpay.atitlan.io/LocalStorage/e2eaf488-8cc3-482e-ae27-b53a851d8203-green_check.png" alt="Avatar"></img>
            <div class="container">
              <h4><b>{invoice.id}</b></h4>
              <p>Paid: <strong>{invoice.amount} GTQ</strong></p>
              <p>{new Date(invoice.time).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</p>
            </div>
          </div>
        )
      }
      </div>
    </body>
  );
}

export default App;


// curl -X POST \
//  -H "Content-Type: application/json" \
//  -d '{"info": "Shark teeth are embedded in the gums rather than directly affixed to the jaw, and are constantly replaced throughout life.", "source": "https://en.wikipedia.org/wiki/Shark"}'\
//  -s http://localhost:3001/invoice


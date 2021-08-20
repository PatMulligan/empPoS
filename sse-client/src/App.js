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
    <table className="stats-table">
      <thead>
        <tr>
          <th>Invoice ID</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {
          invoices.reverse().map((invoice, i) =>
            <tr key={i}>
              <td>{invoice.id}</td>
              <td>{invoice.amount}</td>
            </tr>
          )
        }
      </tbody>
    </table>
  );
}

export default App;


// curl -X POST \
//  -H "Content-Type: application/json" \
//  -d '{"info": "Shark teeth are embedded in the gums rather than directly affixed to the jaw, and are constantly replaced throughout life.", "source": "https://en.wikipedia.org/wiki/Shark"}'\
//  -s http://localhost:3001/invoice


import express from 'express';
import bodyParser from 'body-parser';
import { insert } from './db.js'; // Ensure you have the insert function in your db.js
import fs from 'fs';

const app = express();
const port = process.env.PORT || 8000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Middleware to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint for processed transactions
app.post('/Eagle1', async (req, res) => {
    console.log('Raw Body:', req.body); // Log the raw request body

    const {pm_id,  PropertyCode,ResidentID,TDate,TAmount,PayLeaseTransactionID  } = req.body;

    const TransactionID  = PayLeaseTransactionID ; //pm_id;
    const fdate=TDate;
    
    const aux=Math.floor(Math.random() * (20 - 0 + 1)) + 0;
    console.log("eandom :",aux);

    const ResidentReferenceID=17750 +aux; //ResidentID;
    const Amt=TAmount;
    const PropertyReferenceID='f3f6cf42-a90';//PropertyCode;

     const processedTransaction = {
        pm_id,
        PropertyCode,
        ResidentID,
        TDate,
        TAmount,
        PayLeaseTransactionID
    };


    // Log the transaction details
    console.log('Processed Transaction:', processedTransaction);
    //const logMessage='Processed Transaction:'
    

    //console.log(logMessage);
  fs.appendFile('transactions.log', JSON.stringify(processedTransaction) + '\n', (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        }
    });
    


 

    const params = {fdate, TransactionID,ResidentReferenceID,Amt,PropertyReferenceID   };


    const columns = Object.keys(params).join(', ');
    const placeholders = Object.keys(params).map(() => '?').join(', ');
    const values = Object.values(params);

    const sql = `INSERT INTO MasterTransactionTable (${columns}) VALUES (${placeholders})`;

    try {
        const result = await insert(sql, values);
        console.log('Insert result:', result);
        // Convert BigInt values to regular numbers
        const response = {
            message: 'Insert successful',
            result: {
                affectedRows: result.affectedRows,
                insertId: Number(result.insertId),
                warningStatus: result.warningStatus
            }
        };
        res.json(response);
    } catch (err) {
        console.error('Insert error:', err); // Log the error
        res.status(500).send('Insert error');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

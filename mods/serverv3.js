import express from 'express';
import bodyParser from 'body-parser';
import { insert, query } from './db.js'; // Ensure you have the insert and executeQuery functions in your db.js


import fs from 'fs';

const app = express();
const port = process.env.PORT || 8001;

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
    
    //const aux=Math.floor(Math.random() * (20 - 0 + 1)) + 0;    console.log("eandom :",aux);

    const ResidentReferenceID=ResidentID ;//17750 +aux; //ResidentID;
    const Amt=TAmount;
    const PropertyReferenceID=PropertyCode;//'f3f6cf42-a90';//PropertyCode;
	const Zegopm_id=pm_id
    

     const processedTransaction = { 
        pm_id,
        PropertyCode,
        ResidentID,
        TDate,
        TAmount,
        PayLeaseTransactionID
    };




    // Log the transaction details
    console.log('Processed Transaction:', processedTransaction);    //const logMessage='Processed Transaction:'
    

    //console.log(logMessage);
      fs.appendFile('transactions.log', JSON.stringify(processedTransaction) + '\n', (err) => {
            if (err) {
                console.error('Error writing to file:', err);
            }
        });
        


 

    const params = {fdate, TransactionID,ResidentReferenceID,Amt,PropertyReferenceID,Zegopm_id   };


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



app.post('/Eagle2', async (req, res) => {
    const { TransactionID, reason } = req.body;
    const {pm_id,  PropertyCode,ResidentID,TDate,TAmount,PayLeaseTransactionID  } = req.body;
    console.log('Received body:', req.body);

    try {
        const response = await Eagle2(PayLeaseTransactionID); // Pass the entire request body
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function Eagle2(params) {
    const { TransactionID } = params;
    const sql = `UPDATE MasterTransactionTable SET Voided = 'YES' ,ProcessedonExcel ='' WHERE TransactionID = ?`;
    const values = params;//[TransactionID];
    console.log('Update SQL for voiding :', sql);
    console.log('Update values:', values);

    // Print all parameters to the console
    

    try {
        const result = await query(sql, values);
        console.log('Update result:', result);
        return {
            message: 'Update successful',
            result: {
                affectedRows: result.affectedRows,
                changedRows: result.changedRows,
                warningStatus: result.warningStatus
            }
        };
    } catch (error) {
        console.error('Error updating transaction:', error);
        throw error;
    }
}

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

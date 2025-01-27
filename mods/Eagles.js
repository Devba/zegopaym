import { query } from './db.js';

export async function Eagle2(params) {
    //const { PayLeaseTransactionID } = params;
    const sql = `UPDATE MasterTransactionTable SET Voided = 'YES', ProcessedonExcel = '' WHERE TransactionID = ?`;
    const values = params.TransactionID;

    console.log(['Update SQL for voiding:', sql]);
    console.log(['Update values:', values]);

    try {
        const result = await query(sql, values);
        console.log(['Update result:', result]);
        return {
            message: 'Voiding Update successful',
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
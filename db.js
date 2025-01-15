import mariadb from 'mariadb';

const pool = mariadb.createPool({
    host: '1mag1na.xyz', 
    user: 'alvaro', 
    password: 'alvar1t0', //ojo a alvaro'@'170-82-41-78.dynamic.biartel.es
    database: 'hoacontabo24',
    connectionLimit: 5,
     acquireTimeout: 20000 
    //ssl: {        rejectUnauthorized: false    }
});

export async function query(sql, params) {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(sql, params);
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

export async function insert(sql, params) {
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query(sql, params);
        return result;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

async function checkDatabaseStatus() {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log('Database connection successful');
    } catch (err) {
        console.error('Database connection failed:', err);
    } finally {
        if (conn) conn.end();
    }
}

// Run the database status check when the module is loaded
checkDatabaseStatus();

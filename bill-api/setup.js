import db from './db.js'


async function createBankTable() {
    const query = `
        CREATE TABLE IF NOT EXISTS banks (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL
        )
    `
    await runQuery(query, 'banks')
}

async function createUserTable () {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        auth0_id TEXT UNIQUE,
        f_name VARCHAR(100),
        l_name VARCHAR(100),
        username VARCHAR(100)
        )
    `
    await runQuery(query, 'users')
}

async function createBillTable () {
    const query = `
        CREATE TABLE IF NOT EXISTS bills (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        cost REAL NOT NULL,
        autopay BOOLEAN DEFAULT FALSE,
        due_date INTEGER,
        bank_id INTEGER REFERENCES banks (id),
        user_id INTEGER REFERENCES users (id)
        )
    `
    await runQuery(query, 'bills')
}

async function runQuery(query, tableName) {
    try {
        await db.none(query)
    } catch {
        console.error(`Error creating table ${tableName}`)
    }
}

async function migrateTables() {
    await createBankTable();
    await createUserTable();
    await createBillTable();
}

migrateTables()
    .then(()=>{
        console.log('Migration complete')
    })
    .catch((err)=>{
        console.error(`Migration failed: ${err}`)
        process.exit(1)
    })
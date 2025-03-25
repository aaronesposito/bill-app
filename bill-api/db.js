import pgPromise from 'pg-promise';
import dotenv from 'dotenv'


dotenv.config({path:'../.env'})

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    name: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
  };

const pgp = pgPromise()
const db = pgp(`postgres://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.name}`)

async function getUserByAuthId (auth0_id) {
    const user = await db.one(`SELECT * FROM users WHERE auth0_id = $1`, [auth0_id])
    return user
}

async function createUser ({auth0_id, f_name, l_name, username}) {
    await db.none(`
        INSERT INTO users (auth0_id, f_name, l_name, username)
        VALUES ($1, $2, $3, $4)
        `, 
        [auth0_id, f_name, l_name, username]
    )
}

export {getUserByAuthId, createUser}
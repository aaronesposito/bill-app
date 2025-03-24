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

export default db
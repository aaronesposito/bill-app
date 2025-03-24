import express from 'express'
import db from './db.js'
import dotenv from 'dotenv'


dotenv.config({path:'../.env'})

const app = express()
const port = process.env.API_PORT

app.use(express.json())

app.get('/users', async (req, res) => {
    try {
      const users = await db.any('SELECT * FROM users')
      console.log(req.body)
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

app.get('/users/:id', async (req, res) => {
    try {
      const user = await db.one('SELECT * FROM users WHERE id = $1', [req.params.id]);
      res.json(user);
    } catch (err) {
      res.status(404).json({ error: 'User not found' });
    }
  });

// app.post('/users', async (req, res) => {
//   try {

//   }
// })

app.listen(port, ()=> {
    console.log(`Listening on port: ${port}`)
})
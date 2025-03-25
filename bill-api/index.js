import express from 'express'
import dotenv from 'dotenv'
import checkJwt from './middleware/middleware.js';
import { getUserByAuthId, createUser } from './db.js';

dotenv.config({path:'../.env'})

const app = express()
const port = process.env.API_PORT

app.use(express.json())


app.get('/api/public', (req, res)=>{
  res.json({message:'No auth endpoint'})
})

app.get('/api/private', checkJwt, async (req, res) => {
  const {sub: auth0_id, f_name, l_name, username} = req.user

  let user = getUserByAuth0Id(auth0_id)

  res.json({
    message: "auth endpoint",
    user
  })
})

app.post('/api/user/create', async (req, res)=>{
  const {auth0_id, f_name, l_name, username} = req.body
  try {
    await createUser({auth0_id, f_name, l_name, username})
    let body = await getUserByAuthId(auth0_id)
    res.status(200).json({
      message: "account created",
      account: body
    })
  } catch (err) {
    res.status(500).json({
      message: "account creation failed",
      error: err.message
    })
  }
})

app.listen(port, ()=> {
    console.log(`Listening on port: ${port}`)
})
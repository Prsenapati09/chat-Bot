require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')


const output = require('./content')

app.use(express.json())
app.use(cors())
app.post('/api/chat/response',output)

const PORT=process.env.PORT
app.listen(PORT,()=>{
  console.log(`server start on port ${PORT}`)
})
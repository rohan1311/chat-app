var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var urlencodedParser = bodyParser.urlencoded({extended : false})
var app = express();
var http = require('http').Server(app)
var io = require('socket.io')(http)

app.use(express.static(__dirname))
app.use(bodyParser.json())
var messages=[]
var users=[]

app.get('/', (req, res) => {
   res.sendFile('index.html', {root: __dirname })
})

app.post('/send_message', urlencodedParser, (req,res) => {
   messages.push(req.body)
   io.emit('message')
   res.sendStatus(200)
})

app.get('/messages', (req,res)=>{
   res.send(JSON.stringify(messages))
})

io.on('connection', (socket)=>{
   console.log('a user connected')
   socket.on('setUserName', (data)=>{
      if(users.indexOf(data)==-1){
         users.push(data)
         socket.emit('userSet', {username:data})
      }else{
         console.log('server mai')
         socket.emit('userExists', `${data} already exists, please change your Username to join the chat`)
      }
   })
   socket.on('typing', (data)=>{
      if(data.typing==true)
         io.emit('display', data)
      else
         io.emit('display', data)
   })
}) 

const port = process.env.PORT || 3000
var server = http.listen(port, () => {
   console.log(`app listening at port ${server.address().port}`)
})




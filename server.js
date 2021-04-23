const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

const Message = mongoose.model('Message',{
  name : String,
  message : String
})

const dbUrl = 'mongodb+srv://Pedro:abc@cluster0.wizkf.mongodb.net/simple-chat'

app.get('/messages', (req, res) => {
  Message.find({},(err, messages)=> {
    res.send(messages);
  })
})

app.get('/welcome', (req, res) => {

  try{
    const message = new Message({"name":"ChatAlfred", "message":"Olá, sou o ChatAlfred, como posso ajudar?"});

    io.emit('message', message);

    res.sendStatus(200);
  }
  catch (error){
    res.sendStatus(500);
    return console.log('error',error);
  }
  finally{
    console.log('Message Posted')
  }

})

app.get('/messages/:user', (req, res) => {
  const user = req.params.user
  Message.find({name: user},(err, messages)=> {
    res.send(messages);
  })
})

app.post('/messages', async (req, res) => {

  let date = new Date();

  //ChatAlfred
  const questionList = {
    "bom dia": "Bom dia " + req.body.name + "!",
    "Bom dia": "Bom dia " + req.body.name + "!",
    "boa noite": "Boa noite " + req.body.name + "!",
    "Boa noite": "Boa noite " + req.body.name + "!",
    "boa tarde": "Boa tarde " + req.body.name + "!",
    "Boa tarde": "Boa tarde " + req.body.name + "!",
    "que dia e hoje?": "Hoje é dia " + ((date.getDate() )) + "/" + ((date.getMonth() + 1)) + "/" + date.getFullYear(),
    "Que dia e hoje?" : "Hoje é dia " + ((date.getDate() )) + "/" + ((date.getMonth() + 1)) + "/" + date.getFullYear(),
    "que horas sao?" : "Agora são " + date.getHours() + ":" +  date.getMinutes() + ":" + date.getSeconds(),
    "Que horas sao?" : "Agora são " + date.getHours() + ":" +  date.getMinutes() + ":" + date.getSeconds(),
    
  };

  try{
    const message = new Message(req.body);

    const savedMessage = await message.save()
    console.log('saved');

    const censored = await Message.findOne({message:'badword'});
    if(censored)
      await Message.remove({_id: censored.id})
    else
      io.emit('message', req.body);


//chatbot

    if(req.body.message.includes("bom dia"))
      io.emit('message', new Message({"name":"ChatAlfred", "message": questionList["Bom dia"]}))

    else if(req.body.message.includes("Bom dia"))
      io.emit('message', new Message({"name":"ChatAlfred", "message": questionList["Bom dia"]}))

    else if(req.body.message.includes("boa noite"))
      io.emit('message', new Message({"name":"ChatAlfred", "message": questionList["Boa noite"]}))

    else if(req.body.message.includes("Boa noite"))
      io.emit('message', new Message({"name":"ChatAlfred", "message": questionList["Boa noite"]}))
    
      else if(req.body.message.includes("boa tarde"))
      io.emit('message', new Message({"name":"ChatAlfred", "message": questionList["boa tarde"]}))

      else if(req.body.message.includes("Boa tarde"))
      io.emit('message', new Message({"name":"ChatAlfred", "message": questionList["Boa tarde"]}))
    
      else if(req.body.message.includes("que dia e hoje?"))
      io.emit('message', new Message({"name":"ChatAlfred", "message": questionList["Que dia e hoje?"]}))

      else if(req.body.message.includes("Que dia e hoje?"))
      io.emit('message', new Message({"name":"ChatAlfred", "message": questionList["Que dia e hoje?"]}))
    
      else if(req.body.message.includes("que horas sao?"))
      io.emit('message', new Message({"name":"ChatAlfred", "message": questionList["Que horas sao?"]}))

      else if(req.body.message.includes("Que horas sao?"))
      io.emit('message', new Message({"name":"ChatAlfred", "message": questionList["Que horas sao?"]}))
    
      else
      io.emit('message', new Message({"name":"ChatAlfred", "message": "Desculpa, não entendi"}))




      res.sendStatus(200);
    }
    catch (error){
      res.sendStatus(500);
      return console.log('error',error);
    }
    finally{
      console.log('Message Posted')
    }
  
  })
  
  io.on('connection', () =>{
    console.log('a user is connected')
  })
  
  mongoose.connect(dbUrl ,{useMongoClient : true} ,(err) => {
    console.log('mongodb connected',err);
  })
  
  const server = http.listen(3001, () => {
    console.log('server is running on port', server.address().port);
  });
  

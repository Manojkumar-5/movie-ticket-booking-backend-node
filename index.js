const express=require('express');
const BodyParser=require('body-parser');
const app=express();
const Route=require('./Routes/route');
const cors=require('cors');

const {mongoose} = require('./Connection/Connection');  

    app.use(BodyParser.json());

    app.use(BodyParser.urlencoded({extended:true}));

    app.use(express.static('public'));

    app.use(cors());
     

      app.use('/api',Route);  
      
      let port=process.env.PORT;

      if(port==null ||port=="")
      {
        port=5000;
      }
      
           
      app.listen(port,() => {
        console.log('listening at port 5000');
      });


const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();
app.use(express.static('Public'))
app.use(bodyParser.urlencoded({extended: true}))
//req.send can be only one time (but we can write to the response using res.write)

app.get('/', (req, res)=>{
    res.sendFile(__dirname+"/signup.html");
})


app.post('/', (req, res)=>{
    const fname = req.body.n1;
    const lname = req.body.n2;
    const email = req.body.email;

    const list_id = ""+process.env.list_id;
    const url  = `https://us21.api.mailchimp.com/3.0//lists/${list_id}`;
    
    const data = {
        members : [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                  FNAME: fname,
                  LNAME: lname,
                }
            }
        ],
        update_existing: true,
    }

    const jsondata = JSON.stringify(data);  //parsing js objects to json 
    const apiKey = process.env.API_KEY;
    const options = {   //options for https req
        method: 'POST',
        auth : 'Ayush1:'+apiKey
    }
    //saving request of https request in request coonst so we can write the post data later
    const request = https.request(url, options, (response)=>{
         
        response.on("data", (d)=>{
            console.log(JSON.parse(d));
        })

        //if error on request
        request.on('error', (e) => {
            console.error(e);
        });

        if(response.statusCode === 200 ){
            res.sendFile(__dirname+"/success.html")
        }
        else{
            console.log("error Occured")
            res.sendFile(__dirname+"/faliure.html")
        }

    });

    
    request.write(jsondata)
    request.end();

});

app.post('/faliure', (req,res)=>{
    res.redirect('/');
})
const port = process.env.PORT || 3000;
app.listen( port, ()=>{
    console.log("Server is running on port :  "+port);
})


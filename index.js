const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.w5uqgn7.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
        try{
            const serviceCollection = client.db('photography').collection('services')

            // get services from database 
            app.get('/services' , async (req, res) => {
                const query = {};
                const cursor = serviceCollection.find(query);
                const cursorTwo = serviceCollection.find(query).limit(3)
                const survices = await cursor.toArray();
                const serviceHome = await cursorTwo.toArray();
                res.send({survices, serviceHome})
            })

            // get specific data using service id 
            app.get('/details/:id', async (req, res)=>{
                const id = req.params.id
                const query = {_id : ObjectId(id)}
                const service = await serviceCollection.findOne(query);
                res.send(service);
            })
        }
        finally{

        }
}
run().catch(error => console.error(error))



app.get('/', (req, res)=> {
    res.send('photography server is running')
})
app.listen(port, ()=> {
    console.log(`Listening to port`, port)
})

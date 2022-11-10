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
            const reviewCollection = client.db('photography').collection('reviews')

            // get services from database 
            app.get('/services' , async (req, res) => {
                const query = {};
                const cursor = serviceCollection.find(query);
                const cursorTwo = serviceCollection.find(query).limit(3)
                const survices = await cursor.toArray();
                const serviceHome = await cursorTwo.toArray();
                res.send({survices, serviceHome})
            })

            // post service to database 
            app.post('/services', async (req, res)=> {
                const services = req.body 
                console.log(services)
                const result = await serviceCollection.insertOne(services);
                res.send(result)
            })

            // get specific data using service id 
            app.get('/details/:id', async (req, res)=>{
                const id = req.params.id
                const query = {_id : ObjectId(id)}
                const service = await serviceCollection.findOne(query);
                res.send(service);
            })


            // add user reviews to database collection 
            app.post('/reviews', async (req, res)=> {
                const review = req.body 
                console.log(review)
                const result = await reviewCollection.insertOne(review);
                res.send(result)
            })

            // load my review by user email id from database 
            app.get('/reviews', async (req, res) => {
                let query = {}
    
                if(req.query.email){
                    query = {
                        email : req.query.email
                    }
                }
    
                const cursor = reviewCollection.find(query)
                const review = await cursor.toArray()
                res.send(review);
            })

            
            // specific service review get from database 
            app.get('/reviews', async (req, res) => {

                console.log(req.query._id);
                let query = {}
    
                if(req.query._id){
                    query = {
                        serviceId : req.query._id
                    }
                }
                const cursor = reviewCollection.find(query)
                const review = await cursor.toArray()
                console.log(review)
                res.send(review);
            })

            // delete review api 
            app.delete('/reviews/:id', async (req, res) => {
                const id = req.params.id;
                const query = {_id : ObjectId(id)}
                const result = await reviewCollection.deleteOne(query)
                res.send(result)
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

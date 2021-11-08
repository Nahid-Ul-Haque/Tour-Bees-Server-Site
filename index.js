const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;


const app = express();
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eammk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('Tour-Bees');
        const dataCollection = database.collection('Data-Collection');
        const cartCollection = database.collection("cart");

        // GET API
        app.post('/addOffers', async (req, res) => {
            const result = await dataCollection.insertOne(req.body);
            res.json(result)
        })


        //   GET API for displaying Services
        app.get('/offers', async (req, res) => {
            const result = await dataCollection.find({}).toArray();
            res.json(result)
        })


        //   GET API for displaying dynamically single Service
        // app.get('/offers/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) }
        //     const service = await dataCollection.findOne(query)
        //     res.json(service);
        // })


        // DELETE API for deleting services
        app.delete('/deletedOffers/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const deletedService = await dataCollection.deleteOne(query);
            res.json(true);
        })




        // Cart

        // GET API for Cart
        app.get('/cart', async (req, res) => {
            let query = {};
            const email = req.query.email;

            if (email) {
                query = { email: email };
            }
            const result = await cartCollection.find(query).toArray();
            res.send(result)
        })



        // POST API for Cart
        app.post('/cart', async (req, res) => {
            const cart = req.body
            cart.createdAt = new Date()
            const result = await cartCollection.insertOne(cart)
            console.log(req.body);
            console.log(result);
            res.json(result)
        })


        // DELETE API for deleting orders
        app.delete('/deletedOrder/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const deletedOrder = await cartCollection.deleteOne(query);
            console.log(deletedOrder);
            res.json(deletedOrder);
        })

    }

    finally {
        // await client.close()
    }
}
run().catch(error => console.log(error))

app.get('/', (req, res) => {
    res.send('Tour is Running')
});

app.listen(port, () => {
    console.log('server Running')
})
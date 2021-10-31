const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient } = require('mongodb');
const app = express();


const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eammk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('Tour-Bees');
        const dataCollection = database.collection('Data-Collection')

        app.get('/offers', async (req, res) => {
            const cursor = dataCollection.find({});
            const users = await cursor.toArray();
            res.send(users)
        })
    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Tour is Running')
});

app.listen(port, () => {
    console.log('server Running')
})
// server.js

const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Connect to MongoDB
const uri = process.env.mongo_path;
console.log(uri)
let collection;
let collection2;

(async function () {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const database = client.db('quickstartDB');
    collection = database.collection('sampleCollection');
    collection2 = database.collection('streams');
})();

// Route to handle requests to your MongoDB
app.get('/mongodb/api/endpoint', async (req, res) => {
    // console.log('Loading:');
    try {
        const cursor = await collection2.find({});
        const documents = await cursor.toArray();
        // console.log('Documents retrieved:', documents);
        res.json(documents);
    } catch (error) {
        console.error('Error retrieving data from MongoDB:', error);
        res.status(500).json({ error: 'Error retrieving data from MongoDB' });
    }
});

app.get('/mongodb/api/findone/:key', async (req, res) => {
    const activityId = req.params.key;
    console.log("De activityId: ", activityId)
    try {
        const stream = await collection2.findOne({ _id: activityId });
        if (stream) {
            res.json(stream.data);
        } else {
            res.status(404).json({ message: 'stream not found' });
        }
    } catch (error) {
        // If an error occurs, send a 500 Internal Server Error response
        console.error('Error retrieving data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/mongodb/api/post/:key', async (req, res) => {
    try {
        const yourCustomKey = req.params.key;
        const data = req.body; // Assuming data is sent in the request body

        // console.log(yourCustomKey)
        const document = { _id: yourCustomKey, data };
        const objectInDB = await collection2.findOne({ _id: yourCustomKey });

        if (objectInDB) {
            // console.log("already in DB: ")
        } else {
            // console.log("not in DB yet: ")
            const result = await collection2.updateOne(
                { _id: document._id }, // Match documents by _id
                { $set: document },    // Set the entire document
                { upsert: true }       // Perform an upsert operation
            );
        }
        res.status(201).json({ message: 'Data inserted successfully' });
    } catch (error) {
        console.error('Error inserting data into MongoDB:', error);
        res.status(500).json({ error: 'Error inserting data into MongoDB' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(uri)
});

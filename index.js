const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(cors());

// mongodb
// 2
2
345555555567

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://showCase:yqnJWYojgbY8Lb2n@cluster1.ofi7kql.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const userCollection = client.db("showCaseDB").collection("users");
        const productsCollection = client.db("showCaseDB").collection("products");


        // registered users
        app.post("/users", async (req, res) => {
            const user = req.body;
            const existingEmail = await userCollection.findOne({ email: user.email })
            if (existingEmail) {
                console.log("User already exist in db")
                return;
            }
            const result = await userCollection.insertOne(user);
            res.send(result);
        })

        // get all users
        app.get("/users", async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result);
        })

        // get all products
        app.get("/products", async (req, res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const result = await productsCollection.find().skip(page * size).limit(size).toArray();
            res.send(result);
        })

        app.get("/totalProductsCount", async (req, res) => {
            const totalProductsCount = await productsCollection.estimatedDocumentCount();
            res.send({ totalProductsCount });
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Show Case Server')
})

app.listen(port, () => {
    console.log(`server running on ${port}`)
})
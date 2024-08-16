const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jzumutc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


// middlewares
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Easetone server is running')
});


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const productCollection = client.db('easeTone').collection('products');
  
    // products related apis
    app.get('/products-count', async (req, res) => {
      const totalProducts = await productCollection.estimatedDocumentCount();

      res.send({ totalProducts });
    });

    app.get('/products', async (req, res) => {
      const page = req.query.page;
      const result = await productCollection.find().skip(page * 8).limit(8).toArray();

      res.send(result);
    });

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Easetone server is running on PORT: ${port}`);
})
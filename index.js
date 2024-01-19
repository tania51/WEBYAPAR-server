const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 3000

// middleware
app.use(cors({
    origin: ['http://localhost:8080']
}))
app.use(express.json())


// User: WebYapar
// Pass: vi9uMPSHQ9m3vkRI



const uri = process.env.DB_URI;

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

    const adminCollection = client.db('WebYapar').collection('admin');

    app.post('/user', async(req, res) => {
        const adminData = req.body;
        const result = await adminCollection.insertOne(adminData)
        res.send(result)
    })

    app.get('/admin-info', async(req, res) => {
      const adminLoginInfo = adminCollection.find();
      const result = await adminLoginInfo.toArray();
      res.send(result)
    })

    // updated user data
    app.put('/updated-user-data', async(req, res) => {
      const newArr = req.body;
      const id = newArr._id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert : true }

      const updateDoc = {
        $set : {
          userName : newArr.userName,
          userImage : newArr.userImage
        }
      }

      const result = await adminCollection.updateOne(filter, updateDoc, options);
      res.send(result)
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
  res.send('Hello WEBYAPAR!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
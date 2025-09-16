const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000
require('dotenv').config()

//MidleWare
app.use(cors())
app.use(express.json())

//Mongo add 

const uri = `mongodb+srv://${process.env.USERDB}:${process.env.PASSDB}@cluster0.nfpubcd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// const uri = "mongodb+srv://<db_username>:<db_password>@cluster0.nfpubcd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();





    // Monogo data connect
    const database = client.db("offerDB").collection("allOffer")



    // Post
    app.post('/allOffer', async (req,res)=>{
      const data = req.body;
      const result = await database.insertOne(data);
      console.log(result)
      res.send(result) 
    })

    //Get
    app.get('/allOffer', async(req,res)=>{
      const query = database.find()
      const result = await query.toArray()
      res.send(result)
    })

    // Delete
    app.delete('/allOffer/:id', async(req,res)=>{
      const id = req.params.id;
      const newData = {_id: new ObjectId(id)};
      const result = await database.deleteOne(newData);
      res.send(result)
    })

    // get for update
    app.get('/allOffer/:id', async(req,res)=>{
      const id = req.params.id;
      const data = {_id: new ObjectId(id)}
      const result = await database.findOne(data);
      res.send(result)
    })

    // Update
    app.put('/allOffer/:id', async(req,res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true };
      const upData = req.body;
      const updateDoc = {
      $set: {
        ofeertitle:upData.ofeertitle,
      offerdetails: upData.ofeertitle,
      price:upData.price,
      duration:upData.duration,
      simname:upData.duration,
      packname:upData.packname,
      photo:upData.photo
      },
    };
    const result = await database.updateOne(filter,updateDoc,options)
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
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
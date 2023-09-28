const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


// middleware start
app.use(cors());
app.use(express.json());
// middleware end


//MongoDb Working Start


const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rben4l6.mongodb.net/?retryWrites=true&w=majority`;

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

    //db data insert start
      // Connect to the "insertDB" database and access its "haiku" collection
    const database = client.db("coffeeDB");
    const coffeeCollection = database.collection("coffee");
    //db data insert end

// DB Data get start
app.get('/coffee', async(req,res)=>{
  const cursor = coffeeCollection.find();
  const result = await cursor.toArray();
  res.send(result);

})
// DB Data get End


// data base data post start
app.post('/coffee',async(req,res)=>{
  const newCoffee = req.body;
  console.log(newCoffee);
   // Insert the defined document into the "haiku" collection
    const result = await coffeeCollection.insertOne(newCoffee);
    res.send(result)
}) 
// data base data post end 

//DB Data Update start
//Spacific Data catch {id} dia
app.get('/coffee/:id', async(req,res)=>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await coffeeCollection.findOne(query);
  res.send(result);
})
//
app.put('/coffee/:id',async(req,res)=>{
  const id = req.params.id;
  const filter = {_id: new ObjectId(id)}
  const options = {upsert: true};
  const updatedCoffee = req.body;
  const coffee={
    $set: {
      name:updatedCoffee.name,
      quantity:updatedCoffee.quantity,
      supplier:updatedCoffee.supplier,
      taste:updatedCoffee.taste,
      category:updatedCoffee.category,
      details:updatedCoffee.details,
      url:updatedCoffee.url
    }
  }
const result = await coffeeCollection.updateOne(filter,coffee,options);
res.send(result)
})
//DB Data Update End

//delete DB Data start
app.delete('/coffee/:id',async(req,res) =>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await coffeeCollection.deleteOne(query);
  res.send(result);
})
//delete DB Data end


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//MongoDb Working End



app.get('/',(req,res)=>{
 res.send('ai bata')
});




app.listen(port,()=>{
    console.log(`Ami kisu pari na ${port}`)
})

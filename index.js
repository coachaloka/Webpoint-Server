// step-1

const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;

// 2.0
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();
// 01

//2- midddleware
app.use(cors());
app.use(express.json());


// mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ujeqvuj.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


//1 jwt 
function verifyJWT(req, res, next){
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).send({message: 'Unauthorized Access!'})
    }
    const token = authHeader.split(' ')[1];
    console.log(process.env.ACCESS_TOKEN_SECRET);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
        if(err){
            return res.status(401).send({message: 'Unauthorized Access!'})
        }
        req.decoded = decoded;
        next();
    })
}
// 3.1
async function run(){
    // 3.3
    try{
        // 3.5
        const serviceCollection = client.db('webPoint').collection('service');
        // order collection
        const ordersCollection = client.db('webPoint').collection('orders');
        // blogs collection
        const blogsCollection = client.db('webPoint').collection('blogs');

        // jwt 
        app.post('/jwt', (req, res)=>{
            const user = req.body;
            // console.log(user);
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'});
            res.send({token});
        });
        // get blog data
        app.get('/blogs', async (req, res)=>{
            const query = {};
            const cursor = blogsCollection.find(query);
            const blogs = await cursor.toArray();
            res.send(blogs);
        })
        
        // to get 3 data in in browser 
        app.get('/services', async (req, res)=>{
            const query = {};
            const cursor = serviceCollection.find(query).limit(3);
            const services = await cursor.toArray();
            res.send(services);
        })
        // to get all data in browser 
        app.get('/allservices', async (req, res)=>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })
        // to get specific data/product or activities in browser
        app.get('/services/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        // order api to create a services sheet in collections
        app.post('/services', async (req, res)=>{
            const service= req.body;
            const result = await serviceCollection.insertOne(service);
            console.log(result)
            res.send(result);
        });
        
        // get orders in ui
        app.get('/orders', verifyJWT, async (req, res)=>{
            // jwt token 
            const decoded= req.decoded;
            console.log('inside orders api', decoded);
            
            // if(decoded.email !==req.query.email){
            //     return res.status(403).send({message: 'Unauthorized Access!'})
            // }

            if(decoded.user !==req.query.user){
                return res.status(403).send({message: 'Unauthorized Access!'})
            }

            // console.log(req.headers.authorization)

            // console.log(req.query.email); query by email/can be found by id
            let query= {};
            if(req.query.email){
                query = {
                    email: req.query.email
                }
            }
            const cursor = ordersCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
        });
        // add services 
        

        // order api to create a order sheet in collections
        app.post('/orders', async (req, res)=>{
            const order= req.body;
            const result = await ordersCollection.insertOne(order);
            res.send(result);
        });
        // updata orders
        app.patch('/orders/:id', async (req, res)=>{
            const id= req.params.id;
            const status = req.body.status
            const query = {_id: ObjectId(id)};
            const updateDocs ={
                $set: {
                    status: status
                }
            }
            const resutl = await ordersCollection.updateOne(query, updateDocs);
            res.send(resutl)
        })

        // delete operations 
        app.delete('/orders/:id', async (req, res)=>{
            const id = req.params.id;
            console.log(id);
            const query = {_id: ObjectId(id)};
            const result = await ordersCollection.deleteOne(query);
            res.send(result);
        })

        // review sections
        app.put('/reviews', (req, res)=>{

        })
    }
         // 3.4
    finally{

    }
}
// 3.2
run().catch(error=>console.error(error));



// 1 step
app.get('/', (req, res)=>{
    res.send('Experst Cars Websites!')
});

app.listen(port, ()=>{
    console.log(`listening on ${port}`);
})
// 1 steop fininshed.












// const express = require('express');
// const app = express();
// const cors = require('cors');
// const jwt = require('jsonwebtoken');
// const port = process.env.PORT || 5000;

// // 2.0
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// require('dotenv').config();
// // 01

// //2- midddleware
// app.use(cors());
// app.use(express.json());

// // console.log(process.env.DB_USER);
// // console.log(process.env.DB_PASSWORD);


// // mongodb-3



// // const uri = "mongodb+srv://<username>:<password>@cluster0.lhptd0u.mongodb.net/?retryWrites=true&w=majority";
// // const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lhptd0u.mongodb.net/?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// //1 jwt 
// function verifyJWT(req, res, next){
//     const authHeader = req.headers.authorization;
//     if(!authHeader){
//         return res.status(401).send({message: 'Unauthorized Access!'})
//     }
//     const token = authHeader.split(' ')[1];
//     console.log(process.env.ACCESS_TOKEN_SECRET);
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
//         if(err){
//             return res.status(401).send({message: 'Unauthorized Access!'})
//         }
//         req.decoded = decoded;
//         next();
//     })
// }
// // 3.1
// async function run(){
//     // 3.3
//     try{
//         // 3.5
//         const serviceCollection = client.db('superCar').collection('service');
//         // order collection
//         const ordersCollection = client.db('superCar').collection('orders');
        
//         // jwt 
//         app.post('/jwt', (req, res)=>{
//             const user = req.body;
//             // console.log(user);
//             const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'});
//             res.send({token});
//         })
//         // to get 3 data in in browser 
//         app.get('/services', async (req, res)=>{
//             const query = {};
//             const cursor = serviceCollection.find(query).limit(3);
//             const services = await cursor.toArray();
//             res.send(services);
//         })
//         // to get all data in browser 
//         app.get('/allservices', async (req, res)=>{
//             const query = {};
//             const cursor = serviceCollection.find(query);
//             const services = await cursor.toArray();
//             res.send(services);
//         })
//         // to get specific data/product or activities in browser
//         app.get('/services/:id', async (req, res)=>{
//             const id = req.params.id;
//             const query = {_id: ObjectId(id)};
//             const service = await serviceCollection.findOne(query);
//             res.send(service);
//         });

//         // get orders in ui
//         app.get('/orders', verifyJWT, async (req, res)=>{
//             // jwt token 
//             const decoded= req.decoded;
//             console.log('inside orders api', decoded);
            
//             // if(decoded.email !==req.query.email){
//             //     return res.status(403).send({message: 'Unauthorized Access!'})
//             // }

//             if(decoded.user !==req.query.user){
//                 return res.status(403).send({message: 'Unauthorized Access!'})
//             }

//             // console.log(req.headers.authorization)

//             // console.log(req.query.email); query by email/can be found by id
//             let query= {};
//             if(req.query.email){
//                 query = {
//                     email: req.query.email
//                 }
//             }
//             const cursor = ordersCollection.find(query);
//             const orders = await cursor.toArray();
//             res.send(orders);
//         });

//         // order api to create a order sheet in collections
//         app.post('/orders', async (req, res)=>{
//             const order= req.body;
//             const result = await ordersCollection.insertOne(order);
//             res.send(result);
//         });
//         // updata orders
//         app.patch('/orders/:id', async (req, res)=>{
//             const id= req.params.id;
//             const status = req.body.status
//             const query = {_id: ObjectId(id)};
//             const updateDocs ={
//                 $set: {
//                     status: status
//                 }
//             }
//             const resutl = await ordersCollection.updateOne(query, updateDocs);
//             res.send(resutl)
//         })

//         // delete operations 
//         app.delete('/orders/:id', async (req, res)=>{
//             const id = req.params.id;
//             console.log(id);
//             const query = {_id: ObjectId(id)};
//             const result = await ordersCollection.deleteOne(query);
//             res.send(result);
//         })

//         // review sections
//         app.put('/reviews', (req, res)=>{

//         })
//     }
//          // 3.4
//     finally{

//     }
// }
// // 3.2
// run().catch(error=>console.error(error));



// // 1 step
// app.get('/', (req, res)=>{
//     res.send('Experst Cars Websites!')
// });

// app.listen(port, ()=>{
//     console.log(`listening on ${port}`);
// })
// // 1 steop fininshed.

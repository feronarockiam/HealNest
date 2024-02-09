const express = require('express')
const app = express();
const path = require('path')
const bodyParser = require('body-parser')
app.use(express.static(path.join(__dirname, 'assets')));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

const { MongoClient } = require('mongodb');




// Connection URI
const uri = 'mongodb+srv://sampleuser:12345@cluster0.oac1w0b.mongodb.net/?retryWrites=true&w=majority';

// Database Name
const dbName = 'healnest';

// Connect to MongoDB
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect()
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(err => {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    });

// Handle form submission
app.post('/submit-appointment', async (req, res) => {
    try {
        // Extract form data from the request
        const { name, email, phone, datetime, message } = req.body;
        console.log("in submit appoint");
        console.log(req.body)
        // Get the database instance
        const db = client.db(dbName);

        // Get the collection
        const appointmentsCollection = db.collection('appointments');

        // Insert the new appointment
        await appointmentsCollection.insertOne({
            name,
            email,
            phone,
            datetime,
            message
        });

        res.redirect('/homepage');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/homepage',(req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'))
})
app.get('/fetchAppointments', async (req, res) => {
    try {
        const db = client.db(dbName);

        const appointmentsCollection = db.collection('appointments');

        const appointments = await appointmentsCollection.find({}).toArray();

        res.json(appointments);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(4000,()=>{
    console.log("server running on port 4000");
})
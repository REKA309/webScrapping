const { MongoClient } = require('mongodb');

const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.thghzu2.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        // db connection
        const database = client.db(`${process.env.DBNAME}`);
        // collection connection
        database.collection(`${process.env.COLLECTION_NAME}`);
        console.log('Connected to MongoDB Atlas');
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

run();
a
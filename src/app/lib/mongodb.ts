import { MongoClient } from 'mongodb';

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const mongoUri = process.env.MONGODB_URI_ATLAS;
if (!mongoUri) {
  throw new Error('MONGODB_URI is not defined in the environment variables');
}

const client = new MongoClient(mongoUri);

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  if (global._mongoClientPromise) {
    clientPromise = global._mongoClientPromise;
  } else {
    global._mongoClientPromise = client.connect();
    clientPromise = global._mongoClientPromise;
  }
} else {
  clientPromise = client.connect();
}

export default clientPromise;

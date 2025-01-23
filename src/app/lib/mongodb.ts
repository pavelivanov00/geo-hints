import { MongoClient } from 'mongodb';

const mongoUri = process.env.MONGODB_URI_ATLAS;
if (!mongoUri) {
  throw new Error('MONGODB_URI_ATLAS is not defined in the environment variables');
}

const client = new MongoClient(mongoUri);

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  const globalWithMongoClient = globalThis as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongoClient._mongoClientPromise) {
    globalWithMongoClient._mongoClientPromise = client.connect();
  }

  clientPromise = globalWithMongoClient._mongoClientPromise;
} else {
  clientPromise = client.connect();
}

export default clientPromise;

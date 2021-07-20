import { CosmosClient } from '@azure/cosmos';

const client = new CosmosClient(process.env.DATABASE_CONNECTION_STRING);
const collectionRef = client
  .database(process.env.DATABASE_NAME)
  .container(process.env.COLLECTION_NAME);

export { collectionRef as usersCollection };

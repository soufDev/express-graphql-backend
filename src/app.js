import express from 'express';
import bodyParser from 'body-parser';
import graphqlHttp from 'express-graphql';
import mongoose from 'mongoose';

import schema from './graphql/schemas';
import resolvers from './graphql/resolvers';
import isAuth from './middleware/is-auth';

const app = express();

app.use(bodyParser.json());
app.use(isAuth);
app.use('/api', graphqlHttp({
  schema: schema,
  rootValue: resolvers,
  graphiql: true
}))

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@learning-graphql-cxgyb.gcp.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`,
  { useNewUrlParser: true })
  .then(() => {
    app.listen(5000, () => {
      console.log('the app is listening to 5000 port')
    })
  }).catch((error) => {
    console.log(error)
  });

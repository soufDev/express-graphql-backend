const express = require('express');
const bodyParser = require('body-parser');

const graphqlHttp = require('express-graphql');

const mongoose = require('mongoose');

const schema = require('./graphql/schemas');
const resolvers = require('./graphql/resolvers');

const app = express();

app.use(bodyParser.json());
app.use('/api', graphqlHttp({
    schema: schema,
    rootValue: resolvers,
    graphiql: true,
}))

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@learning-graphql-cxgyb.gcp.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`, { useNewUrlParser: true })
.then(() => {
    app.listen(5000, () => {
        console.log('the app is listening to 5000 port')
    })
}).catch(error => {
    console.log(error)
});

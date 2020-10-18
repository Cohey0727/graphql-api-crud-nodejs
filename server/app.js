require('dotenv').config()
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const schema = require("./schema/schema");
const app = express();

console.log(process.env);

mongoose.connect(process.env.MONGODB_URL);
mongoose.connection.once("open", () => {
  console.log("connect success");
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(4000, () => {
  console.log("hello express");
});

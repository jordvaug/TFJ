//npm run dev
const express = require("express");
require("dotenv").config();
const config = require("./config/config");

var path = require("path"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  morgan = require("morgan"),
  app = express(),
  apiRouter = require("./routes/api"),
  cors = require("cors");

//changes for heroku
app.use(express.static(path.join(__dirname, "client", "build")));

//used to log all requests to the console
app.use(morgan("dev"));

//parse url and json
//https://www.npmjs.com/package/body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Cross-Origin resource sharing (CORS)
//github.com/expressjs/cors
app.use(cors());

//Mongoose init connect to MongoDb
//https://mongoosejs.com/docs/
//if there is an error, check the IP whitelist
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB);

//*****************************************************************/
//Routes (api)
app.use("/api", apiRouter);

//used for heroku
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client/build", "index.html"));
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

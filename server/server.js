const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { readdirSync } = require("fs");
const app = express();

//middleware
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

readdirSync('./routes').map((r)=>{
    app.use('/api',require('./routes/'+r))
})
// console.log(readdirSync('./routes'))

app.listen(5000, () => {
  console.log("Server on port 5000");
});

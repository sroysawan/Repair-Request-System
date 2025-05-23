const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { readdirSync } = require("fs");
const app = express();

//middleware
app.use(morgan("dev"));
app.use(cors());
app.use(express.json({
  limit: '10mb'
}));

readdirSync('./routes').map((r)=>{
    app.use('/api',require('./routes/'+r))
})
// console.log(readdirSync('./routes'))

app.listen(5004, () => {
  console.log("Server on port 5000");
});

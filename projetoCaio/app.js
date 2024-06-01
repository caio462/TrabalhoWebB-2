const express = require ("express");
const parser = require("body-parser");
const router = require("./routes/rotas.js");

const app = express();
const port = 8000;

app.use(parser.json());
app.use("/livraria", router);

app.listen(port, () =>{
    console.log(`http://localhost:${port}`);
});
require("dotenv").config();
const Router = require('./route');
const express = require('express');
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(Router);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

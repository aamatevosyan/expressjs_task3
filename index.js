const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api.todos.route');

const app = express();

app.use(express.static(path.join(__dirname, 'public')))

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use('/api/todos/', apiRouter);

app.use(function(err, req, res, next) {
    if (err.statusCode) {
      return res.status(err.statusCode).json(err)
    }
    
    return res.status(500).json(err)
})

const PORT = 7000;
app.listen(PORT, () => console.log(`Service is running on port: ${PORT}`));
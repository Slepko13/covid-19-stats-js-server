const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = process.env.PORT || 4000;;

const app = express();

let Country = require('./country.model');

app.use(cors());
app.use(bodyParser.json());


// app.use(express.static('client'));




async function start() {
    try {
        //? DB connection//////////////////////////////////////////////////////////
        //*For MongoDB connection(cloud)
        await mongoose.connect(
            " mongodb+srv://fosfat:12345@cluster0-dlm3x.mongodb.net/MERNDB?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('Data base connected...');

        //? Fill DB

        app.post('/add', ((req, res) => {
            let country = new Country(req.body);
            // console.log('Req.body', req.body);
            country.save()
                .then(country => {
                    res.status(200).json({ 'todo': 'country added successfully' });
                })
                .catch(err => {
                    res.status(400).send('adding new country failed');
                });
        }));
        //? Get country list from DB
        app.get('/', ((req, res) => {

            Country.find((err, countries) => {
                if (err) {
                    console.log(err);
                } else {
                    res.json(countries);
                }
            });
        })
        )


        app.listen(PORT, () => console.log(`Server has been  started on port ${PORT}...`));//For server running
    } catch (e) {
        console.log('server error', e.message)
        process.exit(1)
    }
}
start();
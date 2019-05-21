const path = require('path');
const express = require('express');
const hbs = require('hbs');

const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const PORT = process.env.PORT || 3000;

//Define paths for Express config
const publicFolderPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

//Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

//Setup static directory to serve
app.use(express.static(publicFolderPath));

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Juan Agu'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Juan Agu'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Juan Agu',
        helpText: 'Nothing here yet'
    });
});

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Juan Agu',
        errorMessage: 'Help article not found'
    });
});


app.get('/weather', (req, res) => {
    //Express can only send one response, so we need to return a response explicitly with
    //the return keyword if something goes wrong, otherwise res.send() sends the correct response
    if (!req.query.address) {
        return res.send({ error: 'You must provide a valid address' });
    }
    //If address... we need to pass a default empty object, because the ap always try to 
    //destructure the response in { latitude, longitude, location }
    //If one of this properties not exists or is undefined the app will crash
    geocode(req.query.address, (error, { latitude, longitude, location } = {} ) => {
        //If geocode.error...
        if (error) {
            return res.send({ error });
        }
        //If !geocode.error
        forecast(latitude, longitude, (error, forecastData) => {
            //If forecast.error
            if (error) {
                return res.send({ error });
            }
            //If !forecast.error
            res.send({
                address: req.query.address,
                location,
                forecast: forecastData
            });
        });
    });
});

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Juan Agu',
        errorMessage: 'Page not found'
    });
});

app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`);
});


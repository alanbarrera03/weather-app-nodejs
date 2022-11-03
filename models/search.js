const fs = require('fs');

const axios = require('axios');

class Search {

    history = [];
    dbPath = './db/database.json';

    constructor() {

        this.readDB();

    }

    get historyCapitalized() {
        
        return this.history.map( placeSelect  => { 

            let words = placeSelect.split(" ");
            words = words.map( w =>  w[0].toUpperCase() + w.substring(1) ); 
            
            return words.join(' ');

        })
        

    }

    get paramsMapBox(){
        return {
            
                'access_token': process.env.MAPBOX_KEY,
                'limit': 5,
                'language': 'es'
            
        }
    }

    get paramsOpenWeather(){
        return {
            
                appid : process.env.WEATHER_KEY,
                lang  : 'es',
                units : 'metric'
            
        }
    }

    async city( place = '' ){


        try {

            // Petition http
            const instance =  axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ place }.json`,
                params: this.paramsMapBox
            });

            const resp = await instance.get();
            return resp.data.features.map( place => ({

                id:   place.id,
                name: place.place_name,
                lng:  place.center[0],
                lat:  place.center[1],

            }));

        } catch (error) {
            
            return[]; //return to the place
        }

    }

    async weatherPlace( lat, lon ){

        try {

            //intance axios.create()
            const intanceWeather = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsOpenWeather, lat, lon }
            })

            // resp.data

            const resp = await intanceWeather.get();
            const { weather, main } = resp.data;
            // console.log(resp);
            return{

                desc: weather[0].description,
                min:  main.temp_min,
                max:  main.temp_max,
                temp: main.temp,

            }
            
        } catch (error) {

            console.log(error);

        }

    }


    addHistory( place = '' ){

        if( this.history.includes( place.toLocaleLowerCase() ) ){
            return;
        }

        this.history = this.history.splice( 0, 5 );

        this.history.unshift( place.toLocaleLowerCase() );

        // Save in DB
        this.saveDB();

    }

    saveDB() {

        const payload = {

            history: this.history

        };

        fs.writeFileSync( this.dbPath, JSON.stringify( payload ) );

    }

    readDB() {
        
        
        if( !fs.existsSync( this.dbPath ) ){
            
            return null;
            
        }
        
        const info = fs.readFileSync( this.dbPath, { encoding: 'utf-8' } );
        const data = JSON.parse( info );

        this.history = data.history;

    }

}



module.exports = Search;
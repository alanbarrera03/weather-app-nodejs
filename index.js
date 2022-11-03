require('dotenv').config();


const { readInput, inquirerMenu, pause, listPlaces } = require("./helpers/inquirer");
const Search = require("./models/search");

const main = async() => {

    const searchs = new Search();
    let opt;

    do {

        opt = await inquirerMenu();

        switch( opt ){

            case 1:

                //show messages
                const term   = await readInput('city: ');
                
                // Find the places
                const places = await searchs.city( term );
                
                // Select the place
                const id          = await listPlaces( places );
                if( id === '0' ) continue;

                const placeSelect = places.find( place => place.id === id );

                // Save in DB
                searchs.addHistory( placeSelect.name );

                // weather
                const weather = await searchs.weatherPlace( placeSelect.lat, placeSelect.lng );
                
                // show results
                console.clear();
                console.log('\nInformation of the city\n'.green);
                console.log('City:', placeSelect.name.green );
                console.log('Lng:',  placeSelect.lng );
                console.log('Lat:',  placeSelect.lat );
                console.log('Temperature:', weather.temp );
                console.log('Minimum:', weather.min );
                console.log('Maximum:', weather.max );
                console.log('Weather conditions:', weather.desc.green );

            break;

            case 2:

                // searchs.history.forEach( ( place, i ) => {
                searchs.historyCapitalized.forEach( ( place, i ) => {

                    const idx = `${ i + 1 }.`.green;
                    console.log( `${ idx } ${ place }` );

                })
            
            break;


        }

        if( opt !== 0 ) await pause();
        
    } while ( opt !== 0 );

}

main();
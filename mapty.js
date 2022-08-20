'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];




class Workout {
    date = new Date();
    id = (Date.now() + '').slice(-10);

    constructor(coords, distance, duration) {
        this.coords = coords;
        this.distance = distance;
        this.duration = duration;
    }
}

class Running extends Workout {
    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration)
        this.cadence = cadence;
        this.calcPace();
    }

    calcPace() {
        this.pace = this.duration/this.distance;
        return this.pace;
    }

}

class Cycling extends Workout {
    constructor(coords, distance, duration, elevationGain) {
        super(coords, distance, duration)
        this.elevationGain = elevationGain; 
        this.calcSpeed();
    }
    calcSpeed() {
        this.speed = this.distance/(this.duration/60);
        return this.speed;
    }

}
// const run1 = new Running([39, -12], 5.2, 24, 178);
// const cycling1 = new Cycling([39, -12], 27, 95, 578);
// console.log(run1, cycling1)

//Application Architecture

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation')
class App{
    #map; 
    #mapEvent;
    constructor() {
        this._getPosition();
        form.addEventListener('submit', this._newWorkout.bind(this))
        
        inputType.addEventListener('change', this._toggleElevationField)
    }

    _getPosition() {
        if(navigator.geolocation)
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function() {
                alert('could not get your position');
            })
        
    } 

    _loadMap(position) {
            const {latitude} = position.coords;
            const {longitude} = position.coords;
            console.log(`https://www.google.com/maps/@${latitude},${longitude},15z`);
            const coords = [latitude, longitude];
             this.#map = L.map('map').setView(coords, 13);
    
            L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.#map);
            
            
    
            this.#map.on('click', this._showForm.bind(this))
        }

    _showForm(mapE) {
        this.#mapEvent = mapE;
        form.classList.remove('hidden');
        inputDistance.focus();
    
    } 

    _toggleElevationField() {
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    } 

    _newWorkout(e) {
        const validInputs = (...inputs) => inputs.every(inp => Number.isFinite(inp));
        const allPositive = (...inputs) => inputs.every(inp =>inp > 0)
        
        e.preventDefault();

        const type = inputType.value;
        const distance = +inputDistance.value;
        const duration = +inputDuration.value;

        if(type === 'running') {
            const cadence = inputCadence.value;
            if(/*!Number.isFinite(distance)|| !Number.isFinite(duration)|| !Number.isFinite(cadence)*/ !validInputs(distance, duration, cadence)|| !allPositive(distance, duration, cadence)) return alert('Inputs have to be positive number');

        }
        if(type === 'cycling') {
            const elevation = inputElevation.value;
            if(/*!Number.isFinite(distance)|| !Number.isFinite(duration)|| !Number.isFinite(cadence)*/ !validInputs(distance, duration, elevation)|| !allPositive(distance, duration)) return alert('Inputs have to be positive number');

        }
        //clear input field
        
        
            //console.log(this.#mapEvent);
                    const {lat, lng} = this.#mapEvent.latlng;
        
                    L.marker({lat, lng}).addTo(this.#map)
                    .bindPopup(L.popup({
                        maxWidth: 250,
                        minWidth: 100,
                        autoClose: false, 
                        closeOnClick: false,
                        className: 'running-popup'
                    }))
                    .setPopupContent('Workout')
                    .openPopup();
                    inputDistance.value= inputCadence.value  = inputDuration.value  = inputElevation.value = '';
    }
}

const app = new App();



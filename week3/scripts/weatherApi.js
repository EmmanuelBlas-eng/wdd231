const currentTemp = document.querySelector('#current-temp');
const weatherIcon = document.querySelector('#weather-icon');
const captionDesc = document.querySelector('figcaption');



const apiKey = 'cc50dea41789f5172d4fcb652f4e2b14';
const lat = '49.75';
const lon = '6.64';

const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

async function apiFetch(){
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            displayresult(data);
        } else {
            throw Error (await response.text());
        }
    } catch (error){
        console.log(error);
    }
}


function displayresult(data) {
    currentTemp.innerHTML = `${data.main.temp.toFixed(0)}&deg;F`;


    const iconcode = data.weather[0].icon;
    const iconsrc = `https://openweathermap.org/img/wn/${iconcode}@2x.png`;

    let desc = data.weather[0].description;

    weatherIcon.setAttribute('src', iconsrc);
    weatherIcon.setAttribute('alt', desc);
    captionDesc.textContent = `${desc}`;
}

apiFetch();
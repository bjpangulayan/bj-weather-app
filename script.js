// const PIXABAY_API_KEY = '43730897-75789e447f4fce7bddaa4c488';

// // Function to fetch city image from Pixabay
// function fetchCityImage(city) {
//     const apiUrl = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(city)}&image_type=photo&orientation=horizontal&safesearch=true&per_page=1`;

//     fetch(apiUrl)
//         .then(response => response.json())
//         .then(data => {
//             if (data.hits.length > 0) {
//                 document.body.style.backgroundImage = `url(${data.hits[0].webformatURL})`;
//             } else {
//                 console.log('No images found for the specified city.');
//             }
//         })
//         .catch(error => {
//             console.error('Error fetching image from Pixabay:', error);
//         });
// }

// Event listener for form submission

const UNSPLASH_ACCESS_KEY = '77yWELf5lOKLk00J-OCAB_2vDLo2jvZE5EoIjhyorUU';

function fetchCityImage(city) {
    const apiUrl = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(city)}&client_id=${UNSPLASH_ACCESS_KEY}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.urls && data.urls.full) {
                document.body.style.backgroundImage = `url(${data.urls.full})`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundPosition = 'center';
            } else {
                console.log('No images found for the specified city.');
            }
        })
        .catch(error => {
            console.error('Error fetching image from Unsplash:', error);
        });
}
document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const city = document.getElementById('cityInput').value;
    fetchWeather(city);
 fetchCityImage(city);
});

document.querySelectorAll('input[name="unit"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const city = document.getElementById('cityInput').value;
        if (city) {
            fetchWeather(city);
             fetchCityImage(city);
        }
    });
});

// document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?" + city + "')";

function getSelectedUnit() {
    return document.querySelector('input[name="unit"]:checked').value;
}

function fetchWeather(city) {
    const unit = getSelectedUnit();
    const apiKey = 'f1a7f601f87c9d97579ef8237cc83ff1';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}`;

    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        const forecast = data.list.reduce((acc, item) => {
            const date = item.dt_txt.split(' ')[0];
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(item);
            return acc;
        }, {});

        displayForecast(forecast);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

function displayForecast(forecast) {
    const forecastContainer = document.getElementById('forecast');
    const unit = getSelectedUnit();
    const unitSymbol = unit === 'metric' ? '°C' : '°F';
    forecastContainer.innerHTML = '';

    for (const date in forecast) {
        const dayForecast = forecast[date];
        const minTemp = Math.min(...dayForecast.map(item => item.main.temp_min));
        const maxTemp = Math.max(...dayForecast.map(item => item.main.temp_max));
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        const iconUrl = `https://openweathermap.org/img/w/${dayForecast[0].weather[0].icon}.png`;
        dayElement.innerHTML = `
            <div>${new Date(dayForecast[0].dt * 1000).toDateString()}</div>
            <img src="${iconUrl}" alt="${dayForecast[0].weather[0].description}">
            <div>Min Temp: ${minTemp}${unitSymbol}</div>
            <div>Max Temp: ${maxTemp}${unitSymbol}</div>
        `;
        dayElement.addEventListener('click', function() {
            displayWeatherInfo(dayForecast);
        });
        forecastContainer.appendChild(dayElement);
    }
}



function displayWeatherInfo(weatherData) {
    const weatherInfoContainer = document.getElementById('weatherInfo');
    const unit = getSelectedUnit();
    const unitSymbol = unit === 'metric' ? '°C' : '°F';
    weatherInfoContainer.innerHTML = '';

    weatherData.forEach(item => {
        const weatherElement = document.createElement('div');
        const time = new Date(item.dt * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const temperature = item.main.temp;
        const description = item.weather[0].description;
        const clouds = item.clouds.all;
        const windSpeed = item.wind.speed;
        const visibility = item.visibility / 1000; // Convert visibility to kilometers
        const iconUrl = `https://openweathermap.org/img/w/${item.weather[0].icon}.png`;

        weatherElement.innerHTML = `
            <div>${time}</div>
            <img src="${iconUrl}" alt="${description}">
            <div>Temperature: ${temperature}${unitSymbol}</div>
            <div>Description: ${description}</div>
            <div>Clouds: ${clouds}%</div>
            <div>Wind Speed: ${windSpeed} m/s</div>
            <div>Visibility: ${visibility} km</div>
        `;
        weatherInfoContainer.appendChild(weatherElement);
    });

    weatherInfoContainer.classList.remove('hide');
}





// --- LIVE DATE, TIME & WEATHER WIDGET ---
 document.addEventListener('DOMContentLoaded', () => {
    const dateEl = document.getElementById('widget-date');
    const timeEl = document.getElementById('widget-time');
    const tempEl = document.getElementById('widget-temp');
    const iconEl = document.getElementById('widget-weather-icon');

    if (!dateEl || !timeEl) return;

    // 1. Live Clock
    function updateClock() {
        const now = new Date();
        
        // Date format: Wed, Oct 7
        const dateOptions = { weekday: 'short', month: 'short', day: 'numeric' };
        dateEl.textContent = now.toLocaleDateString('en-US', dateOptions);

        // Time format: 06:35:12 PM
        timeEl.textContent = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    }

    updateClock();
    setInterval(updateClock, 1000);

   // 2. OpenWeatherMap Weather Icon Mapper
    function getWeatherIcon(iconCode) {
    const isNight = iconCode.endsWith('n');

    if (iconCode.startsWith('01')) return isNight ? '🌙' : '☀️'; // clear sky
    if (iconCode.startsWith('02') || iconCode.startsWith('03')) return isNight ? '☁️' : '🌤️'; // clouds
    if (iconCode.startsWith('04')) return '☁️'; // broken/overcast clouds
    if (iconCode.startsWith('09') || iconCode.startsWith('10')) return isNight ? '🌧️' : '🌧️'; // rain (can use 🌧️ or add a night rain variant if preferred)
    if (iconCode.startsWith('11')) return '⛈️'; // thunderstorm
    if (iconCode.startsWith('13')) return '❄️'; // snow
    if (iconCode.startsWith('50')) return '🌫️'; // mist/fog
    return isNight ? '🌙' : '🌤️';
}


    //3. Fetch Live Weather
   
    const apiKey = 'cc50dea41789f5172d4fcb652f4e2b14'
    const lat = 17.6131; // Tuguegarao, Cagayan
    const lon = 121.7270;
    const url = (`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);

    async function fetchWeather() {
        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();

                const temp = Math.round(data.main.temp);
                const iconCode = data.weather[0].icon;

                tempEl.textContent = `${temp}°C`;
                iconEl.textContent = getWeatherIcon(iconCode);
            } else {
                throw new Error(await response.text());
            }
        } catch (error) {
            console.log("Weather Fetch Error:", error);
            tempEl.textContent = '33°C'; // Fallback display
            iconEl.textContent = '☀️';
        }
    }

    fetchWeather();
    setInterval(fetchWeather, 600000); // Refresh weather every 10 minutes
});
    





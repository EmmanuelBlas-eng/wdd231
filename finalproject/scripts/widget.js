


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

    // 2. Weather WMO Code to Icon Mapping
    function getWeatherIcon(code) {
        if (code === 0) return '☀️'; // Clear
        if (code >= 1 && code <= 3) return '🌤️'; // Partly cloudy
        if (code >= 45 && code <= 48) return '🌫️'; // Fog
        if (code >= 51 && code <= 67) return '🌧️'; // Drizzle / Rain
        if (code >= 80 && code <= 82) return '🌦️'; // Showers
        if (code >= 95) return '⛈️'; // Thunderstorm
        return '☀️';
    }

    // 3. Fetch Live Weather via Open-Meteo API
    async function fetchWeather() {
        try {
            const lat = 17.6132; // Tuguegarao, Cagayan
            const lon = 121.7270;
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
            if (!res.ok) throw new Error(`Weather request failed with status ${res.status}`);

            const data = await res.json();

            if (!data.current_weather) throw new Error('Weather data is unavailable.');

            const temp = Math.round(data.current_weather.temperature);
            const code = data.current_weather.weathercode;

            tempEl.textContent = `${temp}°C`;
            iconEl.textContent = getWeatherIcon(code);
        } catch (err) {
            tempEl.textContent = '29°C'; // Fallback display
            iconEl.textContent = '🌤️';
        }
    }

    fetchWeather();
    setInterval(fetchWeather, 600000); // Refresh weather every 10 minutes
});


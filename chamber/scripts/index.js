document.addEventListener("DOMContentLoaded", () => {
    // 1. Navigation Hamburger Toggle
    const menuBtn = document.getElementById("hamburger-menu");
    const nav = document.getElementById("primary-nav");

    if (menuBtn && nav) {
        menuBtn.addEventListener("click", () => {
            nav.classList.toggle("open");
            menuBtn.classList.toggle("open");
            const isOpen = nav.classList.contains("open");
            menuBtn.setAttribute("aria-expanded", isOpen);
            menuBtn.innerHTML = isOpen ? "&#10005;" : "&#9776;";
        });
    }

    // 2. Footer Dates
    const currentYearEl = document.getElementById("currentyear");
    const lastModifiedEl = document.getElementById("lastModified");

    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }
    if (lastModifiedEl) {
        lastModifiedEl.textContent = `Last Modification: ${document.lastModified}`;
    }

    // 3. OpenWeatherMap API Setup (Allacapan, Cagayan, PH: Lat 18.08, Lon 121.55)
    const apiKey = "cc50dea41789f5172d4fcb652f4e2b14"; // Replace with your OpenWeatherMap API key
    const lat = "18.0833";
    const lon = "121.5500";
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    async function fetchWeather() {
        try {
            const currentResponse = await fetch(currentWeatherUrl);
            const forecastResponse = await fetch(forecastUrl);

            if (currentResponse.ok && forecastResponse.ok) {
                const currentData = await currentResponse.json();
                const forecastData = await forecastResponse.json();
                displayWeather(currentData);
                displayForecast(forecastData);
            } else {
                displayFallbackWeather();
            }
        } catch (error) {
            console.error("Error fetching weather data:", error);
            displayFallbackWeather();
        }
    }

    function displayWeather(data) {
        const weatherDiv = document.getElementById("weather-current");
        const temp = Math.round(data.main.temp);
        const desc = data.weather[0].description;
        const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        weatherDiv.innerHTML = `
            <div class="weather-info">
                <img src="${icon}" alt="${desc}" width="50" height="50">
                <p><strong>${temp}°C</strong> - <span style="text-transform: capitalize;">${desc}</span></p>
            </div>
            <p>Humidity: ${data.main.humidity}% | Wind: ${Math.round(data.wind.speed)} m/s</p>
        `;
    }

    function displayForecast(data) {
        const forecastDiv = document.getElementById("weather-forecast");
        forecastDiv.innerHTML = "";

        // OpenWeatherMap 5-day forecast returns 3-hour intervals. Pick one sample daily around noon (12:00:00).
        const dailyForecasts = data.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 3);

        dailyForecasts.forEach(day => {
            const date = new Date(day.dt * 1000);
            const dayName = date.toLocaleDateString("en-US", { weekday: "short", month: "numeric", day: "numeric" });
            const temp = Math.round(day.main.temp);
            const desc = day.weather[0].description;

            const dayElement = document.createElement("div");
            dayElement.classList.add("forecast-day");
            dayElement.innerHTML = `
                <p class="day-title"><strong>${dayName}</strong></p>
                <p>${temp}°C</p>
                <p class="desc">${desc}</p>
            `;
            forecastDiv.appendChild(dayElement);
        });
    }

    function displayFallbackWeather() {
        const weatherDiv = document.getElementById("weather-current");
        const forecastDiv = document.getElementById("weather-forecast");

        weatherDiv.innerHTML = `
            <p><strong>29°C</strong> - Scattered Clouds</p>
            <p>Humidity: 78% | Wind: 3 m/s</p>
        `;

        forecastDiv.innerHTML = `
            <div class="forecast-day"><p class="day-title"><strong>Tomorrow</strong></p><p>30°C</p><p class="desc">Sunny</p></div>
            <div class="forecast-day"><p class="day-title"><strong>In 2 Days</strong></p><p>28°C</p><p class="desc">Rain Showers</p></div>
            <div class="forecast-day"><p class="day-title"><strong>In 3 Days</strong></p><p>29°C</p><p class="desc">Partly Cloudy</p></div>
        `;
    }

    // 4. Random Member Spotlights Fetching (Gold=3, Silver=2)
    async function loadSpotlights() {
        const container = document.getElementById("spotlights-container");
        try {
            const response = await fetch("../chamber/data/members.json");
            if (!response.ok) throw new Error("Could not load members JSON.");

            const members = await response.json();

            // Filter for Gold (3) and Silver (2) members only
            const qualifiedMembers = members.filter(member => member.membership === 2 || member.membership === 3);

            // Shuffle members array randomly
            const shuffled = qualifiedMembers.sort(() => 0.5 - Math.random());

            // Pick 2 to 3 members
            const selectedCount = Math.floor(Math.random() * 2) + 2; // Returns 2 or 3
            const selectedMembers = shuffled.slice(0, selectedCount);

            displaySpotlights(selectedMembers, container);
        } catch (error) {
            console.error("Error loading member spotlights:", error);
            container.innerHTML = "<p>Unable to load spotlights right now.</p>";
        }
    }

    function displaySpotlights(members, container) {
        container.innerHTML = "";

        members.forEach(member => {
            const card = document.createElement("div");
            card.classList.add("spotlight-card");

            const levelLabel = member.membership === 3 ? "Gold Member" : "Silver Member";
            const domain = member.website.replace("https://", "").replace("http://", "").replace("www.", "").split('/')[0];

            card.innerHTML = `
                <div class="spotlight-header">
                    <h3>${member.name}</h3>
                    <span class="membership-badge badge-${member.membership}">${levelLabel}</span>
                </div>
                <div class="spotlight-body">
                    <div class="image-box">
                        <img src="${member.image}" alt="${member.name} Logo" loading="lazy">
                    </div>
                    <div class="card-info">
                        <p class="tagline"><em>"${member.tagline}"</em></p>
                        <p><strong>Phone:</strong> ${member.phone}</p>
                        <p><strong>Address:</strong> ${member.address}</p>
                        <p><strong>URL:</strong> <a href="${member.website}" target="_blank" rel="noopener">${domain}</a></p>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    // Execute API & Data Fetch
    fetchWeather();
    loadSpotlights();
});
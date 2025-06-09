document.getElementById('weatherForm').addEventListener('submit', async function(e) {
    e.preventDefault();
  
    const cityInput = document.getElementById('city');
    const city = cityInput.value.trim();
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    const forecastDiv = document.getElementById('forecastResult');
    const cityError = document.getElementById('cityError');
  
    forecastDiv.innerHTML = '';
    cityError.textContent = '';
    cityInput.classList.remove('is-invalid');
  
    if (!city) {
      cityInput.classList.add('is-invalid');
      cityError.textContent = 'Please fill in city name';
      return;
    }
  
    if (isNaN(startDate) || isNaN(endDate) || endDate < startDate) {
      forecastDiv.innerHTML = '<div class="alert alert-danger">Please provide a valid date range.</div>';
      return;
    }
  
    const diffDays = Math.min(3, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1);
    const apiKey = '4e1e8413a26c45d698b54241250506';
    const url = `https://api.weatherapi.com/v1/forecast.json?q=${encodeURIComponent(city)}&days=${diffDays}&key=${apiKey}`;
  
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Invalid city or API error');
      const data = await res.json();
  
      // Fuzzy match check
      if (!data.location || !data.location.name.toLowerCase().includes(city.toLowerCase())) {
        throw new Error('City not matched');
      }
  
      if (!data.forecast || !data.forecast.forecastday) {
        throw new Error('Invalid forecast data');
      }
  
      data.forecast.forecastday.forEach(day => {
        const weatherHtml = `
          <div class="weather-card">
            <h5>${day.date}</h5>
            <img src="${day.day.condition.icon}" alt="Weather icon">
            <p>${day.day.condition.text}</p>
            <p><strong>High:</strong> ${day.day.maxtemp_c}&deg;C | <strong>Low:</strong> ${day.day.mintemp_c}&deg;C</p>
            <p><strong>Humidity:</strong> ${day.day.avghumidity}%</p>
            <p><strong>Sunrise:</strong> ${day.astro.sunrise} | <strong>Sunset:</strong> ${day.astro.sunset}</p>
          </div>
        `;
        forecastDiv.innerHTML += weatherHtml;
      });
    } catch (error) {
      cityInput.classList.add('is-invalid');
      cityError.textContent = 'Incorrect city name';
    }
  });
  
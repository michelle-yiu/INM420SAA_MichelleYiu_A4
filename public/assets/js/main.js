document.getElementById('weatherForm').addEventListener('submit', async function (e) {
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

  const today = new Date();
  const minStartDate = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);

  if (
    isNaN(startDate) ||
    isNaN(endDate) ||
    endDate < startDate ||
    startDate < minStartDate
  ) {
    forecastDiv.innerHTML = '<div class="alert alert-danger">Please select a valid date range starting at least 14 days from today.</div>';
    return;
  }

  const apiKey = '4e1e8413a26c45d698b54241250506';
  const msInDay = 24 * 60 * 60 * 1000;
  const totalDays = Math.min(14, Math.floor((endDate - startDate) / msInDay) + 1);

  try {
    for (let i = 0; i < totalDays; i++) {
      const currentDate = new Date(startDate.getTime() + i * msInDay);
      const dt = currentDate.toISOString().split('T')[0];
      const url = `https://api.weatherapi.com/v1/future.json?q=${encodeURIComponent(city)}&dt=${dt}&key=${apiKey}`;

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok || !data.forecast?.forecastday || !data.location?.name.toLowerCase().includes(city.toLowerCase())) {
        throw new Error('Invalid city or data');
      }

      const day = data.forecast.forecastday[0];
      forecastDiv.innerHTML += `
        <div class="col-md-4">
          <div class="weather-card h-100">
            <h5>${day.date}</h5>
            <img src="${day.day.condition.icon}" alt="Weather icon">
            <p>${day.day.condition.text}</p>
            <p><strong>High:</strong> ${day.day.maxtemp_c}&deg;C | <strong>Low:</strong> ${day.day.mintemp_c}&deg;C</p>
            <p><strong>Humidity:</strong> ${day.day.avghumidity}%</p>
            <p><strong>Sunrise:</strong> ${day.astro.sunrise} | <strong>Sunset:</strong> ${day.astro.sunset}</p>
          </div>
        </div>
      `;
    }
  } catch (error) {
    cityInput.classList.add('is-invalid');
    cityError.textContent = 'Incorrect city name';
  }
});

var res

function convertTemp (to, from) {
  if (to === 'K') return from               // If Kelvin, just return it
  else if (to === 'C') return from - 273.15 // If Celsius, calculate and return Celsius, simple enough
  else from *= 1.8                          // Both Rankine and Fahrenheit multiply Kelvin by 1.8
  if (to === 'F') return from - 459.67      // If Fahrenheit, calculate and return Fahrenheit..
  else return from                          // otherwise, return Rankine
}

function decimalRound (dp, num) {
  return Math.round(num * (Math.pow(10, dp))) / Math.pow(10, dp)
}

function getTemp (unit, dp, temperature) {
  // Convert to correct unit and round to correct decimal points
  return decimalRound(dp, convertTemp(unit, temperature))
}

function setTemp (temperature, unit = 'C', dp = 2) {
  window.temp.innerHTML = getTemp(unit, dp, temperature) + '°' + unit
}

function getCond (conditions, id) {
  var prefix = ''

  // Determine the appropriate prefix based on weather ids found here:
  // http://bugs.openweathermap.org/projects/api/wiki/Weather_Condition_Codes
  if (id >= 200 && id <= 399 ||
      id === 781 ||
      id >= 900 && id <= 902 ||
      id >= 952 && id <= 956 ||
      id >= 958 && id <= 962) prefix = 'there is a'
  else if (id >= 500 && id <= 721 ||
           id >= 741 && id <= 761 ||
           id === 906 || id === 957) prefix = 'there is'
  else if (id === 731 || id === 771 ||
           id >= 802 && id <= 804) prefix = 'there are'
  else if (id === 800) prefix = 'the'
  else if (id === 801) prefix = 'there are a'
  else if (id >= 903 && id <= 905 ||
           id === 950 || id === 951) prefix = "it's"

  return prefix + ' ' + conditions.toLowerCase()
}

function setCond (weather) {
  window.cond.innerHTML = getCond(weather.description, weather.id)
}

function cycleUnit () {
  switch (window.temp.innerHTML.split('°')[1]) {
    case 'C': setTemp(res.main.temp, 'F'); break
    case 'F': setTemp(res.main.temp, 'K'); break
    case 'K': setTemp(res.main.temp, 'R'); break
    case 'R': setTemp(res.main.temp, 'C'); break
  }
}

var req = new window.XMLHttpRequest()
req.addEventListener('load', () => {
  res = JSON.parse(req.responseText)

  setTemp(res.main.temp)
  setCond(res.weather[0])
})

document.addEventListener('DOMContentLoaded', () => {
  // Get the users geolocation
  navigator.geolocation.getCurrentPosition((pos) => {
    var [lat, lon] = [pos.coords.latitude, pos.coords.longitude]

    // Complete the Ajax request to OpenWeatherMap with user geolocation and send
    req.open('GET', `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}`, true)
    req.send()
  })

  // Click on the temperature to change unit of measurement
  window.temp.addEventListener('click', cycleUnit)
})

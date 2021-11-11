import './App.css';
import { TextField } from "@material-ui/core";
import { Autocomplete } from '@material-ui/lab';
import { useEffect, useState } from 'react';

const App = () => {
  const locations = require("./city.list.min.json");
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState();
  const [weather, setWeather] = useState({});

  useEffect(() => {
    locations.map( l => {
      l.description = `${l.name.toUpperCase()}${l.state ? `, ${l.state}` : ""}, ${l.country}`;
      return l;
    })
  }, []);

  

  useEffect(() => {
    if (city) {
      fetch(`https://api.openweathermap.org/data/2.5/weather?id=${city.id}&units=metric&appid=1211d45e585bfdff14b2750c8f7fdfd0`)
      .then(response => response.json())
      .then(result => {
        setWeather({
          temperature: result.main.temp,
          description: result.weather[0].description,
          icon: result.weather[0].icon,
          pressure: result.main.pressure,
          humidity: result.main.humidity,
          feelsLike: result.main.feels_like,
          

        });
      })
      .catch( e => console.log("Error: ", e));
    }
  }, [city]);

  return <div>
    <Autocomplete
  className = "search"
  freeSolo
  options={cities}
  onSelect = { e =>{
    const value = e.target.value.toUpperCase();
    if ( value.length >= 3) {
      const possibleLocations = locations.filter( l => l.description.includes(value))
      .slice(0, 10);
      setCities(possibleLocations.map( l => l.description));

      const selected = locations.find( l => l.description === value)
      setCity(selected);
    }
  }}
  renderInput={(params) => <TextField {...params} placeholder="search" variant = "outlined" />}
/>
<div hidden = {!weather.temperature}>
  <div className = "temperature" 
  style = {{color: weather.temperature <= 0 ? "purple" : "yellow"}}>
    {weather.temperature}
    <span>&#176;C</span>

  </div>
  <div className = "feelsLike">
   Feels like: {weather.feelsLike}
  </div>
  <hr />
  <div className = "description">
    {weather.description}
    <img alt="weather-icon" src = {`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} />
</div>
<div className = "pressure">
  Air pressure: {weather.pressure}
</div>
<div className = "humidity">
Humidity: {weather.humidity}
</div>

  

</div>
  </div>
}

export default App;

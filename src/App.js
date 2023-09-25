import React, {useEffect, useState} from "react";
import clear_icon from "../src/assets/Clear.png"
import cloud_back from "../src/assets/Cloud-background.png"
import hail from "../src/assets/Hail.png"
import heavy_cloud from "../src/assets/HeavyCloud.png"
import heavy_rain from "../src/assets/HeavyRain.png"
import ligth_cloud from "../src/assets/LightCloud.png"
import ligth_rain from "../src/assets/LightRain.png"
import shower from "../src/assets/Shower.png"
import snow from "../src/assets/Snow.png"
import thunderstorm from "../src/assets/Thunderstorm.png"


const api = {
    key: "efa091327e4232e09feff5cc38228316",
    base: "https://api.openweathermap.org/data/2.5"
}


const weatherImages = {
    Clear: clear_icon,
    Hail: hail,
    Clouds: heavy_cloud,
    Rain: heavy_rain,
    LightCloud: ligth_cloud,
    Drizzle: ligth_rain,
    Mist: shower,
    Snow: snow,
    Thunderstorm: thunderstorm
}

function App() {
    const [query, setQuery] = useState('');
    const [data, setData] = useState(null)

    const getImageWeather = (condition) => {
        return weatherImages[condition] || clear_icon;
    }


    const queryOnChange = (event) => {
        setQuery(event.target.value)
    }

    const search = async () => {
        if (query === "") {
            alert("Campo de pesquisa vazio")
            return
        }

        try {
            const weatherResponse = await getWeather(query)
            const weatherForecastResponse = await getWeatherForecast(weatherResponse.coord.lat, weatherResponse.coord.lon)
            const formattedData = {
                wind: weatherResponse.wind,
                humidity: weatherResponse.main.humidity,
                visibility: weatherResponse.visibility,
                airPressure: weatherResponse.main.pressure,
                weather: {
                    ...weatherResponse.main,
                    ...weatherResponse.weather[0],
                    name: weatherResponse.name
                }

            }
            setData(formattedData)
            console.log(weatherForecastResponse)

        } catch {
            setData(null)
        }
    };

    const getWeatherForecast = async (latitude, longitude) => {
        return fetch(`${api.base}/onecall?lat=${latitude}&lon=${longitude}&exclude=current,hourly&units=metric&lang=pt_br&appid=${api.key}`).then(res => res.json());
    }

    const getWeather = async (query) => {
        return fetch(`${api.base}/weather?q=${query}&units=metric&appid=${api.key}&lang=pt_br`)
            .then((res) => res.json())
    }
    const showPosition = (position) => {
        fetchData(position.coords);
        console.log(position)
    }


    const fetchData = async (coords) => {


        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${api.key}`);
            const responseData = await response.json();
            console.log(responseData)
        } catch (error) {
            console.error('Erro ao buscar dados de clima:', error);
        }
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    }


    const dateBuilder = (d) => {
        let months = ["January", "February", "March", "April", "May", "June", "July", "August",
            "September", "October", "November", "December"];
        let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        let day = days[d.getDay()];
        let date = d.getDate();
        let month = months[d.getMonth()];
        let year = d.getFullYear();

        return `${day} ${date} ${month} ${year}`
    }
    useEffect(() => {
        setData(null)
    }, [])


    return (


        <main className="app">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-3">
                        <div className="left">
                            <div className="top-bar d-flex justify-content-between">
                                <input type="text" placeholder="Escolha uma cidade" onChange={queryOnChange}
                                       value={query}/>
                                <button className="search" onClick={search}>Search</button>
                                <form className="pessoal-location">
                                    <button onClick={getCurrentLocation} className="my-location" type="button">
                    <span className="material-icons">
                      my_location
                    </span>
                                    </button>
                                </form>
                            </div>
                            <div className="w-100 d-flex images-left">
                                <img id="cloud" alt="imagem de nuvens no fundo" src={cloud_back}/>
                                {data ? (<img id="weather-image" alt="Imagem relacionada a previsão do tempo"
                                              src={getImageWeather(data.weather.main)}/>) : null}


                            </div>
                            {data ? (
                                <div>
                                    <div className="weather-box">
                                        <div className="temp">
                                            {Math.round(data.weather.temp)} ºC
                                        </div>
                                        <div className="weather">{data.weather.main}</div>
                                    </div>
                                    <div className="location-box">
                                        <div className="date">{dateBuilder(new Date())}</div>
                                        <div className="location">{data.weather.name}</div>
                                    </div>
                                </div>

                            ) : null}
                        </div>

                    </div>
                    <div id="right" className="col-lg-9">
                        {data ? (
                            <>
                                <div className="selector">
                                    <button className="celsius">°C</button>
                                    <button className="fahrenheit">°F</button>
                                </div>
                                <div className="cards">
                                    <div className="weekly-card">
                                        <h3 className="cardTitle"> Today </h3>
                                        <img className="weather-image-card" alt="Imagem relacionada a previsão do tempo"
                                             src={getImageWeather(data.weather.main)}/>
                                        <div className="row min-max">
                                            <div className="col-6">
                                                <p>{Math.floor(data.weather.temp_min)}°C</p>
                                            </div>
                                            <div className="col-6">
                                                <p>{Math.floor(data.weather.temp_max)}°C</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="weekly-card">
                                        <h3> Sun </h3>
                                        <img src={heavy_cloud} alt="imagem relacionada ao clima"/>
                                        <div className="row min-max">
                                            <div className="col-6">
                                                <p>22°C</p>
                                            </div>
                                            <div className="col-6">
                                                <p>26°C</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="weekly-card">
                                        <h3> Mon </h3>
                                        <img src={heavy_rain} alt="imagem relacionada ao clima"/>
                                        <div className="row min-max">
                                            <div className="col-6">
                                                <p>20°C</p>
                                            </div>
                                            <div className="col-6">
                                                <p>25°C</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="weekly-card">
                                        <h3> Tue </h3>
                                        <img src={ligth_cloud} alt="imagem relacionada ao clima"/>
                                        <div className="row min-max">
                                            <div className="col-6">
                                                <p>30°C</p>
                                            </div>
                                            <div className="col-6">
                                                <p>34°C</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="weekly-card">
                                        <h3> Wed </h3>
                                        <img src={ligth_rain} alt="imagem relacionada ao clima"/>
                                        <div className="row min-max">
                                            <div className="col-6">
                                                <p>16°C</p>
                                            </div>
                                            <div className="col-6">
                                                <p>24°C</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <h1 className="highlights-title">Today`s Hightlights</h1>
                                <div className="row highlights-container">
                                    <div className="col-6 ">
                                        <div className="highlights-card">
                                            <p>Wind status</p>
                                            <h5>{data.wind.speed} mph</h5>
                                            <p>{data.wind.deg}°</p>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="highlights-card">
                                            <p>Humidity</p>
                                            <h5>{data.humidity}%</h5>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="highlights-card">
                                            <p>Visibility</p>
                                            <h5>{data.visibility}miles</h5>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="highlights-card">
                                            <p>Air Pressure</p>
                                            <h5>{data.airPressure}mb</h5>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : null}
                    </div>
                </div>
            </div>
        </main>
    );
}

export default App;

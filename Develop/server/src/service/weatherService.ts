import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  latitude: number;
  longitude: number;
}

// TODO: Define a class for the Weather object
class Weather {
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  description: string;

  constructor(
    temperature: number,
    humidity: number,
    pressure: number,
    windSpeed: number,
    description: string
  ) {
    this.temperature = temperature;
    this.humidity = humidity;
    this.pressure = pressure;
    this.windSpeed = windSpeed;
    this.description = description;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  cityName: string;
  private async fetchLocationData(query: string): Promise<any> {
    const response = await fetch(`${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`);
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }
    return response.json();
  }

  private destructureLocationData(locationData: any[]): Coordinates {
    if (locationData.length === 0) {
      throw new Error('No location data found');
    }
    const { lat, lon } = locationData[0];
    return { latitude: lat, longitude: lon };
  }



  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}&units=metric`;
  }

  private async fetchAndDestructureLocationData(cityName: string): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(cityName);
    return this.destructureLocationData(locationData);
  }

  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    return response.json();
  }

  private parseCurrentWeather(response: any): Weather {
    const { main, wind, weather } = response;
    return new Weather(
      main.temp,
      main.humidity,
      main.pressure,
      wind.speed,
      weather[0].description
    );
  }

  private buildForecastArray(_currentWeather: Weather, weatherData: any[]): Weather[] {
    return weatherData.map((data: any) => {
      const { main, wind, weather } = data;
      return new Weather(
        main.temp,
        main.humidity,
        main.pressure,
        wind.speed,
        weather[0].description
      );
    });
  }

  async getWeatherForCity(city: string): Promise<Weather> {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    this.buildForecastArray(currentWeather, [weatherData]); // Example usage
    return currentWeather;
  }
  getWeatherData // private async fetchWeatherData(coordinates: Coordinates) {}
    () {
    throw new Error('Method not implemented.');
  }
  getWeatherByCityName(_cityName: any) {
    throw new Error('Method not implemented.');
  }
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private apiKey: string;
  // private cityName: string;

  constructor() {
    this.baseURL = process.env.WEATHER_API_BASE_URL || '';
    this.apiKey = process.env.WEATHER_API_KEY || '';
    this.cityName = '';
  }

}

export default new WeatherService();

import fs from 'fs'

// TODO: Define a City class with name and id properties
class City {
  name: string | undefined;
  id: number | undefined;
}
// TODO: Complete the HistoryService class
class HistoryService {
  async getSearchHistory(): Promise<City[]> {
    return await this.read();
  }
  async saveCityToHistory(cityName: string): Promise<void> {
    const cities = await this.read();
    const newCity = new City();
    newCity.name = cityName;
    newCity.id = cities.length ? cities[cities.length - 1].id! + 1 : 1;
    cities.push(newCity);
    await this.write(cities);
  }
  // TODO: Define a read method that reads from the searchHistory.json file
  // private async read() {}
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile('searchHistory.json', 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
      } else {
        throw error;
      }
    }
  };

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  // private async write(cities: City[]) {}
  private async write(cities: City[]): Promise<void> {
    try {
      await fs.writeFile('searchHistory.json', JSON.stringify(cities, null, 2), 'utf-8');
    } catch (error) {
      throw error;
    }
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  // async getCities() {}
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  // async addCity(city: string) {}
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}
}

export default new HistoryService();

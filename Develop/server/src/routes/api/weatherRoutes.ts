import { Router, Request, Response } from 'express';
const router = Router();

import historyService from '../../service/historyService';
import weatherService from '../../service/weatherService';


// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  const { cityName } = req.body;
  if (!cityName) {
    return res.status(400).json({ error: 'City name is required' });
  }

  try {
    
    const weatherData = await weatherService.getWeatherByCityName(cityName);

    
    await historyService.saveCityToHistory(cityName);

    return res.status(200).json(weatherData);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve weather data' });
  }
  // TODO: GET weather data from city name
  });

  router.get('/', async (req: Request, res: Response) => {
    console.info(`${req.method} request for weather data from city name`);
    try {
      const data = await weatherService.getWeatherData();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve weather data' });
    }
  })

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const history = await historyService.getSearchHistory();
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve search history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (_req, _res) => {});

export default router;

import axios from 'axios';
import cheerio from 'cheerio';
import Car from './models/Car'; 

interface Car {
  title: string;
  price: string;
  description: string;
  location: string;
  date: string;
  views: string;
  imageUrl: string;
}

export const scrapeKolesa = async (): Promise<Car[]> => {
  try {
    const response = await axios.get('https://kolesa.kz/cars/');
    const html = response.data;
    const $ = cheerio.load(html);

    const cars: Car[] = [];

    $('.a-list__item .a-card').each((index, element) => {
      const title = $(element).find('.a-card__title a').text().trim();
      const price = $(element).find('.a-card__price').text().trim().replace(/\s+/g, ' ');
      const description = $(element).find('.a-card__description').text().trim();
      const location = $(element).find('[data-test="region"]').text().trim();
      const date = $(element).find('.a-card__param--date').text().trim();
      const views = $(element).find('.a-card__views').text().trim();
      const imageUrl = $(element).find('.thumb-gallery__pic img').attr('src') || '';

      cars.push({ title, price, description, location, date, views, imageUrl });
    });

    return cars;
  } catch (error) {
    console.error('Error while scraping:', error);
    return [];
  }
};

export const analyzeChanges = async () => {
  const previousData = await Car.find();
  const currentData = await scrapeKolesa();

  const addedCars = currentData.filter(car => !previousData.some(prevCar => prevCar.title === car.title));
  const removedCars = previousData.filter(car => !currentData.some(currCar => currCar.title === car.title));

  
  await Car.deleteMany({});
  await Car.insertMany(currentData);

  return { addedCars, removedCars };
};

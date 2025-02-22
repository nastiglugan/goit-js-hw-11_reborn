import Notiflix from 'notiflix';
import axios from 'axios';

const API_KEY = '31809670-31bfe80d896ec33e492140936';
const BASE_URL = 'https://pixabay.com/api/';

const searchParams = new URLSearchParams({
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
});

async function fetchPhoto(request, page = 1) {
  const resp = await axios.get(
    `${BASE_URL}?key=${API_KEY}&${searchParams}&q=${request}&per_page=40&page=${page}`
  );

  return resp.data;
}

export { fetchPhoto };

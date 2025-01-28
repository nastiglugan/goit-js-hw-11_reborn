import { fetchPhoto } from './fetch';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');

let lightbox = new SimpleLightbox('.gallery-link', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

console.log(lightbox);

let currentPage = 1;
let currentSearch = '';

form.addEventListener('submit', onSearch);
loadBtn.addEventListener('click', onClick);

function onSearch(evt) {
  loadBtn.classList.add('disable');
  gallery.innerHTML = '';
  currentPage = 1;
  evt.preventDefault();

  const requestParam = evt.target.searchQuery.value.trim();
  currentSearch = requestParam;

  if (!requestParam) {
    Notiflix.Notify.warning('Please write some word!');
    return;
  }

  fetchPhoto(requestParam)
    .then(data => {
      if (!data.hits.length) {
        Notiflix.Notify.warning(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }

      gallery.insertAdjacentHTML('beforeend', creatMarkup(data.hits));

      const { totalHits } = data;
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

      const currentHits = currentPage * data.hits.length;
      console.log(totalHits, currentHits);

      if (totalHits <= currentHits) {
        Notiflix.Notify.warning(
          "We're sorry, but you've reached the end of search results."
        );
      } else {
        setTimeout(() => {
          loadBtn.classList.remove('disable');
        }, 1000);
      }
    })
    .catch(err =>
      Notiflix.Notify.failure('Ops, there is a problem here! Try again late!')
    );
  lightbox.refresh();
  form.reset();
}
// try {
//   const requestParam = evt.target.searchQuery.value.trim();
//   const searchImg = await fetchPhoto(requestParam);
//   gallery.insertAdjacentHTML('beforeend', creatMarkup(searchImg.hits));
// } catch (err) {
//   console.log(err);
// }

function onClick() {
  currentPage += 1;
  fetchPhoto(currentSearch, currentPage)
    .then(data => {
      gallery.insertAdjacentHTML('beforeend', creatMarkup(data.hits));

      // const { totalHits } = data;
    })
    .catch(err => console.log(err));
}

function creatMarkup(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="gallery-item">
  <a class="gallery-link" href="${largeImageURL}">
    <img class="gallery-image" src="${webformatURL}" alt="${tags}" loading="lazy" />
    <ul class="img-descr-list">
      <li>likes: ${likes}</li>
      <li>views: ${views}</li>
      <li>comments: ${comments}</li>
      <li>downloads: ${downloads}</li>
    </ul>
  </a>
</div>
`
    )
    .join('');
}

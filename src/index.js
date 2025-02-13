import { fetchPhoto } from './fetch';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const target = document.querySelector('.js-guard');

form.addEventListener('submit', onSearch);

let currentPage = 1;
let currentSearch = '';

const options = {
  root: null,
  rootMargin: '200px',
  threshold: 1.0,
};

let observer = new IntersectionObserver(onLoad, options);

let lightbox = new SimpleLightbox('.gallery-link', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

function onSearch(evt) {
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
      observer.observe(target);
      lightbox.refresh();
      scrollPage();

      const { totalHits } = data;
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

      const currentHits = currentPage * data.hits.length;

      if (totalHits <= currentHits) {
        Notiflix.Notify.warning(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(err => {
      Notiflix.Notify.failure(
        `Ops, there is a problem here! Try again late! ${err.statusText}`
      );
    })
    .finally(() => form.reset());
}

function onLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      currentPage += 1;
      fetchPhoto(currentSearch, currentPage)
        .then(data => {
          gallery.insertAdjacentHTML('beforeend', creatMarkup(data.hits));

          const { totalHits } = data;

          const currentHits = currentPage * data.hits.length;

          if (totalHits <= currentHits) {
            observer.unobserve(target);
            Notiflix.Notify.warning(
              "We're sorry, but you've reached the end of search results."
            );
          }

          lightbox.refresh();
          scrollPage();
        })
        .catch(err => {
          Notiflix.Notify.failure(
            `Ops, there is a problem here! Try again late! ${err.statusText}`
          );
        });
    }
  });
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
        `<a class="gallery-link" href="${largeImageURL}">
        <div class="photo-card">
           <img class="gallery-image" src="${webformatURL}" alt="${tags}" loading="lazy" />
           <div class="info">
              <p class="info-item">
                 <b>Likes ${likes} </b>
             </p>
             <p class="info-item">
                 <b>Views ${views}</b>
            </p>
           <p class="info-item">
               <b>Comments ${comments}</b>
           </p>
          <p class="info-item">
           <b>Downloads ${downloads}</b>
          </p>
     </div>
     </div>
  </a>
`
    )
    .join('');
}

function scrollPage() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

// import { fetchPhoto } from './fetch';
// import Notiflix from 'notiflix';
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';

// const form = document.querySelector('.search-form');
// const gallery = document.querySelector('.gallery');
// const loadBtn = document.querySelector('.load-more');

// let lightbox = new SimpleLightbox('.gallery-link', {
//   captions: true,
//   captionsData: 'alt',
//   captionDelay: 250,
// });

// let currentPage = 1;
// let currentSearch = '';

// form.addEventListener('submit', onSearch);
// loadBtn.addEventListener('click', onClick);

// function onSearch(evt) {
//   loadBtn.classList.add('disable');
//   gallery.innerHTML = '';
//   currentPage = 1;
//   evt.preventDefault();

//   const requestParam = evt.target.searchQuery.value.trim();
//   currentSearch = requestParam;

//   if (!requestParam) {
//     Notiflix.Notify.warning('Please write some word!');
//     return;
//   }

//   fetchPhoto(requestParam)
//     .then(data => {
//       if (!data.hits.length) {
//         Notiflix.Notify.warning(
//           'Sorry, there are no images matching your search query. Please try again.'
//         );
//       }

//       gallery.insertAdjacentHTML('beforeend', creatMarkup(data.hits));
//       lightbox.refresh();
//       scrollPage();

//       const { totalHits } = data;
//       Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

//       const currentHits = currentPage * data.hits.length;

//       if (totalHits <= currentHits) {
//         Notiflix.Notify.warning(
//           "We're sorry, but you've reached the end of search results."
//         );
//       } else {
//         setTimeout(() => {
//           loadBtn.classList.remove('disable');
//         }, 1000);
//       }
//     })
//     .catch(err => {
//       Notiflix.Notify.failure('Ops, there is a problem here! Try again late!');
//       console.log(err);
//     })
//     .finally(() => form.reset());
// }

// function onClick() {
//   currentPage += 1;

//   fetchPhoto(currentSearch, currentPage)
//     .then(data => {
//       gallery.insertAdjacentHTML('beforeend', creatMarkup(data.hits));

//       lightbox.refresh();
//     })
//     .catch(err => console.log(err));
// }

// function creatMarkup(arr) {
//   return arr
//     .map(
//       ({
//         webformatURL,
//         largeImageURL,
//         tags,
//         likes,
//         views,
//         comments,
//         downloads,
//       }) =>
//         `<a class="gallery-link" href="${largeImageURL}">
//         <div class="photo-card">
//            <img class="gallery-image" src="${webformatURL}" alt="${tags}" loading="lazy" />
//            <div class="info">
//               <p class="info-item">
//                  <b>Likes ${likes} </b>
//              </p>
//              <p class="info-item">
//                  <b>Views ${views}</b>
//             </p>
//            <p class="info-item">
//                <b>Comments ${comments}</b>
//            </p>
//           <p class="info-item">
//            <b>Downloads ${downloads}</b>
//           </p>
//      </div>
//      </div>
//   </a>
// `
//     )
//     .join('');
// }

// function scrollPage() {
//   const { height: cardHeight } = document
//     .querySelector('.gallery')
//     .firstElementChild.getBoundingClientRect();

//   window.scrollBy({
//     top: cardHeight * 2,
//     behavior: 'smooth',
//   });
// }

// try {
//   const requestParam = evt.target.searchQuery.value.trim();
//   const searchImg = await fetchPhoto(requestParam);
//   gallery.insertAdjacentHTML('beforeend', creatMarkup(searchImg.hits));
// } catch (err) {
//   console.log(err);
// }

// let simpleLightBox;
// simpleLightBox = new SimpleLightbox('.gallery a').refresh();
// simpleLightBox.destroy();
// simpleLightBox = new SimpleLightbox('.gallery a').refresh();

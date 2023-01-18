import './css/styles.css';
import fetchCountries from './fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const searchFormEl = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryCard = document.querySelector('.country-info');


function createCountryMarkup(countryInfo) {
  clear();
  if (countryInfo.length < 10 && countryInfo.length >= 2) {
    const markupList = countryInfo
      .map(({ flags: { svg }, name }) => {
        return `<li style="margin-bottom: 10px; list-style: none">
                            <img src="${svg}" width=40 alt="flag ">  
                            <span style="font-size: 18px">${name.official}</span>
                        </li>`;
      })
      .join('');
    countryList.innerHTML = markupList;
  }

  else if (countryInfo.length < 2) {
    clear();
    const languages = countryInfo[0].languages;
    const laguagesString = Object.values(languages).join(', ')

    const markupCard = countryInfo
      .map(({ flags: { svg }, name, capital, population }) => {
        return `<div><img src="${svg}" width=40 alt="flag">
                <span style="font-size: 30px; font-weight: 700;">${name.official}</span></div>
                <p><b>Capital: </b> ${capital}</p>
                <p><b>Population: </b> ${population}</p>
                <p><b>Languages: </b> ${laguagesString}</p>`;
      })
      .join('');

    return countryCard.innerHTML = markupCard;
  }

  else {
    clear();
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
  }
}


function onSearchFormInput(e) {
  e.preventDefault;
  const searchedQuery = e.target.value.trim();


  fetchCountries(searchedQuery)
    .then(data => createCountryMarkup(data))

    .catch(error => {
      console.log(error);
      countryList.innerHTML = '';
      countryCard.innerHTML = '';
      clear();
      if (searchedQuery) {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      }
    });
}

function clear() {
  countryCard.innerHTML = '';
  countryList.innerHTML = '';
}


searchFormEl.addEventListener('input', debounce(onSearchFormInput, DEBOUNCE_DELAY));
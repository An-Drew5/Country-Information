'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const searchInput = document.querySelector('.input-country');

// Function to render Country
const renderCountry = function (data) {    
    const languagesKey = Object.keys(data.languages);
    const currencyKey = Object.keys(data.currencies);

    const html = ` 
    <article class="country">
        <img class="country__img" src="${data.flags.png}" />
        <div class="country__data">
            <h3 class="country__name">${data.name.common}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(1)}M</p>
            <p class="country__row"><span>🗣️</span>${data.languages[languagesKey]}</p>
            <p class="country__row"><span>💰</span>${data.currencies[currencyKey].name}</p>
        </div>
    </article>
    `;

    countriesContainer.insertAdjacentHTML("beforeend", html);
    countriesContainer.style.opacity = 1;

    //   (find in the finally method) countriesContainer.style.opacity = 1;
}

// handling error
const renderError = function (msg) {
    countriesContainer.insertAdjacentText('beforeend', msg);
    // (find in the finally method)    countriesContainer.style.opacity = 1;
}

const getJSON = function (url, errorMsg = 'Something went wrong') {
    return fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);

            return response.json();
        })
}

// Fetching data from the API
const getCountryData = function (country) {
    getJSON(`https://restcountries.com/v3.1/name/${country}`, 'Country not found')
        .then(data => {
            console.log(data);
            renderCountry(data[0]);
            const neighbour = data[0].borders[0];
            if (!neighbour) throw new Error('No neighbour found!');

            return getJSON(`https://restcountries.com/v3.1/alpha/${neighbour}`, 'Country not found')
        })
        .then(data => {
            console.log(data)
            renderCountry(data[0])

        })
        .catch(err => {

            console.log(err)
            renderError(`Something went wrong 😟😟 ${err.message}. Try again.`)
        })
        .finally(() => {
            countriesContainer.style.opacity = 1;
        });

}

btn.addEventListener('click', function () {
    countriesContainer.innerHTML = '';
    getCountryData(searchInput.value);
})

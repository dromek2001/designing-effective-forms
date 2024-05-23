let clickCount = 0;

const countryInput = document.getElementById('country');
const myForm = document.getElementById('form');
const modal = document.getElementById('form-feedback-modal');
const clicksInfo = document.getElementById('click-count');
const countryCodeInput = document.getElementById('countryCode');
const phoneNumberInput = document.getElementById('phoneNumber');
const emailInput = document.getElementById('exampleInputEmail1');
const fullNameInput = document.getElementById('fullName');

// Function to handle click counting
function handleClick() {
    clickCount++;
    clicksInfo.innerText = clickCount;
}

// Function to fetch and fill countries, sorted alphabetically
async function fetchAndFillCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
            throw new Error('Błąd pobierania danych');
        }
        const data = await response.json();
        const countries = data.map(country => country.name.common).sort((a, b) => a.localeCompare(b));
        countryInput.innerHTML = countries.map(country => `<option value="${country}">${country}</option>`).join('');
    } catch (error) {
        console.error('Wystąpił błąd:', error);
    }
}

// Function to get country by IP and set it in the country input
function getCountryByIP() {
    fetch('https://get.geojs.io/v1/ip/geo.json')
        .then(response => response.json())
        .then(data => {
            const country = data.country;
            countryInput.value = country;
            getCountryCode(country);
        })
        .catch(error => {
            console.error('Błąd pobierania danych z serwera GeoJS:', error);
        });
}

// Function to get country code based on country name
function getCountryCode(countryName) {
    const apiUrl = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Błąd pobierania danych');
            }
            return response.json();
        })
        .then(data => {        
            const countryCode = data[0].idd.root + data[0].idd.suffixes.join("");
            countryCodeInput.value = countryCode;
        })
        .catch(error => {
            console.error('Wystąpił błąd:', error);
        });
}

// Function to enable keyboard shortcuts
function enableKeyboardShortcuts() {
    myForm.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            myForm.submit();
        }
    });
}

// Email validation
function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

// Phone number validation
function validatePhoneNumber(phoneNumber) {
    const phonePattern = /^\d+$/;
    return phonePattern.test(phoneNumber);
}

// Form submit event listener
myForm.addEventListener('submit', function(event) {
    const emailValue = emailInput.value;
    const phoneNumberValue = phoneNumberInput.value;
    let isValid = true;

    if (!validateEmail(emailValue)) {
        isValid = false;
        emailInput.classList.add('is-invalid');
        alert('Proszę wpisać poprawny adres email.');
    } else {
        emailInput.classList.remove('is-invalid');
    }

    if (!validatePhoneNumber(phoneNumberValue)) {
        isValid = false;
        phoneNumberInput.classList.add('is-invalid');
        alert('Proszę wpisać poprawny numer telefonu (tylko cyfry).');
    } else {
        phoneNumberInput.classList.remove('is-invalid');
    }

    if (!isValid) {
        event.preventDefault();
    }
});

document.addEventListener('click', handleClick);

fetchAndFillCountries();
getCountryByIP();
enableKeyboardShortcuts();

(() => {
    document.addEventListener('click', handleClick);
    fetchAndFillCountries();
    getCountryByIP();
})();

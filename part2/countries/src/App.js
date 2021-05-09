import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const CountryFilter = ({ filter, handleFilterChange }) => {
  return (
    <div>
      Find Countries:{' '}
      <input defaultValue={filter} onChange={handleFilterChange} />
    </div>
  );
};

const Country = ({ country }) => {
  const countryLanguages = country.languages.map((language) => {
    return <Language language={language} key={language.name} />;
  });
    return (
      <div>
        <h1>{country.name}</h1>
        <div>Capital: {country.capital}</div>
        <div>Population: {country.population}</div>
        <h3>Languages</h3>
        <ul>{countryLanguages}</ul>
        <img src={country.flag} alt='Country Flag' height='150' width='150'></img>
      </div>
    );
};

const Language = ({ language }) => {
  return <li>{language.name}</li>;
};

const Display = ({ countries }) => {
  if (countries.length > 10) {
    return <div>Too many matches specifiy another filter</div>;
  } else if (countries.length === 1) {
    const country = countries[0];
    return <Country country={country} key={country.alpha2Code} />;
  } else {
    const names = countries.map((country) => {
      return <li>{country.name}</li>;
    });
    return <ul>{names}</ul>;
  }
};


const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState('');

  const hook = () => {
    console.log('effect');

    const eventHandler = (response) => {
      console.log('promise fulfilled');
      setCountries(response.data);
    };

    axios.get('https://restcountries.eu/rest/v2/all').then(eventHandler);
  };

  useEffect(hook, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <CountryFilter filter={filter} handleFilterChange={handleFilterChange} />
      <Display countries={filteredCountries} key={countries.index} />
    </div>
  );
};

export default App;

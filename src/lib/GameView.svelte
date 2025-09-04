<script>
  import { selectedCountry, ecoScore } from '../store.js';
  import CountryMap from './CountryMap.svelte';
  import { onMount } from 'svelte';

  let country;

  $: $selectedCountry && (country = {...$selectedCountry});

  function updateScore() {
    if (!country) return;
    ecoScore.set(country.resources - country.predators*5 + country.population/100);
  }
</script>

<CountryMap />

{#if country}
<section>
  <h2>{country.name}</h2>

  <label>Population: {country.population}</label>
  <input type="range" min="50" max="2000" bind:value={country.population} on:input={updateScore} />

  <label>Predators: {country.predators}</label>
  <input type="range" min="0" max="50" bind:value={country.predators} on:input={updateScore} />

  <label>Resources: {country.resources}</label>
  <input type="range" min="0" max="100" bind:value={country.resources} on:input={updateScore} />

  <p>Eco Score: {$ecoScore.toFixed(2)}</p>
</section>
{/if}

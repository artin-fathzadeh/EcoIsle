<script>
  import countryList from './countryList.js';
  import { selectedCountry } from '../store.js';

  function selectCountry(c) {
    selectedCountry.set(c);
  }
</script>

<div class="map-container">
  <img src="/assets/worldmap.png" alt="World map" />
  {#each countryList as country}
    <div 
      class="country-dot"
      style="position:absolute; left:{country.x}px; top:{country.y}px;"
      on:click={() => selectCountry(country)}
      title={country.name}>
    </div>
  {/each}
</div>

<style>
  .map-container { position: relative; width: 100%; }
  img { width: 100%; height: auto; }

  .country-dot {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: red;
    cursor: pointer;
    transform: translate(-50%, -50%);
    transition: transform 0.2s;
  }

  .country-dot:hover {
    transform: translate(-50%, -50%) scale(1.5);
  }
</style>

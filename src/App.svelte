<script>
  import {onMount} from 'svelte';
  
  
  let soilNutrients = 50;
  let plantAbundance = 50;
  let herbivoreCount = 50;
  let carnivoreCount = 50;
  let humanActivity = 50;

  let sunlight = 50;
  let water = 50;
  let soilQuality = 50;
  let temperature = 50;
  
  const foodChainSliders = [
    {name: 'Soil Nutrients', var: 'soilNutrients'}
    {name: 'Plant Abundance', var:'plantAbundance'}
    {name: 'Herbivore Count', var: 'herbivoreCount'}
    {name: 'Carnivore Count', var: 'carnivoreCount'}
    {name: 'Human Activity', var: 'humanActivity'}
  ];

  const resourceSliders = [
    {name: 'Sunlight', var: 'sunlight'}
    {name: 'Water', var: 'water'}
    {name: 'Soil Quality', var: 'soilQuality'}
    {name: 'Temperature', var: 'temperature'}
  ];
</script>

<style>
  .slider-container {
    margin: 1rem 0;
  }
  label {
    font-weight: bold;
  }
  .section {
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    margin-bottom: 1rem;
  }
</style>

<h2>Ecosystem Configuration</h2>

<div class="section">
  <h3>Food Chain Sliders</h3>
  {#each foodChainSliders as slider}
    <div class="slider-container">
      <label>{slider.name}: {eval(slider.var)}</label>
      <input type="range" min="0" max="100" bind:value={eval(slider.var)} />
    </div>
  {/each}
</div>

<div class="section">
  <h3>Natural Resources</h3>
  {#each resourceSliders as slider}
    <div class="slider-container">
      <label>{slider.name}: {eval(slider.var)}</label>
      <input type="range" min="0" max="100" bind:value={eval(slider.var)} />
    </div>
  {/each}
</div>

<button on:click={() => alert('Simulate not yet implemented')}>Simulate Ecosystem</button>
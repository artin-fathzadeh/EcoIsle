<script>
  import { botStep } from '../store.js';
  import { tick } from 'svelte';

  let step = 0;

  $: botStep.set(step);

  async function nextStep() {
    step++;
    await tick();
    if (step > 2) step = 0; // loop guidance
  }
</script>

<div class="bot">
  {#if step === 0}
    <p>Hi! Start by selecting a country on the map.</p>
  {:else if step === 1}
    <p>Now, adjust the population slider to see how it affects the eco score.</p>
  {:else if step === 2}
    <p>Next, adjust predators and resources to balance the ecosystem.</p>
  {/if}
  <button on:click={nextStep}>Next</button>
</div>

<style>
.bot {
  position: fixed;
  bottom: 10px;
  right: 10px;
  background: rgba(255,255,255,0.9);
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
}
</style>

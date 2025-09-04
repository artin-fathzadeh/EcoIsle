<script>
  import { createEventDispatcher } from 'svelte';
  import Bot from './lib/Bot.svelte';
  const dispatch = createEventDispatcher();

  const startGame = () => dispatch('startGame');
  const viewLeaderboard = () => dispatch('viewLeaderboard');
</script>

<section>
  <h1>EcoIsle</h1>
  <button on:click={startGame}>Start Game</button>
  <button on:click={viewLeaderboard}>Leaderboard</button>
  <Bot />
</section>

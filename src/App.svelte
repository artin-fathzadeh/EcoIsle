<script>
  import './app.css';
  import Home from './Home.svelte';
  import GameView from './lib/GameView.svelte';
  import Leaderboard from './lib/Leaderboard.svelte';

  let currentView = 'home';
  function goTo(view) { currentView = view; }
</script>

<main>
  {#if currentView === 'home'}
    <Home on:startGame={() => goTo('game')} on:viewLeaderboard={() => goTo('leaderboard')} />
  {:else if currentView === 'game'}
    <GameView />
  {:else if currentView === 'leaderboard'}
    <Leaderboard />
  {/if}
</main>

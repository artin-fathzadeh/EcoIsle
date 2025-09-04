<script>
  let leaderboard = [
    { name: 'Alice', score: 120 },
    { name: 'Bob', score: 100 }
  ];
</script>

<section>
  <h2>Leaderboard</h2>
  <ul>
    {#each leaderboard as player}
      <li>{player.name}: {player.score}</li>
    {/each}
  </ul>
</section>

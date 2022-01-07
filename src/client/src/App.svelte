<script lang="ts">
	let mapID: number;
	let mapURL: string;

	async function renderMap() {
		try {
			// console.log(mapID);
			const returnValue = await fetch(`/api/bmap/${mapID}`);
			console.log(returnValue);
			//const response = await returnValue.json();
			mapURL = "Unga"//returnValue.data.url;

		} catch (err) {
			console.error(err);
		}
	}
</script>

<main>
	<h1>GW2 Map Renderer</h1>
	<div class="search-block">
		<input type="text" placeholder="Render Gw2 BMap by ID" bind:value={mapID} />
		<button on:click={renderMap}>Render BMap</button>
	</div>
	<div class="rendered-map">
		{#if mapURL}
		  <div>{mapURL}</div>
		{:else}No map generated so far!{/if}
	  </div>
	<!--<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p> !-->
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
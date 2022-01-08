<script lang="ts">
	import Autocomplete from "@smui-extra/autocomplete";
	import Button, { Label } from "@smui/button";
	let gw2mapName: string;
	let gw2mapURL: string;
	let gw2mapNames: any[];

	const getMaps = async () => {
		try {
			const returnValue = await fetch(`/api/maps`);
			const response = await returnValue.json();
			gw2mapNames = response.map( gw2map => gw2map.name);
		} catch (err) {
			console.error(err);
		}
	}

	async function renderMap() {
		if (!gw2mapName) {return};
		try {
			const returnValue = await fetch(`/api/bmap/${gw2mapName}`);
			const response = await returnValue.json();
			gw2mapURL = response.data[0].mapURL;

		} catch (err) {
			console.error(err);
		}
	}
	$: getMaps();
</script>

<main>
	<h1>GW2 Map Renderer</h1>
	<div class="search-block">
		<Autocomplete
		  options={gw2mapNames}
		  bind:value={gw2mapName}
		  label="Choose Map"
		/>
		<pre class="status">Selected: {gw2mapName || ''}</pre>
		<Button on:click={renderMap}>
			<Label>Render BMap</Label>
		</Button>
	</div>

	<div class="rendered-map">
		{#if gw2mapURL}
			<img src={gw2mapURL} alt="base map" style="width:500px">
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
		color: #386641;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
	
	:global(body) {
		background-color: #FCF7F8;
	}
</style>
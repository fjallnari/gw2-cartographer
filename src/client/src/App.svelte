<script lang="ts">
	import Autocomplete from "@smui-extra/autocomplete";
	import CircularProgress from '@smui/circular-progress';
	import Button, { Label } from "@smui/button";
	import LOADING_MESSAGES from "./enum/LoadingMessages";
	
	let gw2mapName: string;
	let gw2mapURL: string;
	let gw2mapNames: any[];
	let inProgress: boolean = false;

	const addOutline = (id: string) => {
		const mapImage = document.getElementById(id);
		mapImage.style.outline = `solid #C1B9A8`;
		mapImage.style.outlineOffset = "10px";
		mapImage.style.borderRadius = "0.5rem";
	}

	const getRandomLoadingMessage = () => {
		return LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
	}

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
		inProgress = true;
		try {
			const returnValue = await fetch(`/api/bmap/${gw2mapName}`);
			const response = await returnValue.json();
			gw2mapURL = response.data[0].mapURL;

		} catch (err) {
			console.error(err);
		}
		inProgress = false;
	}
	$: getMaps();
</script>

<main>
	<nav>
		<ul class="nav-bar">
			<img id="logo" src="static/logo-transparent-bg.png" alt="spotter logo">
			<li><Button on:click={() => ""}><Label>About</Label></Button></li>
			<li><Button on:click={() => ""}><Label>SpotterBot</Label></Button></li>
			<li><Button on:click={() => ""}><Label>Some Stuff</Label></Button></li>
			<li><Button on:click={() => ""}><Label>GW2 Hi-Res Maps</Label></Button></li>
		</ul>
	</nav>
	<h1 style="padding-top:15%">GW2 Hi-Res Maps</h1>
	<div id="search-block">
		<Autocomplete
		  options={gw2mapNames}
		  bind:value={gw2mapName}
		  label="Choose Map"
		  style="padding: 10px"
		/>
		<!-- <pre id="status" class="info-text">Selected: {gw2mapName || ''}</pre> -->
		<Button on:click={renderMap} variant="outlined">
			<Label>Render BMap</Label>
		</Button>
	</div>

	<div id="output-field" class="info-text">
		{#if gw2mapURL && !inProgress}
			<img id="rendered-map" src={gw2mapURL} alt="base map" on:load={() => addOutline("rendered-map")}>
		{:else if inProgress}
			<div id="progress">
				<div id="progress-circle"><CircularProgress style="height: 48px; width: 48px;" indeterminate /></div>
				<div id="progress-text" style="padding: 10px">{getRandomLoadingMessage()}</div>
			</div>
		{:else}No map generated so far!{/if}
	  </div>
	<!--<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p> !-->
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		padding-top: 0px;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #FCF7F8;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
		font-family: Quicksand;
	}

	nav {
		position: sticky;
		position: -webkit-sticky;
		top: 0;
		background-color: #1D1D26;
		z-index : 1;
	}

	nav ul {
		display: flex;
		list-style: none;
		justify-content: flex-end;
		gap: 1em;
		align-items: center;
		position: sticky;
		--mdc-text-button-label-text-color: #FCF7F8;
	}

	.info-text {
		font-family: "Palanquir", sans-serif;
	}

	#logo {
		max-width: 115px;
		margin-right: auto;
		margin-left: -2%;
	}

	#rendered-map {
		max-width: 50%;
		max-height: 50%;
	}

	#search-block {
		padding-bottom: 40px;
	}

	#progress-circle {
		display: flex; 
		justify-content: center;
	}

	@media only screen and (min-width: 640px) {
		main {
			max-width: none;
		}
	}
	
</style>
<script lang="ts">
    import Autocomplete from "@smui-extra/autocomplete";
	import CircularProgress from '@smui/circular-progress';
	import Button, { Label } from "@smui/button";
	import LOADING_MESSAGES from "../enum/LoadingMessages";
	import Select, { Option } from "@smui/select";

    let gw2mapName: string;
	let gw2mapURL: string;	
	let gw2mapNames: any[];
	let inProgress: boolean = false;
	let renderMode: string = "bmap";

	const renderModes = [{value: "bmap", name: "Only base map"}, {value: "imap", name: "BMap + icons"}, {value: "fmap", name: "BMap + icons + labels"}];	
	
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

<h1>GW2 Hi-Res Maps</h1>
<div id="search-block">
    <Autocomplete
        options={gw2mapNames}
        bind:value={gw2mapName}
        label="Map"
        style="padding: 10px"
    />

    <div class="render-mode-select" style="justify-content: flex-end;">
        <div style="padding: 10px">
            <Select bind:renderMode label="Render-mode">
            {#each renderModes as mode}
                <Option value={mode.value}>{mode.name}</Option>
            {/each}
            </Select>
        </div>
    </div>

    <Button on:click={renderMap} variant="outlined">
        <Label>Render map</Label>
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


<style>
    .info-text {
		font-family: "Palanquir", sans-serif;
	}

    #rendered-map {
		max-width: 50%;
		max-height: 50%;
	}

	#search-block {
		display: flex;
		padding-bottom: 40px;
		flex-direction: row;
		justify-content: center;
		align-items: baseline;
	}

	#progress-circle {
		display: flex; 
		justify-content: center;
	}

</style>
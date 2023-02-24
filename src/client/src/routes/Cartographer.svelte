<script lang="ts">
    import SimpleButton from "../components/SimpleButton.svelte";
    import LoadingCircle from "../components/LoadingCircle.svelte";
    import Svelecte from "svelecte/src/Svelecte.svelte";
    import type TyriaMap from "../interfaces/TyriaMap";
    import SimpleSegmentChoice from "../components/SimpleSegmentChoice.svelte";

    let mapToRender: TyriaMap;
	let renderedMapURL: string;	
	let inProgress: boolean = false;
	let progressError = "No map generated so far!";

	const genModes = [
        { id: "bmap", name: "Base map only" }, 
        { id: "imap", name: "BMap + icons" }, 
        { id: "fmap", name: "BMap + icons + labels" }
    ];

    let genMode = genModes[0];

    const addOutline = (id: string) => {
        const mapImage = document.getElementById(id);
        mapImage.style.outline = `solid var(--clr-accent-normal)`;
        mapImage.style.outlineOffset = "10px";
        mapImage.style.borderRadius = "1px";
	}

	const getMaps = async () => {
		try {
			const returnValue = await fetch(`/api/maps`);
			const response = await returnValue.json() as TyriaMap[];
			return response.sort((a, b) => a.name > b.name ? 1 : -1);
		} catch (err) {
			console.error(err);
		}
	}

	async function renderMap() {
		if (!mapToRender) {return};
		inProgress = true;
		try {
			const returnValue = await fetch(`/api/map-gen/?mode=${genMode.id}&name=${mapToRender.name}`);
			const response = await returnValue.json();
			renderedMapURL = response.data[0].mapURL;

		} catch (err) {
			progressError = `Couldn't generate the ${genMode.id} of ${mapToRender.name}`;
			renderedMapURL = undefined;
		}
		inProgress = false;
	}

</script>

{#await getMaps() then mapsGW2}
    <cartographer-container>
        <div class="rendered-map">
            {#if renderedMapURL && !inProgress}
                <img id="rendered-map-img" src={renderedMapURL} alt="base map" on:load={() => addOutline("rendered-map-img")}>
            {:else if inProgress}
                <LoadingCircle />
            {:else}
                <div class="progress-error">{progressError}</div>
            {/if}
        </div>
        <div class="controls">
            <box class="controls-box">
                <h3 class="title">GW2 Cartographer</h3>
                <p>Generates high-res gw2 maps from the official API tiles. Labels might be a bit off, the API is not that precise with them.</p>
                <div >
                    <SimpleSegmentChoice options={genModes} bind:final={genMode}/>
                </div>
                <div id="controls-svelecte">
                    <h4>Map to render:</h4>
                    <Svelecte 
                        options={mapsGW2}
                        valueAsObject
                        placeholder='GW2 Maps'
                        bind:value={mapToRender}>
                    </Svelecte>
                </div>
                <SimpleButton value="Render map" type="primary" onClickFn={() => renderMap()} />
                <div class="emblem">
                    <a href="https://github.com/nevermore-org/spotter-web" id="logo"><img style="max-width: 115px" src="static/logo-transparent-bg.png" alt="spotter logo"></a>
                </div>
            </box>
        </div>
    </cartographer-container>
{/await}

<style>
    cartographer-container {  display: grid;
        grid-template-columns: 1.5fr 4fr;
        grid-template-rows: 1fr 1fr 1fr;
        gap: 0px 0px;
        grid-auto-flow: row;
        grid-template-areas:
            "controls rendered-map"
            "controls rendered-map"
            "controls rendered-map";
        width: inherit;
        height: inherit;
        font-family: Palanquin;

        background: var(--bg-image) no-repeat;
        background-size: 100%;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
    }

    .rendered-map { grid-area: rendered-map; 
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2em;
    }

    .controls { grid-area: controls; 
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
    }

    .controls-box {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        padding: 0em 2em;
        gap: 1em;
        width: inherit;
        height: inherit;
        font-size: 1.5em;
        background-color: #212125A1;
        box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
        backdrop-filter: blur(6px);
    }

    #rendered-map-img {
        max-width: 95%;
        max-height: 95%;
        box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
    }

    .title {
        text-transform: uppercase;
        font-family: Quicksand;
        margin-top: 2em;
    }

    .progress-error {
        color: var(--clr-contrast-middle);
    }

    #controls-svelecte {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        gap: 1em;
        font-family: Quicksand;
    }

    :global(#controls-svelecte > .svelecte-control) {
		box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
		--sv-bg: var(--clr-box-bg-normal) !important;
		--sv-color: var(--clr-text) !important;
		--sv-placeholder-color: var(--clr-text) !important; 
		--sv-border: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%) !important;
		--sv-item-color: var(--clr-text) !important;
		--sv-icon-color: var(--clr-text) !important;
		--sv-icon-hover: var(--clr-accent-light) !important;
		--sv-item-active-bg: var(--clr-accent-dark) !important;
		--sv-highlight-bg: var(--clr-accent-normal) !important;
		--sv-dropdown-height: 400px !important;
		z-index: 4;
	}

    
</style>
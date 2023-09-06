<script lang="ts">
    import type TyriaMap from "./interfaces/TyriaMap";
    import LoadingWheel from "./lib/LoadingWheel.svelte";

    let mapToRender: TyriaMap;
	let renderedMapURL: string | undefined;
    let mapElement: HTMLImageElement;
	let inProgress: boolean = false;
	let progressError = "No map generated so far!";

	const genModes = [
        { 
            id: "bmap", 
            name: "Base map"
        },
        { 
            id: "imap", 
            name: "Icon map",
            info: "Icons included: Hero Points, Points of Interest, Waypoints, and Hearts"
        }, 
        { 
            id: "fmap", 
            name: "Full map", 
            info: "Includes icons and labels. Labels might be a bit off compared to in-game, the API is not that precise with them."
        }
    ];

    let genMode = genModes[0];

    async function getMaps() {
        try {
            const returnValue = await fetch(`/api/maps`);
            const response = await returnValue.json() as TyriaMap[];
            const sortedMaps = response.sort((a, b) => a.name > b.name ? 1 : -1)
            mapToRender = sortedMaps[0];

            return sortedMaps;
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

<main class="flex flex-row flex-wrap lg:flex-nowrap justify-evenly items-center w-11/12 h-full p-6 m-auto text-off-white">
    <div class="flex flex-col justify-center items-left w-full md:w-1/2 lg:w-80 h-fit px-8 py-4 gap-4 bg-abyss-900 bg-opacity-75 backdrop-blur-md border-solid border-b-2 border-goldenrod">
        <h1 class="text-4xl font-homenaje">GW2 Cartographer</h1>
        <p class="italic text-goldenrod">Generates high-res gw2 maps from the official API tiles.</p>
        <div class="flex flex-row justify-between items-center gap-4">
            <h2 class="font-semibold font-exo text-lg">Mode:</h2>
            <select bind:value={genMode}
                class="block w-48 p-2.5
                text-egshell text-sm border-solid border-b-2 border-b-transparent
                 bg-abyss-800 shadow backdrop-blur-md
                focus:border-goldenrod focus:outline-none font-exo"
            >
                {#each genModes.sort() as option}
                    <option value={option}>{option.name}</option>
                {/each}
            </select>
        </div>
        
        {#if genMode.info}
            <div class="flex flex-col justify-center items-left gap-2">
                <p class="text-sm text-egshell italic">{genMode.info}</p>
            </div>
        {/if}

        <div class="flex flex-row justify-between items-center gap-4">
            <h2 class="font-semibold font-exo text-lg">Map:</h2>
            <select bind:value={mapToRender}
                class="block w-48 p-2.5
                text-egshell text-sm border-b-transparent border-solid border-b-2
                 bg-abyss-800 shadow backdrop-blur-md
                focus:border-goldenrod focus:outline-none font-exo"
            >
                {#await getMaps() then maps}
                    {#if !maps || maps.length === 0}
                        <option value={undefined}>No maps found!</option>
                    {:else}
                        {#each maps as map}
                            <option value={map}>{map.name}</option>
                        {/each}
                    {/if}
                {/await}
            </select>
        </div>
        <div class="flex flex-row justify-around items-center gap-4 w-full mt-4 mb-2">
            <button class="p-2.5 w-1/2 self-center
                text-egshell text-sm font-bold
              active:bg-abyss-800 shadow backdrop-blur-md
              bg-abyss-700 focus:outline-none font-exo transition-colors" 
                on:click={() => renderMap()}
            >
                Render map
            </button>
        </div>

        <!-- <div class="flex flex-col justify-center items-left gap-2">
            <p class="text-xs text-egshell italic py-4">You can download the map by right-clicking and "Save image as..."</p>
        </div> -->
    </div>
    <div class="flex justify-start items-center">
        {#if renderedMapURL && !inProgress}
            <img bind:this={mapElement} class="object-scale-down max-w-full max-h-[92vh] m-auto p-8 " src={renderedMapURL} alt="base map">
        {:else if inProgress}
            <LoadingWheel />
        {:else}
            <div class="font-exo text-lg italic">{progressError}</div>
        {/if}
    </div>
</main>
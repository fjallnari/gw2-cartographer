<script lang="ts">
    import type TyriaMap from "./interfaces/TyriaMap";
    import SimpleSelect from "./lib/SimpleSelect.svelte";

    let mapToRender: TyriaMap;
	let renderedMapURL: string;	
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
    let API_URL = "http://localhost:4000";

    async function getMaps() {
        try {
            const returnValue = await fetch(`${API_URL}/api/maps`);
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
            const returnValue = await fetch(`${API_URL}/api/map-gen/?mode=${genMode.id}&name=${mapToRender.name}`);
            const response = await returnValue.json();
            renderedMapURL = response.data[0].mapURL;
        } catch (err) {
            progressError = `Couldn't generate the ${genMode.id} of ${mapToRender.name}`;
            renderedMapURL = undefined;
        }
        inProgress = false;
    }

</script>

<main class="flex flex-row flex-wrap justify-evenly items-center w-11/12 h-full p-6 m-auto">
    <div class="flex flex-col justify-center items-left w-full md:w-1/5 h-2/3 gap-4">
        <h1 class="text-2xl">GW2 Cartographer</h1>
        <p>Generates high-res gw2 maps from the official API tiles.</p>

        <div class="flex flex-row justify-center items-center gap-4">
            <h2 class="font-semibold">MODE:</h2>
            <select bind:value={genMode}
                class="block w-full p-2.5
                text-egshell text-sm border-b-abyss-900 border-solid border-b-2
                rounded-t bg-abyss-800 shadow backdrop-blur-md
                focus:ring-blue-500 focus:border-goldenrod focus:outline-none"
            >
                {#each genModes.sort() as option}
                    <option value={option}>{option.name}</option>
                {/each}
            </select>
        </div>
        
        {#if genMode.info}
            <div class="flex flex-col justify-center items-left gap-2">
                <p class="text-xs text-egshell italic">{genMode.info}</p>
            </div>
        {/if}

        <div class="flex flex-row justify-center items-center gap-4">
            <h2 class="font-semibold">MAP:</h2>
            <select bind:value={mapToRender}
                class="block w-full p-2.5
                text-egshell text-sm border-b-abyss-900 border-solid border-b-2
                rounded-t bg-abyss-800 shadow backdrop-blur-md
                focus:ring-blue-500 focus:border-goldenrod focus:outline-none"
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
        <button class="" on:click={() => renderMap()}>
            Render map
        </button>
        <!-- <div class="flex flex-col justify-center items-left gap-2">
            <p class="text-xs text-egshell italic py-4">You can download the map by right-clicking and "Save image as..."</p>
        </div> -->
    </div>
    <div class="flex h-full justify-start items-center">
        {#if renderedMapURL && !inProgress}
            <img class="object-scale-down max-w-full max-h-[92vh] m-auto" src={renderedMapURL} alt="base map">
        {:else if inProgress}
            <div class="">loading</div>
        {:else}
            <div class="progress-error">{progressError}</div>
        {/if}
    </div>
</main>
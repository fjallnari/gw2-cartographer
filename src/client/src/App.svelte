<script lang="ts">
	import Router from "svelte-spa-router";
	import NotFound from "./routes/NotFound.svelte";
    import Cartographer from "./routes/Cartographer.svelte";
	
	const routes = {
		"/": Cartographer,
		"*": NotFound
	}
	
</script>

<main>
	<Router {routes}/>
</main>

<style>

	:root {
		--semi-bold: 600;
		--clr-contrast-normal: #BC4B51;
		--clr-contrast-middle: #BC4749;
		--clr-contrast-dark: #A43D42;
		--clr-bg: #1B1B1E;
		--clr-box-bg-dark: #212125;
		--clr-box-bg-normal: #252529;
		--clr-box-bg-light: #303036;
		--clr-box-bg-lighter: #56565D;
		--clr-text: #FFF9EC;
		--clr-accent-light: #78A1BB;
        --clr-accent-normal: #5A77A1;
        --clr-accent-dark: #3C4C87;
        --clr-accent-darker: #2C3863;
        --clr-accent-muted: #3C4C8729;
		--bg-image: url(../static/bg-haikei.svg);
	}

	:global(html, body, main) {
		margin: 0;
		height: 100%;
		color: var(--clr-text);
		background-color: var(--clr-bg);
	}

	:global(box) {
        background-color: var(--clr-box-bg-dark);
        box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
        border-radius: 4px;
    }

	:global(.sv-dropdown-scroll) {
		scrollbar-width: thin;
	}


	@media only screen and (min-width: 640px) {
		main {
			max-width: none;
		}
	}
	
</style>
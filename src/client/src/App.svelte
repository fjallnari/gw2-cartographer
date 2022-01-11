<script lang="ts">
	import Router from "svelte-spa-router";


	import Home from "./routes/Home.svelte";
	import Maps from "./routes/Maps.svelte";
	import SpotterBot from "./routes/SpotterBot.svelte";
	import NotFound from "./routes/NotFound.svelte";
	
	const routes = {
		"/": Home,
		"/maps": Maps,
		"/spotter-bot": SpotterBot,
		"*": NotFound
	}
</script>

<main>
	<nav>
		<ul class="nav-bar">
			<img id="logo" src="static/logo-transparent-bg.png" alt="spotter logo">
			<li><form><button class="nav-button" formaction="/#">Home</button></form></li>
			<li><form><button class="nav-button" formaction="/#/about">About</button></form></li>
			<li><form><button class="nav-button" formaction="/#/spotter-bot">SpotterBot</button></form></li>
			<li><form><button class="nav-button" formaction="/#/maps">GW2 Hi-Res Maps</button></form></li>
		</ul>
	</nav>
	<Router {routes}/>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		padding-top: 0px;
		max-width: 240px;
		margin: 0 auto;
	}

	nav {
		position: sticky;
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

	.nav-button {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		box-sizing: content-box;
		min-width: 64px;
		outline: none;		
		line-height: inherit;
		-webkit-appearance: none;
		vertical-align: middle;
		
		font-family: "Quicksand", sans-serif;
		letter-spacing: 1.25px;
		text-transform: uppercase;
		color: #FCF7F8;
		background: transparent;
		font-size: 1em;
		cursor: pointer;
		border: none;

		padding-bottom: 5px;
		padding-top: 5px;
	}

	.nav-button:after {
		content: '';
		position: absolute;
		width: 100%;
		transform: scaleX(0);
		height: 1px;
		bottom: 0;
		left: 0;
		background-color: #87BCDE;
		transform-origin: bottom right;
		transition: transform 0.25s ease-out;
	}

	.nav-button:hover:after {
		transform: scaleX(1);
		right: 5px;
		transform-origin: bottom left;
	}

	.nav-button:active {
		color: #87BCDE;
	}

	#logo {
		max-width: 115px;
		margin-right: auto;
		margin-left: -2%;
	}

	@media only screen and (min-width: 640px) {
		main {
			max-width: none;
		}
	}
	
</style>
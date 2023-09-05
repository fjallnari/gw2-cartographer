<script lang="ts">
    import { Rive } from "@rive-app/canvas";
    import { onDestroy, onMount } from "svelte";
    import LOADING_MESSAGES from "../enum/LoadingMessages";

    let canvas: HTMLCanvasElement, riveInstance: Rive;
    let interval: NodeJS.Timeout;

    const randomizeLoadingMessage = () => {
        return LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
    }

    let loadingMessage: string = randomizeLoadingMessage();
    

    onMount(() => {
        interval = setInterval(() => {
            loadingMessage = randomizeLoadingMessage();
        }, 3000);

        riveInstance = new Rive({
            src: "load_circle.riv",
            canvas: canvas,
            stateMachines: "load",
            autoplay: true,
            onLoad: () => {
                riveInstance?.resizeDrawingSurfaceToCanvas();
            }
        });
    });

    onDestroy(() => {
        riveInstance?.cleanup();
        clearInterval(interval);
    });

</script>

<div class="flex flex-col justify-center items-center gap-2 p-8">
    <canvas bind:this={canvas} class="w-48 h-48"></canvas>
    <p class="italic font-exo">
        {loadingMessage}
    </p>
</div>
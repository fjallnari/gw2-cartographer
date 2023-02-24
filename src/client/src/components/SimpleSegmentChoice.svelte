<script lang="ts">

    type IDNameObject = { id: string, name: string };

    export let options: IDNameObject[];
    export let final: IDNameObject;

    const capitalize = (text: string) => {
        return text.replace(/^./, str => str.toUpperCase());
    }

</script>

<segmented-choice>
    {#each options as option, lineOptionIndex}
        {#if lineOptionIndex !== 0}
            <div class="or-sign">
                {'OR'}
            </div>
        {/if}
        <box class='chip selectable {final === option ? 'selected': ''}' on:click={() => {final = option}} on:keyup={() => {}}>
            {capitalize(option.name)}
        </box>
    {/each}
</segmented-choice>

<style>
    segmented-choice {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5em;
        flex-wrap: wrap;
    }

    .or-sign {
        font-weight: var(--semi-bold);
    }

    .chip {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        gap: 0.2em;
        font-size: 1em;
        padding: 0.2em 0.4em;
        background-color: var(--clr-box-bg-lighter);
        flex-wrap: wrap;
        max-width: 90%;
    }

    .chip.selectable {
        cursor: pointer;
    }

    .chip.selected {
        background-color: var(--clr-accent-dark) !important;
        font-weight: var(--semi-bold);
    }
</style>
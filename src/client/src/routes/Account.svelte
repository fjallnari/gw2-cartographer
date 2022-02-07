<script lang="ts">
    import Login from '../components/Login.svelte';
    import Register from '../components/Register.svelte';
    import SegmentedButton, { Segment, Label } from '@smui/segmented-button';
    const views = [
        {name: 'login', component: Login},
        {name: 'register', component: Register}
    ];

    let selected = views[0];

</script>

<!-- Button to switch between login and register-->
<SegmentedButton segments={views} let:segment singleSelect bind:selected>
    <Segment {segment}>
      <Label>{segment.name}</Label>
    </Segment>
</SegmentedButton>

<div style="padding-top: 5em;" id="login-page">
    <svelte:component this={selected.component}/>
</div>

<style>
    #login-page {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        gap: 5em;
    }

</style>
<script>
    import { points } from "../data/points.js";
    import { t, waitLocale } from "svelte-i18n";
    import { onMount, createEventDispatcher } from "svelte";

    export let onSelect = (point) => {}; // callback from parent

    let query = "";
    let focused = false;
    let ready = false;

    const dispatch = createEventDispatcher();

    // Wait until translations are loaded
    onMount(async () => {
        await waitLocale();
        ready = true;
    });

    // Build search index from points
    $: searchIndex = points.features.map((f) => ({
        id: f.properties.ID,
        name: f.properties.name,
        type: f.properties.type,
        coordinates: f.geometry.coordinates,
        properties: f.properties,
    }));

    // Compute filtered results
    $: results =
        query.length > 1 || focused
            ? searchIndex
                  .filter((p) =>
                      p.name?.toLowerCase().includes(query.toLowerCase()),
                  )
                  .sort((a, b) => a.name.localeCompare(b.name))
            : [];

    // Handle selecting a point
    function selectPoint(point) {
        onSelect(point); // Trigger parent handler
        dispatch("select", point); // Optional Svelte event
        query = "";
        focused = false;
    }
</script>

<div class="search-container">
    {#if ready}
        <input
            type="text"
            bind:value={query}
            placeholder={$t("app.placeholder")}
            on:focus={() => (focused = true)}
            on:blur={() => setTimeout(() => (focused = false), 200)}
        />
    {:else}
        <input type="text" placeholder="..." disabled />
    {/if}

    {#if results.length && focused}
        <div class="search-results">
            {#each results as r}
                <button
                    type="button"
                    class="result-item"
                    on:click={() => selectPoint(r)}
                >
                    <strong style="color: {r.properties.hr};">{r.name}</strong>
                    <small style="color: {r.properties.hr};">({r.type})</small>
                </button>
            {/each}
        </div>
    {/if}
</div>

<style>
    .search-container {
        position: absolute;
        top: 25px;
        left: 25px;
        z-index: 9998;
        background: white;
        padding: 0.5rem;
        border-radius: 0.5rem;
        box-shadow: none;
        width: 300px;
        background-image: url("../assets/orchard.svg") !important;
        background-size: 100px 100px !important;
    }

    .search-container > input {
        background-color: white;
        color: #213547 !important;
        width: 90%;
        border-color: #21354730;
    }

    .search-results {
        max-height: 70vh !important;
        overflow-y: auto;
        margin-top: 0.25rem;
        border-top: 1px solid #ccc;
        color: #213547 !important;
    }

    .result-item {
        display: block;
        width: 100%;
        text-align: left;
        background: none;
        border: none;
        padding: 0.5rem;
        cursor: pointer;
        font-family: inherit;
        color: #213547 !important;
    }

    .result-item:hover {
        background-color: #f0f0f0;
    }

    input {
        width: 100%;
        padding: 0.5rem;
    }

    @media only screen and (max-width: 600px) {
        .search-container {
            left: 50%;
            transform: translateX(-50%);
        }
        .search-results {
            max-height: 25vh !important;
        }
    }
</style>

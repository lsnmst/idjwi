<script>
    import { points } from "../points.js";
    export let onSelect = (point) => {}; // ✅ expects a single argument

    let query = "";
    let focused = false;

    let searchIndex = [];

    $: searchIndex = points.features.map((f) => ({
        id: f.properties.ID,
        name: f.properties.name,
        type: f.properties.type,
        coordinates: f.geometry.coordinates,
        properties: f.properties,
    }));

    $: results =
        query.length > 1 || focused // ✅ Show all if focused and query is empty
            ? searchIndex.filter((p) =>
                  p.name?.toLowerCase().includes(query.toLowerCase()),
              )
            : [];

    function selectPoint(point) {
        console.log("Calling onSelect with point:", point);
        onSelect(point); // Will trigger handleSelectPoint from App.svelte
        query = "";
        results = [];
    }
</script>

<div class="search-container">
    <input
        type="text"
        bind:value={query}
        placeholder="Chercher par nom ..."
        on:focus={() => (focused = true)}
        on:blur={() => setTimeout(() => (focused = false), 200)}
    />
    {#if results.length}
        <div class="search-results">
            {#each results as r}
                <button
                    type="button"
                    class="result-item"
                    on:click={() => selectPoint(r)}
                >
                    <strong>{r.name}</strong> <small>({r.type})</small>
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
        z-index: 9999;
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
        max-height: 50%;
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
</style>

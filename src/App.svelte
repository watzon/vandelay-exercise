<main>
	<h1>Contact Cleaner</h1>
    <p>Use this to clean up your messy CSV contact sheets and turn them into beautiful JSON.</p>
    <br />
	<Dropzone
        dropzoneClass="dropzone"
        hoveringClass="dropzone-hovering"
        id="dz"
        on:addedfile={addedFile}
        on:processing={processingFile}
        on:complete={processingComplete}
        acceptedFiles="text/csv">
        {#if processing}
            <p>Processing...</p>
        {:else}
            <p>Click or drop a file here to upload</p>
        {/if}
    </Dropzone>
    <br />
    {#if showDownload}
        <div class="download-area">
            <p class="notice">Merged a total of {mergedContacts} contacts</p>
            <div class="download-buttons">
                <a class="download-button" href="#" download="contacts.json" on:click={openSucceededUri}>Download {succeededContacts} Contacts</a>
                <a class="download-button" href="#" download="failed-contacts.json" on:click={openFailedUri}>Download {failedContacts} Failed Contacts</a>
            </div>
            <p class="help">Right click and select "Save Link As..." to save</p>
        </div>
    {/if}
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}
	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
    }
    .download-area {
        margin: 0px auto;
        max-width: 500px;
    }
    .download-area .notice {
        color: #ff3e00;
        background: transparent;
        padding: 10px;
        border: 1px dotted #ff3e00;
        display: block;
        margin-top: 10px;
        text-align: center;
    }
    .download-area .help {
        color: #444444;
        background: transparent;
        padding: 10px;
        border: 1px dotted #444444;
        display: block;
        margin-top: 10px;
        text-align: center;
    }
    .download-buttons {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
    }
    .download-button {
        color: #ff3e00;
        text-decoration: none;
        background: transparent;
        padding: 10px;
        border: 1px solid #ff3e00;
        display: inline-block;
        flex-grow: 1;
        flex-basis: fit-content;
        text-align: center;
    }
    .download-button:not(:last-child) {
        margin-right: 5px;
    }
    .download-button:not(:first-child) {
        margin-left: 5px;
    }
	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>

<script>
    import Dropzone from "./Dropzone.svelte"
    import CSVParser from './csv_parser'

    let processing = false
    let succeededUri = null
    let failedUri = null
    let succeededContacts = 0
    let failedContacts = 0
    let mergedContacts = 0
    let showDownload = false
    
    const openSucceededUri = (e) => {
        e.preventDefault()
        window.open(succeededUri, 'contacts.json')
    }

    const openFailedUri = (e) => {
        e.preventDefault()
        window.open(failedUri, 'failed-contacts.json')
    }

    const addedFile = (e) => {
        const file = e.detail
        const reader = new FileReader(file)
        reader.onload = function(event) {
            const [, b64] = event.target.result.split(',')
            const text = atob(b64)
            processCSV(text)
        }
        reader.readAsDataURL(file)
    }

    const processingFile = (e) => processing = true
    const processingComplete = (e) => processing = false

    const processCSV = (csv) => {
        const { succeeded, failed, merged } = CSVParser.parse(csv)
        succeededUri = window.URL.createObjectURL(
            new Blob([JSON.stringify(succeeded)],
            {type: 'application/javascript'})
        )
        failedUri = 'data:application/json,' + encodeURIComponent(JSON.stringify(failed), null, 4)
        
        succeededContacts = succeeded.length
        failedContacts = failed.length
        mergedContacts = merged
        showDownload = true
    }
</script>
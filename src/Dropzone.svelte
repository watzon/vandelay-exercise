<div action="#" class="{dropzoneClass}" {id}>
    <slot />
    <input hidden name="sites_data" type="file" />
</div>

<style>
  .dropzone {
    height: 200px;
    background: #fdfdfd;
    border-radius: 5px;
    border: 2px dashed #ff3e00;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 300ms ease-out;
  }
  .dropzone.dropzone-hovering {
    border: 2px solid #ff3e00;
    background: rgba(255, 62, 0, 0.05);
  }
</style>

<script>
    import { onMount, createEventDispatcher } from 'svelte'
    import Dropzone from 'dropzone'
    const dispatch = createEventDispatcher()

    export let dropzoneClass = 'dropzone'
    export let hoveringClass = 'dropzone-hovering'
    export let id = 'dropId'
    export let autoDiscover = false

    export let clickable = true
    export let previewTemplate = "<div/>"
    export let acceptedFiles = null
    export let dictDefaultMessage = ''

    onMount(() => {
        const dropzoneElement = document.getElementById(id)
        if (!previewTemplate) {
            previewTemplate = "<div/>"
        }

        if (!dictDefaultMessage) {
            dictDefaultMessage = ""
        }

        let svDropzone = new Dropzone(`div#${id}`, {
            clickable,
            previewTemplate,
            acceptedFiles,
            dictDefaultMessage
        })

        if (autoDiscover !== true) {
            svDropzone.autoDiscover = false
        }

        svDropzone.on("addedfile", f => {
            dispatch('addedfile', f)
            dropzoneElement.classList.remove(hoveringClass)
        })

        svDropzone.on("processing", f => {
            dispatch('processing', f)
            dropzoneElement.classList.remove(hoveringClass)
        })

        svDropzone.on("complete", f => {
            dispatch('complete', f)
            dropzoneElement.classList.remove(hoveringClass)
        })

        svDropzone.on("dragenter", e => {
            dispatch('dragenter', e)
            dropzoneElement.classList.toggle(hoveringClass)
        })

        svDropzone.on("dragleave", e => {
            dispatch('dragleave', e)
            dropzoneElement.classList.toggle(hoveringClass)
        })

        if (clickable !== false) {
            dropzoneElement.style.cursor = "pointer"
        }

        svDropzone.on("error", (file, errorMessage) => {
            dispatch('error', [file, errorMessage])
            console.log(`Error: ${errorMessage}`)
        })
    })
</script>
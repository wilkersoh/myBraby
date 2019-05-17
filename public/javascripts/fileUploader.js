    
FilePond.registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageResize,
  FilePondPluginFileEncode,
)

FilePond.setOptions({
  stylePanelAspectRatio: 80 / 150,
  imageResizeTargetWidth: 50,
  imageResizeTargetHeight: 50
})

FilePond.parse(document.body);


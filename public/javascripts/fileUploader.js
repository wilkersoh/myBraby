    
FilePond.registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageResize,
  FilePondPluginFileEncode,
)

FilePond.setOptions({
  stylePanelAspectRatio: 50 / 150,
  imageResizeTargetWidth: 100,
  imageResizeTargetHeight: 150
})

FilePond.parse(document.body);


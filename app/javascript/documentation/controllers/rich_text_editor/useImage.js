import Image from '@tiptap/extension-image'

export const imageTargets = ['imagePanel']

export default (controller, _options = {}) => {
  const ImageExtensions = [Image]

  const openImagePanel = () => {
    controller.closeNodeSelect()
    controller.closeTablePanel()
    controller.closeLinkPanel()
  }

  const closeImagePanel = () => {
    if (!controller.hasImagePanelTarget) return

    controller.imagePanelTarget.classList.remove('is-active')
  }

  const addImage = event => {
    controller.runCommand('setImage', {
      src: event.target.dataset.sourceUrl
    })
  }

  Object.assign(controller, {
    openImagePanel,
    closeImagePanel,
    addImage
  })

  return { ImageExtensions }
}

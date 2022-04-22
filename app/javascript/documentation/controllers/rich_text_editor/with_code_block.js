import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import lowlight from './lowlight'

export default (controller, _options = {}) => {
  const CodeBlockExtenstions = [
    CodeBlockLowlight.configure({
      lowlight
    })
  ]

  const toggleCodeBlock = () => {
    controller.runCommand('toggleCodeBlock')
  }

  Object.assign(controller, {
    toggleCodeBlock
  })

  return { CodeBlockExtenstions }
}

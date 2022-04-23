import Bold from '@tiptap/extension-bold'
import Code from '@tiptap/extension-code'
// import Highlight from '@tiptap/extension-highlight'
import Italic from '@tiptap/extension-italic'
import Strike from '@tiptap/extension-strike'
// import Subscript from '@tiptap/extension-subscript'
// import Superscript from '@tiptap/extension-superscript'
// import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'

export const marksTargets = ['bold', 'italic', 'underline', 'link']
export const toolbarMarks = [
  { target: 'bold', name: 'bold' },
  { target: 'italic', name: 'italic' },
  { target: 'underline', name: 'underline' },
  { target: 'link', name: 'link' }
]

export default (controller, _options = {}) => {
  const MarkExtensions = [Bold, Code, Italic, Strike, Underline]

  const toggleBold = () => {
    controller.runCommand('toggleBold')
  }

  const toggleItalic = () => {
    controller.runCommand('toggleItalic')
  }

  const toggleUnderline = () => {
    controller.runCommand('toggleUnderline')
  }

  const enableSelectedToolbarMarks = () => {
    toolbarMarks.forEach(({ target, name, attributes }) => {
      if (
        controller.editor.isActive(name, attributes) &&
        controller.hasTarget(target)
      ) {
        controller[`${target}Target`].classList.add('is-active')
      }
    })
  }

  Object.assign(controller, {
    toggleBold,
    toggleItalic,
    toggleUnderline,
    enableSelectedToolbarMarks
  })

  return { MarkExtensions }
}

import { Controller } from '@hotwired/stimulus'
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import BubbleMenu from '@tiptap/extension-bubble-menu'
import Underline from '@tiptap/extension-underline'

export default class RichTextEditorController extends Controller {
  static targets = ['bubbleMenu', 'bold', 'italic', 'underline']
  static values = {
    content: { type: String, default: '' }
  }

  toolbarButtons = ['bold', 'italic', 'underline']

  connect () {
    this.editor = new Editor({
      element: this.element,
      extensions: [
        StarterKit,
        Underline,
        BubbleMenu.configure({
          element: this.bubbleMenuTarget,
          tippyOptions: { appendTo: this.element, duration: 100 }
        })
      ],
      autofocus: true,
      content: this.contentValue
    })

    this.editor.on('transaction', () => {
      this.resetMenuButtons()
      this.enableSelectedMenuButtons()
    })
  }

  toggleBold () {
    this.runCommand('toggleBold')
  }

  toggleItalic () {
    this.runCommand('toggleItalic')
  }

  toggleUnderline () {
    this.runCommand('toggleUnderline')
  }

  runCommand (name) {
    this.editor
      .chain()
      .focus()
      [name]()
      .run()
  }

  resetMenuButtons () {
    this.toolbarButtons.forEach(button => {
      if (this.hasTarget(button)) {
        this[`${button}Target`].classList.remove('is-active')
      }
    })
  }

  enableSelectedMenuButtons () {
    this.toolbarButtons.forEach(button => {
      if (this.editor.isActive(button) && this.hasTarget(button)) {
        this[`${button}Target`].classList.add('is-active')
      }
    })
  }

  hasTarget (name) {
    const capitalizedName = name[0].toUpperCase() + name.slice(1).toLowerCase()
    return this[`has${capitalizedName}Target`]
  }
}

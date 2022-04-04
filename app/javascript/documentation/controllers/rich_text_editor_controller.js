import { Controller } from '@hotwired/stimulus'
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import BubbleMenu from '@tiptap/extension-bubble-menu'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'

import throttle from 'lodash.throttle'

export default class RichTextEditorController extends Controller {
  static targets = ['bubbleMenu', 'bold', 'italic', 'underline', 'output']
  static values = {
    content: { type: String, default: '' },
    placeholder: { type: String, default: '' }
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
        }),
        Placeholder.configure({
          placeholder: this.placeholderValue
        })
      ],
      autofocus: true,
      content: this.contentValue,
      onUpdate: this.throttledUpdate
    })

    this.editor.on('transaction', () => {
      this.resetMenuButtons()
      this.enableSelectedMenuButtons()
    })
  }

  onUpdate = ({ editor }) => {
    this.outputTarget.value = editor.getHTML()
  }
  throttledUpdate = throttle(this.onUpdate, 1000)

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

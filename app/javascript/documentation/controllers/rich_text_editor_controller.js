import { Controller } from '@hotwired/stimulus'
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import BubbleMenu from '@tiptap/extension-bubble-menu'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'

import throttle from 'lodash.throttle'

export default class RichTextEditorController extends Controller {
  static targets = [
    'bubbleMenu',
    'h1',
    'h2',
    'h3',
    'bold',
    'italic',
    'underline',
    'output'
  ]
  static values = {
    content: { type: String, default: '' },
    placeholder: { type: String, default: '' }
  }

  toolbarButtons = [
    { target: 'h1', name: 'heading', param: { level: 1 } },
    { target: 'h2', name: 'heading', param: { level: 2 } },
    { target: 'h3', name: 'heading', param: { level: 3 } },
    { target: 'bold', name: 'bold' },
    { target: 'italic', name: 'italic' },
    { target: 'underline', name: 'underline' }
  ]

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

  toggleH1 () {
    this.runCommand('toggleHeading', { level: 1 })
  }

  toggleH2 () {
    this.runCommand('toggleHeading', { level: 2 })
  }

  toggleH3 () {
    this.runCommand('toggleHeading', { level: 3 })
  }

  runCommand (name, param) {
    this.editor
      .chain()
      .focus()
      [name](param)
      .run()
  }

  resetMenuButtons () {
    this.toolbarButtons.forEach(({ target }) => {
      if (this.hasTarget(target)) {
        this[`${target}Target`].classList.remove('is-active')
      }
    })
  }

  enableSelectedMenuButtons () {
    this.toolbarButtons.forEach(({ target, name, param }) => {
      if (this.editor.isActive(name, param) && this.hasTarget(target)) {
        this[`${target}Target`].classList.add('is-active')
      }
    })
  }

  hasTarget (name) {
    const capitalizedName = name[0].toUpperCase() + name.slice(1).toLowerCase()
    return this[`has${capitalizedName}Target`]
  }
}

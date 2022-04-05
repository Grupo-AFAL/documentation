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
    'dropdown',
    'dropdownTrigger',
    'text',
    'h1',
    'h2',
    'h3',
    'ul',
    'ol',
    'blockquote',
    'bold',
    'italic',
    'underline',
    'output'
  ]
  static values = {
    content: { type: String, default: '' },
    placeholder: { type: String, default: '' }
  }

  toolbarMarks = [
    { target: 'bold', name: 'bold' },
    { target: 'italic', name: 'italic' },
    { target: 'underline', name: 'underline' }
  ]

  toolbarTypes = [
    {
      target: 'h1',
      name: 'heading',
      attributes: { level: 1 },
      text: 'Heading 1'
    },
    {
      target: 'h2',
      name: 'heading',
      attributes: { level: 2 },
      text: 'Heading 2'
    },
    {
      target: 'h3',
      name: 'heading',
      attributes: { level: 3 },
      text: 'Heading 3'
    },
    {
      name: 'bulletList',
      target: 'ul',
      text: 'Bulleted List'
    },
    {
      name: 'orderedList',
      target: 'ol',
      text: 'Ordered List'
    },
    {
      name: 'blockquote',
      target: 'blockquote',
      text: 'Quote'
    },
    {
      name: 'paragraph',
      target: 'text',
      text: 'Text'
    }
  ]

  allMenuButtons = this.toolbarMarks.concat(this.toolbarTypes)

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
      this.enableSelectedToolbarMarks()
      this.enableSelectedToolbarType()
      this.setCurrentToolbarType()
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

  setParagraph () {
    this.runCommand('setParagraph')
  }

  toggleBulletList () {
    this.runCommand('toggleBulletList')
  }

  toggleOrderedList () {
    this.runCommand('toggleOrderedList')
  }

  toggleBlockquote () {
    this.runCommand('toggleBlockquote')
  }

  runCommand (name, attributes) {
    this.editor
      .chain()
      .focus()
      [name](attributes)
      .run()
  }

  resetMenuButtons () {
    if (this.hasDropdownTarget) {
      this.dropdownTarget.classList.remove('is-active')
    }

    this.allMenuButtons.forEach(({ target }) => {
      if (this.hasTarget(target)) {
        this[`${target}Target`].classList.remove('is-active')
      }
    })
  }

  enableSelectedToolbarMarks () {
    this.toolbarMarks.forEach(({ target, name, attributes }) => {
      if (this.editor.isActive(name, attributes) && this.hasTarget(target)) {
        this[`${target}Target`].classList.add('is-active')
      }
    })
  }

  enableSelectedToolbarType () {
    this.toolbarTypes.some(({ target, name, attributes }) => {
      if (this.editor.isActive(name, attributes) && this.hasTarget(target)) {
        this[`${target}Target`].classList.add('is-active')
        return true
      }
    })
  }

  setCurrentToolbarType () {
    if (!this.hasDropdownTriggerTarget) return

    const selectedType = this.selectedToolbarType()
    this.dropdownTriggerTarget.innerHTML = selectedType.text
  }

  selectedToolbarType () {
    return this.toolbarTypes.find(({ name, attributes }) => {
      return this.editor.isActive(name, attributes)
    })
  }

  hasTarget (name) {
    const capitalizedName = name[0].toUpperCase() + name.slice(1).toLowerCase()
    return this[`has${capitalizedName}Target`]
  }
}

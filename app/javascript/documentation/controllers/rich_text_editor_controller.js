import { Controller } from '@hotwired/stimulus'
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import BubbleMenu from '@tiptap/extension-bubble-menu'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'

import withTable, { tableTargets } from './rich_text_editor/with_table'
import withLink, { linkTargets } from './rich_text_editor/with_link'
import withMention from './rich_text_editor/with_mention'
import withCodeBlock from './rich_text_editor/with_code_block'

import throttle from 'lodash.throttle'

export default class RichTextEditorController extends Controller {
  static targets = [
    'bubbleMenu',
    'nodeSelect',
    'nodeSelectTrigger',
    'text',
    'h1',
    'h2',
    'h3',
    'ul',
    'ol',
    'blockquote',
    'codeBlock',
    'bold',
    'italic',
    'underline',
    'link',
    'output',
    ...linkTargets,
    ...tableTargets
  ]

  static values = {
    content: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    editable: { type: Boolean, default: true }
  }

  toolbarMarks = [
    { target: 'bold', name: 'bold' },
    { target: 'italic', name: 'italic' },
    { target: 'underline', name: 'underline' },
    { target: 'link', name: 'link' }
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
      name: 'codeBlock',
      target: 'codeBlock',
      text: 'Code'
    },
    {
      name: 'paragraph',
      target: 'text',
      text: 'Text'
    }
  ]

  allMenuButtons = this.toolbarMarks.concat(this.toolbarTypes)

  connect () {
    const { TableExtensions } = withTable(this)
    const { LinkExtensions } = withLink(this)
    const { MentionExtensions } = withMention(this)
    const { CodeBlockExtenstions } = withCodeBlock(this)

    const extensions = [
      StarterKit.configure({
        blockquote: true,
        bold: true,
        bulletList: true,
        code: true,
        codeBlock: true,
        document: true,
        dropcursor: true,
        gapcursor: true,
        hardBreak: true,
        heading: true,
        history: true,
        horizontalRule: true,
        italic: true,
        listItem: true,
        orderedList: true,
        paragraph: true,
        strike: true,
        text: true
      }),
      Underline,
      Placeholder.configure({
        placeholder: this.placeholderValue
      }),
      ...CodeBlockExtenstions,
      ...LinkExtensions,
      ...TableExtensions,
      ...MentionExtensions
    ]

    if (this.editableValue && this.hasBubbleMenuTarget) {
      extensions.push(
        BubbleMenu.configure({
          element: this.bubbleMenuTarget,
          tippyOptions: { appendTo: this.element, duration: 100 }
        })
      )
    }

    this.editor = new Editor({
      element: this.element,
      extensions,
      autofocus: true,
      content: this.contentValue,
      onUpdate: this.throttledUpdate,
      editable: this.editableValue
    })

    this.editor.on('transaction', () => {
      this.resetMenuButtons()
      this.enableSelectedToolbarMarks()
      this.enableSelectedToolbarType()
      this.setCurrentToolbarType()
      this.updateTableModifiers()
    })
  }

  disconnect () {
    this.editor.destroy()
  }

  onUpdate = ({ editor }) => {
    if (!this.hasOutputTarget) return

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

  openNodeSelect () {
    this.closeLinkPanel()
    this.closeTablePanel()
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
    this.closeNodeSelect()
    this.closeLinkPanel()

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
    if (!this.hasNodeSelectTriggerTarget) return

    const selectedType = this.selectedToolbarType()
    if (selectedType) {
      this.nodeSelectTriggerTarget.innerHTML = selectedType.text
    }
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

  closeNodeSelect () {
    if (!this.hasNodeSelectTarget) return

    this.nodeSelectTarget.classList.remove('is-active')
  }
}

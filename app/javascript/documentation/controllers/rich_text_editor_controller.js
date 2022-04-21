import { Controller } from '@hotwired/stimulus'
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import BubbleMenu from '@tiptap/extension-bubble-menu'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Mention from '@tiptap/extension-mention'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'

import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import lowlight from 'lowlight/lib/core'
import css from 'highlight.js/lib/languages/css'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import ruby from 'highlight.js/lib/languages/ruby'
import scss from 'highlight.js/lib/languages/scss'
import sql from 'highlight.js/lib/languages/sql'
import xml from 'highlight.js/lib/languages/xml'
import yaml from 'highlight.js/lib/languages/yaml'

lowlight.registerLanguage('css', css)
lowlight.registerLanguage('javascript', javascript)
lowlight.registerLanguage('json', json)
lowlight.registerLanguage('ruby', ruby)
lowlight.registerLanguage('scss', scss)
lowlight.registerLanguage('sql', sql)
lowlight.registerLanguage('xml', xml)
lowlight.registerLanguage('yaml', yaml)

import suggestion from '../rich_text_editor/suggestion'

import throttle from 'lodash.throttle'

export default class RichTextEditorController extends Controller {
  static targets = [
    'bubbleMenu',
    'nodeSelect',
    'nodeSelectTrigger',
    'linkPanel',
    'linkInput',
    'text',
    'h1',
    'h2',
    'h3',
    'ul',
    'ol',
    'tablePanel',
    'blockquote',
    'codeBlock',
    'bold',
    'italic',
    'underline',
    'link',
    'output'
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
    const extensions = [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: this.placeholderValue
      }),
      Link.configure({
        openOnClick: false
      }),
      CodeBlockLowlight.configure({
        lowlight
      }),
      Table.configure({
        resizable: false
      }),
      TableRow,
      TableCell,
      TableHeader,
      Mention.configure({
        HTMLAttributes: {
          class: 'suggestion'
        },
        renderLabel ({ options, node }) {
          return `${options.suggestion.char}${node.attrs.label}`
        },
        suggestion
      })
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

  closeLinkPanel () {
    if (!this.hasLinkPanelTarget) return

    this.linkPanelTarget.classList.remove('is-active')
  }

  openLinkPanel () {
    this.closeNodeSelectDropdown()
    this.closeTablePanel()

    const link = this.editor.getAttributes('link')
    this.linkInputTarget.innerHTML = link.href || ''
    this.linkInputTarget.focus()
  }

  openTablePanel () {
    this.closeNodeSelectDropdown()
    this.closeLinkPanel()
  }

  closeTablePanel () {
    if (!this.hasTablePanelTarget) return

    this.tablePanelTarget.classList.remove('is-active')
  }

  openNodeSelect () {
    this.closeLinkPanel()
    this.closeTablePanel()
  }

  saveLinkUrl (event) {
    if (event.key !== 'Enter') return
    const url = event.target.innerHTML

    if (url == '') {
      this.editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .unsetLink()
        .run()
    } else {
      this.editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: event.target.innerHTML, target: '_blank' })
        .run()
    }

    this.linkInputTarget.innerHTML = ''
  }

  // TODO: Create PageLink extension to be able to store reference to the page.
  savePageLink (event) {
    const { url } = event.target.dataset

    this.editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url, target: '_blank' })
      .run()
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

  toggleCodeBlock () {
    this.runCommand('toggleCodeBlock')
  }

  insertTable () {
    this.runCommand('insertTable', { rows: 3, cols: 3, withHeaderRow: true })
  }

  addColumnBefore (e) {
    this.runTableCommand(e, 'addColumnBefore')
  }

  addColumnAfter (e) {
    this.runTableCommand(e, 'addColumnAfter')
  }

  addRowBefore (e) {
    this.runTableCommand(e, 'addRowBefore')
  }

  addRowAfter (e) {
    this.runTableCommand(e, 'addRowAfter')
  }

  deleteColumn (e) {
    this.runTableCommand(e, 'deleteColumn')
  }

  deleteRow (e) {
    this.runTableCommand(e, 'deleteRow')
  }

  runTableCommand (event, name) {
    if (!this.editor.isActive('table')) {
      return event.stopPropagation()
    }

    this.runCommand(name)
  }

  updateTableModifiers () {
    const tableIsActive = this.editor.isActive('table')

    this.tableModifierTargets().forEach(modifier => {
      tableIsActive
        ? modifier.classList.remove('disabled')
        : modifier.classList.add('disabled')
    })
  }

  tableModifierTargets () {
    if (!this.hasTablePanelTarget) return []

    return Array.from(this.tablePanelTarget.querySelectorAll('.modifier'))
  }

  runCommand (name, attributes) {
    this.editor
      .chain()
      .focus()
      [name](attributes)
      .run()
  }

  resetMenuButtons () {
    this.closeNodeSelectDropdown()
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

  closeNodeSelectDropdown () {
    if (!this.hasNodeSelectTarget) return

    this.nodeSelectTarget.classList.remove('is-active')
  }
}

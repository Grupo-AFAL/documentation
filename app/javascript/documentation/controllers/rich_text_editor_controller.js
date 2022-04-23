import { Controller } from '@hotwired/stimulus'
import { Editor } from '@tiptap/core'
import throttle from 'lodash.throttle'

import withDefaults, { defaultTargets } from './rich_text_editor/with_defaults'
import withMarks, {
  marksTargets,
  toolbarMarks
} from './rich_text_editor/with_marks'
import withTable, { tableTargets } from './rich_text_editor/with_table'
import withLink, { linkTargets } from './rich_text_editor/with_link'
import withMention from './rich_text_editor/with_mention'
import withNodes, {
  nodesTargets,
  toolbarNodes
} from './rich_text_editor/with_nodes'

export default class RichTextEditorController extends Controller {
  static targets = [
    ...defaultTargets,
    ...nodesTargets,
    ...marksTargets,
    ...linkTargets,
    ...tableTargets,
    'output'
  ]

  static values = {
    content: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    editable: { type: Boolean, default: true }
  }

  allMenuButtons = toolbarMarks.concat(toolbarNodes)

  connect () {
    const { DefaultExtensions } = withDefaults(this)
    const { NodesExtensions } = withNodes(this)
    const { MarkExtensions } = withMarks(this)
    const { TableExtensions } = withTable(this)
    const { LinkExtensions } = withLink(this)
    const { MentionExtensions } = withMention(this)

    this.editor = new Editor({
      element: this.element,
      extensions: [
        ...DefaultExtensions,
        ...NodesExtensions,
        ...MarkExtensions,
        ...LinkExtensions,
        ...TableExtensions,
        ...MentionExtensions
      ],
      autofocus: true,
      content: this.contentValue,
      onUpdate: this.throttledUpdate,
      editable: this.editableValue
    })

    this.editor.on('transaction', () => {
      this.resetMenuButtons()
      this.enableSelectedToolbarMarks()
      this.enableSelectedToolbarNode()
      this.setCurrentToolbarNode()
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

  hasTarget (name) {
    const capitalizedName = name[0].toUpperCase() + name.slice(1).toLowerCase()
    return this[`has${capitalizedName}Target`]
  }
}

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
import useImagePanel, {
  imagePanelTargets
} from './rich_text_editor/useImagePanel'

export default class RichTextEditorController extends Controller {
  static targets = [
    ...defaultTargets,
    ...nodesTargets,
    ...marksTargets,
    ...linkTargets,
    ...tableTargets,
    ...imagePanelTargets,
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

    useImagePanel(this)

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
      this.closeAllPanels()
      this.resetMenuButtons()
      this.enableSelectedToolbarMarks()
      this.enableSelectedToolbarNode()
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

  closeAllPanels () {
    this.closeNodeSelect()
    this.closeLinkPanel()
    this.closeTablePanel()
    this.closeImagePanel()
  }

  resetMenuButtons () {
    this.allMenuButtons.forEach(({ target }) => {
      const targetNode = this.targets.find(target)
      if (targetNode) {
        targetNode.classList.remove('is-active')
      }
    })
  }
}

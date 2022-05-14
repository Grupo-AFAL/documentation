import { Controller } from '@hotwired/stimulus'
import { Editor } from '@tiptap/core'
import throttle from 'lodash.throttle'

import useDefaults, { defaultTargets } from './rich_text_editor/useDefaults'
import useMarks, {
  marksTargets,
  toolbarMarks
} from './rich_text_editor/useMarks'
import useTable, { tableTargets } from './rich_text_editor/useTable'
import useLink, { linkTargets } from './rich_text_editor/useLink'
import useMention from './rich_text_editor/useMention'
import useNodes, {
  nodesTargets,
  toolbarNodes
} from './rich_text_editor/useNodes'
import useImage, { imageTargets } from './rich_text_editor/useImage'
import useSlashCommands from './rich_text_editor/useSlashCommands'

export default class RichTextEditorController extends Controller {
  static targets = [
    ...defaultTargets,
    ...nodesTargets,
    ...marksTargets,
    ...linkTargets,
    ...tableTargets,
    ...imageTargets,
    'output'
  ]

  static values = {
    content: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    editable: { type: Boolean, default: true },
    imagesUrl: String
  }

  allMenuButtons = toolbarMarks.concat(toolbarNodes)

  connect () {
    const { DefaultExtensions } = useDefaults(this, {
      placeholder: this.placeholderValue
    })
    const { NodesExtensions } = useNodes(this)
    const { MarkExtensions } = useMarks(this)
    const { TableExtensions } = useTable(this)
    const { LinkExtensions } = useLink(this)
    const { MentionExtensions } = useMention(this)
    const { ImageExtensions } = useImage(this)
    const { SlashCommandsExtension } = useSlashCommands(this)

    this.editor = new Editor({
      element: this.element,
      extensions: [
        ...DefaultExtensions,
        ...NodesExtensions,
        ...MarkExtensions,
        ...LinkExtensions,
        ...TableExtensions,
        ...MentionExtensions,
        ...ImageExtensions,
        ...SlashCommandsExtension
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

  hideMenu () {
    this.editor
      .chain()
      .focus()
      .blur()
      .run()
  }
}

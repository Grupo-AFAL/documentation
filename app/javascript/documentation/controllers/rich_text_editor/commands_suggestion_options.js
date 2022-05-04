import imagePlaceholderUrl from './assets/image_placeholder.png'
import SuggestionRenderer from './suggestion_renderer'

/**
 * Tiptap suggestion utility
 *
 * https://tiptap.dev/api/utilities/suggestion
 */
export default {
  decorationClass: 'slash-command',
  items: ({ query }) => {
    return [
      {
        title: 'Table',
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run()
        }
      },
      {
        title: 'Image',
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setImage({ src: imagePlaceholderUrl })
            .run()
        }
      }
    ]
      .filter(item => item.title.toLowerCase().startsWith(query.toLowerCase()))
      .slice(0, 10)
  },

  render: SuggestionRenderer
}

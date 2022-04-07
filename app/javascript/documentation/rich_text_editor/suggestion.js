import tippy from 'tippy.js'
import { get } from '@rails/request.js'
import PopUpListComponent from './popup_list_component'

/**
 * Tiptap suggestion utility
 *
 * https://tiptap.dev/api/utilities/suggestion
 */
export default {
  items: async ({ query }) => {
    const response = await get('/documentation/pages', {
      query: { title: query },
      responseKind: 'json'
    })

    if (!response.ok) return []

    return await response.json
  },

  render: () => {
    let component = new PopUpListComponent()
    let popup

    return {
      onStart: ({ clientRect }) => {
        popup = tippy('body', {
          getReferenceClientRect: clientRect,
          appendTo: () => document.body,
          allowHTML: true,
          content: component.render(),
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
          arrow: false
        })
      },

      onUpdate ({ items, command, clientRect }) {
        component.updateProps({ items, command })
        component.render()
        popup[0].setProps({ getReferenceClientRect: clientRect })
      },

      onKeyDown ({ event }) {
        if (event.key === 'Escape') {
          popup[0].hide()
          return true
        } else if (event.key === 'Enter') {
          component.selectActiveItem()
          return true
        } else if (event.key === 'ArrowUp') {
          component.goUp()
          return true
        } else if (event.key === 'ArrowDown') {
          component.goDown()
          return true
        }
      },

      onExit () {
        popup[0].destroy()
        component.destroy()
      }
    }
  }
}

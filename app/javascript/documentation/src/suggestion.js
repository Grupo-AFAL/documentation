import tippy from 'tippy.js'
import { get } from '@rails/request.js'

const createMentionContent = () => {
  const component = document.createElement('div')
  component.classList.add('dropdown-content')
  return component
}

const createMentionItem = (content, classNames = '') => {
  const item = document.createElement('div')
  item.classList.add('dropdown-item', classNames)
  item.innerHTML = content
  return item
}

class MentionComponent {
  constructor () {
    this.selectedIndex = 0
    this.items = []
    this.element = createMentionContent()
    this.command = null
  }
  render () {
    this.element.innerHTML = ''
    this.items.forEach((item, index) => {
      const classNames = index === this.selectedIndex ? 'is-active' : 'inactive'
      this.element.appendChild(createMentionItem(item, classNames))
    })
    return this.element
  }
  updateProps ({ items, command }) {
    this.items = items
    this.command = command
  }
  selectActiveItem () {
    this.command({ id: this.items[this.selectedIndex] })
  }
  updateActiveItem (index) {
    this.selectedIndex = index
    this.render()
  }
  goUp () {
    const newSelectedIndex =
      (this.selectedIndex + this.items.length - 1) % this.items.length
    this.updateActiveItem(newSelectedIndex)
  }
  goDown () {
    const newSelectedIndex = (this.selectedIndex + 1) % this.items.length
    this.updateActiveItem(newSelectedIndex)
  }
  destroy () {
    this.element.remove()
  }
}

export default {
  items: async ({ query }) => {
    const response = await get('/documentation/pages', {
      query: { title: query },
      responseKind: 'json'
    })

    if (response.ok) {
      const json = await response.json
      return json.map(o => o.title)
    }
  },

  render: () => {
    let component = new MentionComponent()
    let popup

    return {
      onStart: props => {
        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
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

      onUpdate (props) {
        component.updateProps(props)
        component.render()

        popup[0].setProps({
          getReferenceClientRect: props.clientRect
        })
      },

      onKeyDown (props) {
        console.log(props)
        if (props.event.key === 'Escape') {
          popup[0].hide()
          return true
        } else if (props.event.key === 'Enter') {
          component.selectActiveItem()
          return true
        } else if (props.event.key === 'ArrowUp') {
          component.goUp()
        } else if (props.event.key === 'ArrowDown') {
          component.goDown()
        }
      },

      onExit () {
        popup[0].destroy()
        component.destroy()
      }
    }
  }
}

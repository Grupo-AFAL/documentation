const createMentionContent = () => {
  const div = document.createElement('div')
  div.classList.add('dropdown-content')
  return div
}

const createMentionItem = (item, classNames = '') => {
  const div = document.createElement('div')
  div.classList.add('dropdown-item', classNames)
  div.innerHTML = item.title
  return div
}

export default class MentionComponent {
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
    const { id, url, title } = this.items[this.selectedIndex]
    this.command({ id: url, url, label: title })
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

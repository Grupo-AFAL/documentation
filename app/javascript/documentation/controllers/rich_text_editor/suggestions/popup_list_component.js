const createRoot = ({ className } = {}) => {
  const div = document.createElement('div')
  div.classList.add('dropdown-content', className)
  return div
}

const createItem = (item, classNames = '') => {
  const div = document.createElement('div')
  div.classList.add('dropdown-item', classNames)
  div.innerHTML = item.title
  return div
}

export default class PopUpListComponent {
  constructor ({ rootOptions } = {}) {
    this.selectedIndex = 0
    this.items = []
    this.command = () => {}
    this.element = createRoot(rootOptions)
  }

  render () {
    this.element.innerHTML = ''
    this.items.forEach((item, index) => {
      const classNames = index === this.selectedIndex ? 'is-active' : 'inactive'
      this.element.appendChild(createItem(item, classNames))
    })
    return this.element
  }

  updateProps ({ items, command }) {
    this.items = items
    this.command = command
  }

  selectActiveItem () {
    const { id, url, title, command } = this.items[this.selectedIndex]
    this.command({ id: url, url, label: title, command })
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

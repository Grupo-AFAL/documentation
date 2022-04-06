import { Controller } from '@hotwired/stimulus'

export default class TiptapMentionController extends Controller {
  connect () {
    this.element.addEventListener('click', () => {
      window.location.assign(this.element.dataset.id)
    })
  }
}

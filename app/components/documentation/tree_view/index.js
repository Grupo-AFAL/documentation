import { Controller } from '@hotwired/stimulus'

export class TreeViewController extends Controller {
  toggle (event) {
    if (event.target.parentElement.nextElementSibling) {
      event.target.parentElement.nextElementSibling.classList.toggle(
        'is-hidden'
      )
    }

    event.target.classList.toggle('caret-down')
  }
}

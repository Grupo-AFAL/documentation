import '@hotwired/turbo-rails'

import { Application } from '@hotwired/stimulus'
import { NotificationController, SlimSelectController } from 'frontend-helpers'

import { DropdownController, TabsController } from 'bali-view-components'

import RichTextEditorController from './controllers/rich_text_editor_controller'

const application = Application.start()

application.register('dropdown', DropdownController)
application.register('notification', NotificationController)
application.register('rich-text-editor', RichTextEditorController)
application.register('slim-select', SlimSelectController)
application.register('tabs', TabsController)

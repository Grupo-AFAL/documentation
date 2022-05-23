import '@hotwired/turbo-rails'

import { Application } from '@hotwired/stimulus'
import {
  FileInputController,
  NotificationController,
  SlimSelectController,
  SubmitOnChangeController
} from 'frontend-helpers'

import {
  DropdownController,
  ModalController,
  TabsController,
  TreeViewItemController
} from 'bali-view-components'

import RichTextEditorController from './controllers/rich_text_editor_controller'

const application = Application.start()

application.register('dropdown', DropdownController)
application.register('file-input', FileInputController)
application.register('modal', ModalController)
application.register('notification', NotificationController)
application.register('rich-text-editor', RichTextEditorController)
application.register('slim-select', SlimSelectController)
application.register('submit-on-change', SubmitOnChangeController)
application.register('tabs', TabsController)
application.register('tree-view-item', TreeViewItemController)

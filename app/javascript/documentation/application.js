import '@hotwired/turbo-rails'

import { Application } from '@hotwired/stimulus'
import {
  FileInputController,
  NotificationController,
  SlimSelectController
} from 'frontend-helpers'

import {
  DropdownController,
  ModalController,
  TabsController
} from 'bali-view-components'

import { TreeViewController } from '../../components/documentation/tree_view'

import RichTextEditorController from './controllers/rich_text_editor_controller'

const application = Application.start()

application.register('dropdown', DropdownController)
application.register('file-input', FileInputController)
application.register('modal', ModalController)
application.register('notification', NotificationController)
application.register('rich-text-editor', RichTextEditorController)
application.register('slim-select', SlimSelectController)
application.register('tabs', TabsController)
application.register('tree-view', TreeViewController)

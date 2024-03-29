import '@hotwired/turbo-rails'

import { Application } from '@hotwired/stimulus'

import {
  DropdownController,
  FileInputController,
  ModalController,
  NotificationController,
  PrintController,
  RichTextEditorController,
  SlimSelectController,
  SubmitOnChangeController,
  TabsController,
  TreeViewItemController
} from 'bali-view-components'

const application = Application.start()

application.register('dropdown', DropdownController)
application.register('file-input', FileInputController)
application.register('modal', ModalController)
application.register('notification', NotificationController)
application.register('print', PrintController)
application.register('rich-text-editor', RichTextEditorController)
application.register('slim-select', SlimSelectController)
application.register('submit-on-change', SubmitOnChangeController)
application.register('tabs', TabsController)
application.register('tree-view-item', TreeViewItemController)

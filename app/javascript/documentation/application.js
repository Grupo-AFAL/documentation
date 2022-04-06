import '@hotwired/turbo-rails'

import { Application } from '@hotwired/stimulus'
import {
  DropdownController,
  NotificationController,
  SlimSelectController
} from 'frontend-helpers'

import RichTextEditorController from './controllers/rich_text_editor_controller'
import TiptapMentionController from './controllers/tiptap_mention_controller'

const application = Application.start()

application.register('dropdown', DropdownController)
application.register('notification', NotificationController)
application.register('rich-text-editor', RichTextEditorController)
application.register('slim-select', SlimSelectController)
application.register('tiptap-mention', TiptapMentionController)

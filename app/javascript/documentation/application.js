import '@hotwired/turbo-rails'

import { Application } from '@hotwired/stimulus'
import { NotificationController } from 'frontend-helpers'

import RichTextEditorController from './controllers/rich_text_editor_controller'

const application = Application.start()

application.register('notification', NotificationController)
application.register('rich-text-editor', RichTextEditorController)

// console.log('hello world')

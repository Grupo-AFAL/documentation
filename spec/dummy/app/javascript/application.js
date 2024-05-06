// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails

import { application } from 'controllers/application'
import { Turbo } from '@hotwired/turbo-rails'
import * as ActiveStorage from '@rails/activestorage'
import 'controllers'

import { DropdownController } from 'bali/dropdown'
import { FileInputController } from 'bali/file-input'
import { ModalController } from 'bali/modal'
import { NotificationController } from 'bali/notification'
import { PrintController } from 'bali/print'
import { RichTextEditorController } from 'bali/rich_text_editor'
import { SlimSelectController } from 'bali/slim-select'
import { SubmitOnChangeController } from 'bali/submit-on-change'
import { SubmitButtonController } from 'bali/submit-button'
import { TabsController } from 'bali/tabs'
import { TreeViewItemController } from 'bali/tree-view/item'
import { TrixAttachmentsController } from 'bali/trix-attachments'

ActiveStorage.start()

window.Turbo = Turbo

application.register('dropdown', DropdownController)
application.register('file-input', FileInputController)
application.register('modal', ModalController)
application.register('notification', NotificationController)
application.register('print', PrintController)
application.register('rich-text-editor', RichTextEditorController)
application.register('slim-select', SlimSelectController)
application.register('submit-on-change', SubmitOnChangeController)
application.register('submit-button', SubmitButtonController)
application.register('tabs', TabsController)
application.register('tree-view-item', TreeViewItemController)
application.register('trix-attachments', TrixAttachmentsController)

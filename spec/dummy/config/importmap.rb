# frozen_string_literal: true

# Pin npm packages by running ./bin/importmap

pin 'application'

# Rails
pin '@rails/actioncable', to: 'actioncable.esm.js'
pin '@rails/activestorage', to: 'activestorage.esm.js'
pin '@rails/actiontext', to: 'actiontext.esm.js'
pin '@rails/request.js', to: 'https://cdn.jsdelivr.net/npm/@rails/request.js@0.0.11/+esm'

# Hotwired
pin '@hotwired/turbo-rails', to: 'https://cdn.jsdelivr.net/npm/@hotwired/turbo-rails@8.0.12/+esm'
pin '@hotwired/stimulus', to: 'stimulus.min.js'
pin '@hotwired/stimulus-loading', to: 'stimulus-loading.js'

# Stimulus controllers
pin_all_from 'app/javascript/controllers', under: 'controllers'

# Trix
pin 'trix', to: 'https://cdn.jsdelivr.net/npm/trix@2.1.12/+esm'

# Lodash throttle/debounce
pin 'lodash.throttle', to: 'https://cdn.jsdelivr.net/npm/lodash.throttle@4.1.1/+esm'
pin 'lodash.debounce', to: 'https://cdn.jsdelivr.net/npm/lodash.debounce@4.0.8/+esm'

# Slim select
pin 'slim-select', to: 'https://cdn.jsdelivr.net/npm/slim-select@2.10.0/+esm'

# Hovercard / Tooltip
pin 'tippy.js', to: 'https://cdn.jsdelivr.net/npm/tippy.js@6.3.7/+esm'
pin '@popperjs/core', to: 'https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/+esm'

# Bali Utils
pin 'bali/utils/domHelpers', to: 'bali/utils/domHelpers.js'
pin 'bali/utils/google-maps-loader', to: 'bali/utils/google-maps-loader.js'
pin 'bali/utils/formatters', to: 'bali/utils/formatters.js'
pin 'bali/utils/form', to: 'bali/utils/form.js'
pin 'bali/utils/use-click-outside', to: 'bali/utils/use-click-outside.js'
pin 'bali/utils/time', to: 'bali/utils/time.js'
pin 'bali/utils/use-dispatch', to: 'bali/utils/use-dispatch.js'

# Bali Stimulus Controllers
pin 'bali/file-input', to: 'bali/controllers/file-input-controller'
pin 'bali/print', to: 'bali/controllers/print-controller'
pin 'bali/slim-select', to: 'bali/controllers/slim-select-controller'
pin 'bali/submit-on-change', to: 'bali/controllers/submit-on-change-controller'
pin 'bali/submit-button', to: 'bali/controllers/submit-button-controller'
pin 'bali/trix-attachments', to: 'bali/controllers/trix-attachments-controller'

# Bali Components (Javascript)
pin 'bali/dropdown', to: 'bali/dropdown/index.js'
pin 'bali/modal', to: 'bali/modal/index.js'
pin 'bali/notification', to: 'bali/notification/index.js'
pin 'bali/tabs', to: 'bali/tabs/index.js'
pin 'bali/tree-view/item', to: 'bali/tree_view/item/index.js'

## Rich Text Editor ##
pin 'lowlight', to: 'https://cdn.jsdelivr.net/npm/lowlight@3.3.0/+esm'
pin 'devlop', to: 'https://cdn.jsdelivr.net/npm/devlop@1.1.0/+esm'
pin 'highlight.js/lib/languages/javascript', to: 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/es/languages/javascript.min.js'
pin 'highlight.js/lib/languages/json', to: 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/es/languages/json.min.js'
pin 'highlight.js/lib/languages/ruby', to: 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/es/languages/ruby.min.js'
pin 'highlight.js/lib/languages/css', to: 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/es/languages/css.min.js'
pin 'highlight.js/lib/languages/scss', to: 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/es/languages/scss.min.js'
pin 'highlight.js/lib/languages/sql', to: 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/es/languages/sql.min.js'
pin 'highlight.js/lib/languages/xml', to: 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/es/languages/xml.min.js'
pin 'highlight.js/lib/languages/yaml', to: 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/es/languages/yaml.min.js'

pin '@tiptap/core', to: 'https://cdn.jsdelivr.net/npm/@tiptap/core@2.11.5/dist/index.min.js'
pin '@tiptap/pm', to: 'https://cdn.jsdelivr.net/npm/@tiptap/pm@2.11.5/state/dist/index.min.js'
pin '@tiptap/pm/commands', to: 'https://cdn.jsdelivr.net/npm/@tiptap/pm@2.11.5/commands/dist/index.js'
pin '@tiptap/pm/dropcursor', to: 'https://cdn.jsdelivr.net/npm/@tiptap/pm@2.11.5/dropcursor/dist/index.js'
pin '@tiptap/pm/gapcursor', to: 'https://cdn.jsdelivr.net/npm/@tiptap/pm@2.11.5/gapcursor/dist/index.js'
pin '@tiptap/pm/history', to: 'https://cdn.jsdelivr.net/npm/@tiptap/pm@2.11.5/history/dist/index.js'
pin '@tiptap/pm/keymap', to: 'https://cdn.jsdelivr.net/npm/@tiptap/pm@2.11.5/keymap/dist/index.js'
pin '@tiptap/pm/model', to: 'https://cdn.jsdelivr.net/npm/@tiptap/pm@2.11.5/model/dist/index.js'
pin '@tiptap/pm/schema-list', to: 'https://cdn.jsdelivr.net/npm/@tiptap/pm@2.11.5/schema-list/dist/index.js'
pin '@tiptap/pm/state', to: 'https://cdn.jsdelivr.net/npm/@tiptap/pm@2.11.5/state/dist/index.js'
pin '@tiptap/pm/tables', to: 'https://cdn.jsdelivr.net/npm/@tiptap/pm@2.11.5/tables/dist/index.js'
pin '@tiptap/pm/transform', to: 'https://cdn.jsdelivr.net/npm/@tiptap/pm@2.11.5/transform/dist/index.js'
pin '@tiptap/pm/view', to: 'https://cdn.jsdelivr.net/npm/@tiptap/pm@2.11.5/view/dist/index.js'
pin '@tiptap/suggestion', to: 'https://cdn.jsdelivr.net/npm/@tiptap/suggestion@2.11.5/dist/index.min.js'
pin '@tiptap/prosemirror-tables', to: 'https://cdn.jsdelivr.net/npm/@tiptap/prosemirror-tables@1.1.4/dist/index.cjs.min.js'
pin '@tiptap/starter-kit', to: 'https://cdn.jsdelivr.net/npm/@tiptap/starter-kit@2.11.5/dist/index.min.js'

pin '@tiptap/extension-blockquote', to: 'https://cdn.jsdelivr.net/npm/@tiptap/extension-blockquote@2.11.5/dist/index.min.js'
pin '@tiptap/extension-bold', to: 'https://cdn.jsdelivr.net/npm/@tiptap/extension-bold@2.11.5/dist/index.min.js'
pin '@tiptap/extension-bubble-menu', to: 'https://cdn.jsdelivr.net/npm/@tiptap/extension-bubble-menu@2.11.5/+esm'
pin '@tiptap/extension-bullet-list', to: 'https://cdn.jsdelivr.net/npm/@tiptap/extension-bullet-list@2.11.5/dist/index.min.js'
pin '@tiptap/extension-code-block-lowlight', to: 'https://cdn.jsdelivr.net/npm/@tiptap/extension-code-block-lowlight@2.11.5/dist/index.js'
pin '@tiptap/extension-code-block', to: 'https://cdn.jsdelivr.net/npm/@tiptap/extension-code-block@2.11.5/dist/index.min.js'
pin '@tiptap/extension-code', to: 'https://cdn.jsdelivr.net/npm/@tiptap/extension-code@2.11.5/dist/index.min.js'
pin '@tiptap/extension-color', to: 'https://cdn.jsdelivr.net/npm/@tiptap/extension-color@2.11.5/dist/index.min.js'
pin '@tiptap/extension-document', to: 'https://cdn.jsdelivr.net/npm/@tiptap/extension-document@2.11.5/dist/index.min.js'
pin '@tiptap/extension-dropcursor', to: 'https://cdn.jsdelivr.net/npm/@tiptap/extension-dropcursor@2.11.5/dist/index.min.js'
pin '@tiptap/extension-gapcursor', to: 'https://cdn.jsdelivr.net/npm/@tiptap/extension-gapcursor@2.11.5/dist/index.min.js'
pin '@tiptap/extension-hard-break', to: 'https://cdn.jsdelivr.net/npm/@tiptap/extension-hard-break@2.11.5/dist/index.min.js'
pin '@tiptap/extension-heading', to: 'https://cdn.jsdelivr.net/npm/@tiptap/extension-heading@2.11.5/dist/index.min.js'
pin '@tiptap/extension-history', to: 'https://cdn.jsdelivr.net/npm/@tiptap/extension-history@2.11.5/dist/index.min.js'
pin '@tiptap/extension-horizontal-rule', to: 'https://cdn.jsdelivr.net/npm/@tiptap/extension-horizontal-rule@2.11.5/dist/index.min.js'
pin '@tiptap/extension-image', to: 'https://cdn.jsdelivr.net/npm/@tiptap/extension-image@2.11.5/dist/index.min.js'
pin '@tiptap/extension-italic', to: 'https://cdn.jsdelivr.net/npm/@tiptap/extension-italic@2.11.5/dist/index.min.js'
pin '@tiptap/extension-link', to: 'https://cdn.jsdelivr.net/npm/@tiptap/extension-link@2.11.5/dist/index.min.js'
pin '@tiptap/extension-list-item', to: 'https://cdn.jsdelivr.net/npm/@tiptap/extension-list-item@2.11.5/dist/index.min.js'
pin '@tiptap/extension-mention', to: 'https://cdn.jsdelivr.net/npm/@tiptap/extension-mention@2.11.5/dist/index.min.js'
pin '@tiptap/extension-ordered-list', to: 'https://cdn.jsdelivr.net/npm/@tiptap/extension-ordered-list@2.11.5/dist/index.min.js'
pin '@tiptap/extension-paragraph', to: 'https://cdn.jsdelivr.net/npm/@tiptap/extension-paragraph@2.11.5/dist/index.min.js'
pin '@tiptap/extension-placeholder', to: 'https://cdn.jsdelivr.net/npm/@tiptap/extension-placeholder@2.11.5/dist/index.min.js'
pin '@tiptap/extension-strike', to: 'https://cdn.jsdelivr.net/npm/@tiptap/extension-strike@2.11.5/dist/index.min.js'
pin '@tiptap/extension-table-cell', to: 'https://cdn.jsdelivr.net/npm/@tiptap/extension-table-cell@2.11.5/dist/index.min.js'
pin '@tiptap/extension-table-header', to: 'https://cdn.jsdelivr.net/npm/@tiptap/extension-table-header@2.11.5/dist/index.min.js'
pin '@tiptap/extension-table-row', to: 'https://cdn.jsdelivr.net/npm/@tiptap/extension-table-row@2.11.5/dist/index.min.js'
pin '@tiptap/extension-table', to: 'https://cdn.jsdelivr.net/npm/@tiptap/extension-table@2.11.5/dist/index.min.js'
pin '@tiptap/extension-text-align', to: 'https://cdn.jsdelivr.net/npm/@tiptap/extension-text-align@2.11.5/dist/index.min.js'
pin '@tiptap/extension-text-style', to: 'https://cdn.jsdelivr.net/npm/@tiptap/extension-text-style@2.11.5/dist/index.min.js'
pin '@tiptap/extension-text', to: 'https://cdn.jsdelivr.net/npm/@tiptap/extension-text@2.11.5/dist/index.min.js'
pin '@tiptap/extension-underline', to: 'https://cdn.jsdelivr.net/npm/@tiptap/extension-underline@2.11.5/+esm'

pin 'prosemirror-changeset', to: 'https://cdn.jsdelivr.net/npm/prosemirror-changeset@2.2.1/dist/index.js'
pin 'prosemirror-collab', to: 'https://cdn.jsdelivr.net/npm/prosemirror-collab@1.3.1/dist/index.min.js'
pin 'prosemirror-commands', to: 'https://cdn.jsdelivr.net/npm/prosemirror-commands@1.7.0/dist/index.min.js'
pin 'prosemirror-dropcursor', to: 'https://cdn.jsdelivr.net/npm/prosemirror-dropcursor@1.8.1/dist/index.min.js'
pin 'prosemirror-gapcursor', to: 'https://cdn.jsdelivr.net/npm/prosemirror-gapcursor@1.3.2/dist/index.min.js'
pin 'prosemirror-history', to: 'https://cdn.jsdelivr.net/npm/prosemirror-history@1.4.1/dist/index.min.js'
pin 'prosemirror-inputrules', to: 'https://cdn.jsdelivr.net/npm/prosemirror-inputrules@1.4.0/dist/index.min.js'
pin 'prosemirror-keymap', to: 'https://cdn.jsdelivr.net/npm/prosemirror-keymap@1.2.2/dist/index.min.js'
pin 'prosemirror-markdown', to: 'https://cdn.jsdelivr.net/npm/prosemirror-markdown@1.13.1/dist/index.min.js'
pin 'prosemirror-menu', to: 'https://cdn.jsdelivr.net/npm/prosemirror-menu@1.2.4/dist/index.min.js'
pin 'prosemirror-model', to: 'https://cdn.jsdelivr.net/npm/prosemirror-model@1.24.1/dist/index.min.js'
pin 'prosemirror-schema-basic', to: 'https://cdn.jsdelivr.net/npm/prosemirror-schema-basic@1.2.3/dist/index.min.js'
pin 'prosemirror-schema-list', to: 'https://cdn.jsdelivr.net/npm/prosemirror-schema-list@1.5.0/dist/index.min.js'
pin 'prosemirror-state', to: 'https://cdn.jsdelivr.net/npm/prosemirror-state@1.4.3/dist/index.min.js'
pin 'prosemirror-tables', to: 'https://cdn.jsdelivr.net/npm/prosemirror-tables@1.6.4/dist/index.min.js'
pin 'prosemirror-trailing-node', to: 'https://cdn.jsdelivr.net/npm/prosemirror-trailing-node@3.0.0/dist/prosemirror-trailing-node.js'
pin 'prosemirror-transform', to: 'https://cdn.jsdelivr.net/npm/prosemirror-transform@1.10.2/dist/index.min.js'
pin 'prosemirror-view', to: 'https://cdn.jsdelivr.net/npm/prosemirror-view@1.38.0/dist/index.min.js'

pin 'linkifyjs', to: 'https://cdn.jsdelivr.net/npm/linkifyjs@4.2.0/+esm'
pin 'orderedmap', to: 'https://cdn.jsdelivr.net/npm/orderedmap@2.1.1/dist/index.min.js'
pin 'w3c-keyname', to: 'https://cdn.jsdelivr.net/npm/w3c-keyname@2.2.8/index.min.js'
pin 'rope-sequence', to: 'https://cdn.jsdelivr.net/npm/rope-sequence@1.3.4/dist/index.min.js'
pin 'markdown-it', to: 'https://cdn.jsdelivr.net/npm/markdown-it@14.1.0/dist/markdown-it.min.js'
pin 'crelt', to: 'https://cdn.jsdelivr.net/npm/crelt@1.0.6/index.min.js'
pin '@remirror/core-constants', to: 'https://cdn.jsdelivr.net/npm/@remirror/core-constants@3.0.0/dist/remirror-core-constants.js'
pin 'escape-string-regexp', to: 'https://cdn.jsdelivr.net/npm/escape-string-regexp@5.0.0/index.min.js'

pin 'bali/rich_text_editor', to: 'bali/rich_text_editor/index.js'
pin 'bali/rich_text_editor/extensions/slashCommands',
    to: 'bali/rich_text_editor/javascript/extensions/slashCommands.js'
pin 'bali/rich_text_editor/suggestions/commandsOptions',
    to: 'bali/rich_text_editor/javascript/suggestions/commands_options.js'
pin 'bali/rich_text_editor/suggestions/pagesOptions',
    to: 'bali/rich_text_editor/javascript/suggestions/pages_options.js'
pin 'bali/rich_text_editor/suggestions/popupListComponent',
    to: 'bali/rich_text_editor/javascript/suggestions/popup_list_component.js'
pin 'bali/rich_text_editor/suggestions/renderer',
    to: 'bali/rich_text_editor/javascript/suggestions/renderer.js'
pin 'bali/rich_text_editor/lowlight', to: 'bali/rich_text_editor/javascript/lowlight.js'
pin 'bali/rich_text_editor/useDefaults', to: 'bali/rich_text_editor/javascript/useDefaults.js'
pin 'bali/rich_text_editor/useImage', to: 'bali/rich_text_editor/javascript/useImage.js'
pin 'bali/rich_text_editor/useLink', to: 'bali/rich_text_editor/javascript/useLink.js'
pin 'bali/rich_text_editor/useMarks', to: 'bali/rich_text_editor/javascript/useMarks.js'
pin 'bali/rich_text_editor/useMention', to: 'bali/rich_text_editor/javascript/useMention.js'
pin 'bali/rich_text_editor/useNodes', to: 'bali/rich_text_editor/javascript/useNodes.js'
pin 'bali/rich_text_editor/useSlashCommands',
    to: 'bali/rich_text_editor/javascript/useSlashCommands.js'
pin 'bali/rich_text_editor/useTable', to: 'bali/rich_text_editor/javascript/useTable.js'

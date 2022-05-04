import SlashCommands from './extensions/slashCommands'
import suggestion from './commands_suggestion_options'

export default (_controller, _options = {}) => {
  const SlashCommandsExtension = [SlashCommands.configure({ suggestion })]

  return { SlashCommandsExtension }
}

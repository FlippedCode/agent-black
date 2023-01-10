module.exports.run = async (interaction) => {
  // const commandName = DEBUG ? interaction.commandName.replace('_dev', '') : interaction.commandName;
  const commandName = interaction.commandName.replace('_dev', '');
  return client.functions.get(`AUTOCOMPLETE_${commandName}`).run(interaction).catch(ERR);
};

module.exports.data = {
  name: 'isAutocomplete',
};

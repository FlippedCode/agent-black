const Maintainer = require('../database/models/Maintainer');

module.exports.run = async (interaction) => {
  // check maintainer permissions
  if (!await client.functions.get('CHECK_DB_perms').run(interaction.user.id)) {
    messageFail(interaction, `You are not authorized to use \`/${module.exports.data.name}\``);
    return;
  }
  const subName = interaction.options.getString('action', true);
  client.commands.get(`${module.exports.data.name}_${subName}`).run(interaction, Maintainer);
};

module.exports.data = new CmdBuilder()
  .setName('maintainer')
  .setDescription('Manages the maintainers. [MAINTAINER ONLY]')
  .addUserOption((option) => option.setName('user').setDescription('Provide a user you want to edit.').setRequired(true))
  .addStringOption((option) => option
    .setName('action')
    .setDescription('What do you want to do with this user?')
    .addChoices(
      { name: 'Add user', value: 'add' },
      { name: 'Remove user', value: 'remove' },
      { name: 'Disply info about user', value: 'info' },
    )
    .setRequired(true));

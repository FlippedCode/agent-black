const {
  EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,
} = require('discord.js');

const buttons = new ActionRowBuilder()
  .addComponents([
    new ButtonBuilder()
      .setCustomId('accept')
      .setEmoji('✅')
      .setLabel('Accept')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('deny')
      .setEmoji('❌')
      .setLabel('Deny')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setLabel('ToS')
      .setURL('https://github.com/FlippedCode/agent-black/wiki/ToS-and-Privacy-Policy')
      .setStyle(ButtonStyle.Link),
  ]);

// adds a server to the ParticipatingServers table
async function addServer(ParticipatingServer, serverID, logChannelID, teamRoleID, serverName) {
  await ParticipatingServer.destroy({ limit: 1, where: { serverID, active: false } });
  const added = await ParticipatingServer.findOrCreate(
    {
      where: { serverID },
      defaults: {
        logChannelID, teamRoleID, serverName, active: true,
      },
    },
  ).catch(ERR);
  const created = await added[1];
  return created;
}

module.exports.run = async (interaction, ParticipatingServer) => {
  const message = await new EmbedBuilder()
    .setDescription('Please confirm that you have read the ToS and Privacy Policy.')
    .setColor('Orange');
  const confirmMessage = await reply(interaction, {
    embeds: [message], components: [buttons], fetchReply: true, ephemeral: true,
  });
  // start button collector
  const filter = (i) => interaction.user.id === i.user.id;
  const buttonCollector = confirmMessage.createMessageComponentCollector({ filter, time: 10000 });
  buttonCollector.on('collect', async (used) => {
    buttonCollector.stop();
    if (used.customId === 'accept') {
      // confirm
      const logChannelID = interaction.options.getChannel('channel', true).id;
      const teamRoleID = interaction.options.getRole('role', true).id;
      const serverName = interaction.guild.name;
      const serverID = interaction.guild.id;
      const serverAdded = await addServer(ParticipatingServer, serverID, logChannelID, teamRoleID, serverName);
      // post outcome
      if (serverAdded) {
        messageSuccess(interaction,
          `\`${serverName}\` with the ID \`${serverID}\` got added to / updated in the participating Servers list.\nYou can now use all the other commands in this server.\nConsider running \`/checkallusers\` in your log channel once.`);
      } else {
        messageFail(interaction,
          `An active server entry for \`${serverName}\` with the ID \`${serverID}\` already exists! If you want to change info, remove it first with \`/${interaction.commandName} disable\``);
      }
      return;
    }
    return messageFail(interaction, 'The bot setup cannot be continued without accepting the ToS. Please run the command again.');
  });
  buttonCollector.on('end', async (collected) => {
    if (collected.size === 0) messageFail(interaction, 'Your response took too long. Please run the command again.');
  });
};

module.exports.data = { subcommand: true };

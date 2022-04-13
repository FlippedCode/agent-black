// edits a Warn to the warning table
async function editWarn(Warn, warnID, reason) {
  Warn.update({ reason }, { where: { warnID } })
    .catch(ERR);
}

async function getWarning(Warn, warnID) {
  return found;
}

module.exports.run = async (interaction, warnMessage, Warn, checkforInfectedGuilds) => {
  // check if user exists
  // if (isNaN(userIDOrWarnID)) {
  //   messageFail(message, 'This is not a warn-ID!');
  //   return;
  // }
  const warnID = interaction.options.getNumber('warnid', true);
  const serverID = interaction.guild.id;
  const warning = await getWarning(Warn, warnID);
  // check if warn is existent
  if (!warning) {
    messageFail(interaction, 'A Warning with this ID doesn\'t exist!');
    return;
  }
  // check if warn is from the same server
  if (warning.serverID !== serverID) {
    messageFail(interaction, 'You can only edit warnings form the server where they have been issued from.');
    return;
  }
  // add warn
  await editWarn(Warn, warnID, warnMessage);
  messageSuccess(interaction, `The warning with the the ID ${warnID} has been edited. Warning other servers.`);
  checkforInfectedGuilds(message.guild, warning.userID, warnMessage);
};

module.exports.data = { subcommand: true };

const Ban = require('../../database/models/Ban');
const { messageFail } = require('../../functions_old/GLBLFUNC_messageFail.js');
const { messageSuccess } = require('../../functions_old/GLBLFUNC_messageSuccess.js');
// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require('discord.js');

// finds a server in the ParticipatingServers table
async function findServer(ParticipatingServer, serverID) {
  const found = await ParticipatingServer.findOne({ where: { serverID } })
    .catch((err) => console.error(err));
  return found;
}

async function getBanCount(serverID) {
  const result = await Ban.findAndCountAll({ where: { serverID } });
  return result.count;
}

/**
 * @param {Client} client 
 * @param {CommandInteraction} interaction 
 * @param {*} ParticipatingServer 
 * @param {Integer} serverID 
 */
module.exports.run = async (client, interaction, ParticipatingServer, serverID) => {
  const serverFound = await findServer(ParticipatingServer, serverID);
  if (serverFound) {
    let content = `
    Servername: \`${serverFound.serverName}\`
    Server ID: \`${serverFound.serverID}\`
    Log Channel: <#${serverFound.logChannelID}> (\`${serverFound.logChannelID}\`)
    Team Role ID: \`${serverFound.teamRoleID}\`
    Submitted Bans: \`${await getBanCount(serverID)}\`
    Is server apart of Association: \`${serverFound.active}\``;
    if (serverFound.active) content += `\nParticipating Server since \`${serverFound.updatedAt}\``;
    messageSuccess(interaction, content);
  } else {
    messageFail(client, interaction,
      `The server with the ID \`${serverID}\` couldn't be found in the list.`);
  }
};

module.exports.data = { subcommand: true };

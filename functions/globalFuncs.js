global.messageFail = async (interaction, body, color, ephemeral) => {
  const sentMessage = await client.functions.get('embedBuilder')
    .run(interaction, body, '', color || 'Red', false, ephemeral || true);
  return sentMessage;
};

global.messageSuccess = async (interaction, body, color, ephemeral) => {
  const sentMessage = await client.functions.get('embedBuilder')
    .run(interaction, body, '', color || 'Green', false, ephemeral || false);
  return sentMessage;
};

// raw reply to commands
global.reply = (interaction, payload, followUp = false) => {
  if (followUp) return interaction.followUp(payload);
  // check if message needs to be edited or if its a first reply
  if (interaction.deferred || interaction.replied) return interaction.editReply(payload);
  return interaction.reply(payload);
};

global.prettyCheck = (question) => {
  if (question) return '✅';
  return '❌';
};

global.date = (date) => {
  const newTimestamp = new Date(date).getTime() / 1000;
  return `<t:${Math.round(newTimestamp)}:D>`;
};

module.exports.data = {
  name: 'globalFunc',
};

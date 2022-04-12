module.exports.run = async (message) => {
  // debug protection
  if (DEBUG) return;
  // return if not prefix
  if (message.author.bot) return;
  if (!message.content.startsWith('a!')) return;
  const sentMessage = await message.channel.send('Hi there! I have been upgraded to Slash-Commands (v.3.0.0) and no longer support the old prefix of `a!` (Blame Discord). Please use the new `/` instead!');
  // For some reason that isnta-deletes the message?
  // await sentMessage.delete({ timeout: 20000 });
};

module.exports.data = {
  name: 'messageCreate',
};

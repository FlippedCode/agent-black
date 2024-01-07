import { SlashCommandBuilder, Team } from 'discord.js';
import { BanManager } from '../classes/banManager.js';
import { CmdFileArgs, CustomClient } from '../typings/Extensions.js';

function authorised(client: CustomClient, user: string): boolean {
  return (
    (client.application.owner instanceof Team && client.application.owner.members.has(user)) ||
    client.application.owner.id === user
  );
}

export const ephemeral = true;
export const data = new SlashCommandBuilder()
  .setName('syncallbans')
  .setDescription('Adds all bans from all participating servers [OWNER ONLY]');
export async function execute({ client, interaction }: CmdFileArgs): Promise<void> {
  // Check owner
  if (!authorised(client, interaction.user.id)) {
    interaction.editReply({ content: 'You are not authorised to use this command' });
    return;
  }
  // Fetch guilds
  const guilds = await client.guilds.fetch();
  const manager = new BanManager({ bans: [], sequelize: client.sequelize });
  // Loop through guilds, adding promises
  const p = [];
  for (const g of guilds.values()) {
    // Add guild, using ID from OAuthGuild
    p.push(manager.addGuild(client.guilds.cache.get(g.id), true));
  }
  await Promise.all(p);
  // Sync bans
  await manager.sync();
  // Reply
  interaction.editReply({ content: `Synced ${manager.bans.length} bans` });
}

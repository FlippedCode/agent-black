const startupTime = +new Date();

const OfflineStat = require("../database/models/OfflineStat");

const ERR = (err) => {
	console.error("ERROR:", err);
};

module.exports.run = async (client, config) => {
	if (!config.env.get("inDev")) {
		console.log(`[${module.exports.data.name}] Starting heartbeat!`);
	} else return console.log(`[${module.exports.data.name}] Bot is in debugging-mode and will not post bot status message or update the DB entry.`);
	setInterval(async () => {
		// loop db update in 5 sec intervall
		const [offlineStat] = await OfflineStat.findOrCreate({
			where: { ID: 1 }, defaults: { time: startupTime },
		}).catch(ERR);
		if (!offlineStat.isNewRecord) {
			OfflineStat.update({ time: +new Date() }, { where: { ID: 1 } }).catch(ERR);
		}
	}, 1 * 5000);
};

module.exports.help = {
	name: "TCKR_offlineStat",
};

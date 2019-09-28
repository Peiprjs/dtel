module.exports = async(client, msg, suffix, call) => {
	if (call.to.number === config.supportNumber && msg.channel.id != config.supportChannel) return;

	// Calculate time the call lasted for.
	let duration, h, m, s, time;
	if (call.pickedUp) {
		duration = Math.round((Date.now() - call.pickedUp) / 1000, 1);
		h = Math.floor(duration / 3600);
		duration -= h * 3600;
		m = Math.floor(duration / 60);
		duration -= m * 60;
		s = duration;
		time = client.time(s, m, h);
	}

	// Send the stuff
	msg.channel.send({ embed: { color: config.colors.error, title: "The call has ended!", description: `You have ended the call${call.pickedUp ? ` after ${time}` : ""}.`, footer: { text: call.id } } });
	await r.table("Calls").get(call.id).delete();
	await client.apiSend({ embed: { color: config.colors.error, title: "The call has ended!", description: `The other side ended the call${call.pickedUp ? ` after ${time}` : ""}.`, footer: { text: call.id } } }, msg.channel.id === call.from.channel ? call.to.channel : call.from.channel);
	await r.table("OldCalls").insert(call);
	client.log(`:negative_squared_cross_mark: ${call.rcall ? "rcall" : "Call"} \`${call.from.hidden ? "hidden" : call.from.channel} → ${call.to.hidden ? "hidden" : call.to.channel}\` was hung up by ${msg.author.tag} (${msg.author.id}) on the ${msg.channel.id === call.from.channel ? "from" : "to"} side. ${call.id}`);
};

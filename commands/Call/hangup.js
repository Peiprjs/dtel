module.exports = async(client, msg, suffix) => {
	const call = await Calls.find(c => c.to.channel == msg.channel.id || c.from.channel == msg.channel.id);
	if (!call || (call.to.number === "08006113835" && msg.guild.id != config.supportGuild)) return;

	await r.table("OldCalls").insert(call);
	await Calls.newGet(call.id).delete();
	await msg.reply(":negative_squared_cross_mark: You hung up the call.");
	await client.apiSend(":x: The other side hung up the call.", msg.channel.id === call.from.channel ? call.to.channel : call.from.channel);
	await client.log(`:negative_squared_cross_mark: Call \`${call.from.channel} → ${call.to.channel}\` was hung up by ${msg.author.tag} (${msg.author.id}) on the ${msg.channel.id === call.from.channel ? "from" : "to"} side.`);

	// add stop typing things later?
};

client.on('messageCreate', async (message) => {
    // Esto imprimirá en la consola de Railway cada mensaje que el bot detecte
    console.log(`Mensaje detectado: ${message.content} de ${message.author.tag}`);

    if (message.content.startsWith('!create') && !message.author.bot) {
        const rolesAutorizados = ['408904612310024192', '1495957842186735727'];
        
        // Log para ver qué roles tenés vos cuando ejecutás el comando
        console.log(`Tus roles: ${message.member.roles.cache.map(r => r.id).join(', ')}`);

        const tienePermiso = message.member.roles.cache.some(role => rolesAutorizados.includes(role.id));

        if (!tienePermiso) {
            console.log("Acceso denegado: El usuario no tiene los roles necesarios.");
            return;
        }

        const args = message.content.split(' ');
        const nombreCanal = args[1];
        if (!nombreCanal) return message.reply("⚠️ Indica el nombre.");

        const categoriaID = '1390861046658498671';

        try {
            const canal = await message.guild.channels.create({
                name: nombreCanal,
                type: ChannelType.GuildText,
                parent: categoriaID,
                permissionOverwrites: [
                    { id: message.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
                    { id: message.author.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
                    { id: client.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels] }
                ],
            });
            console.log(`✅ Canal ${nombreCanal} creado con éxito.`);
            message.reply(`✅ Creado: ${canal}`);
        } catch (error) {
            console.error("Error al crear:", error);
            message.reply("❌ Error. Mirá la consola de Railway.");
        }
    }
});
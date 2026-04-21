require('dotenv').config();
const { Client, GatewayIntentBits, PermissionFlagsBits, ChannelType } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
});

client.on('ready', () => {
    console.log(`✅ Bot encendido como ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.content.startsWith('!create') && !message.author.bot) {
        
        const rolesAutorizados = ['408904612310024192', '1495957842186735727'];
        const tienePermiso = message.member.roles.cache.some(role => rolesAutorizados.includes(role.id));

        if (!tienePermiso) return;

        const args = message.content.split(' ');
        const nombreCanal = args[1];
        if (!nombreCanal) return message.reply("⚠️ Uso: `!create nombre`.");

        const categoriaID = '1390861046658498671';

        try {
            await message.guild.channels.create({
                name: nombreCanal,
                type: ChannelType.GuildText,
                parent: categoriaID,
                permissionOverwrites: [
                    { id: message.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
                    { id: message.author.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] },
                    { id: client.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels] }
                ],
            });
            message.reply(`✅ Canal **${nombreCanal}** creado.`);
        } catch (error) {
            console.error(error);
        }
    }
});

client.login(process.env.TOKEN);
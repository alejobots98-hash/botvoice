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
    // Para ver en Railway si el bot lee los mensajes
    if (!message.author.bot) {
        console.log(`Mensaje: ${message.content} | De: ${message.author.tag}`);
    }

    if (message.content.startsWith('!create') && !message.author.bot) {
        const rolesAutorizados = ['408904612310024192', '1495957842186735727'];
        
        // Verifica si el usuario tiene el rol
        const tienePermiso = message.member.roles.cache.some(role => rolesAutorizados.includes(role.id));

        if (!tienePermiso) {
            console.log(`Acceso denegado para: ${message.author.tag}`);
            return;
        }

        const args = message.content.split(' ');
        const nombreCanal = args.slice(1).join('-'); // Une el nombre si ponen espacios

        if (!nombreCanal) {
            return message.reply("⚠️ Indica el nombre: `!create babasonico22`.");
        }

        const categoriaID = '1390861046658498671';

        try {
            const canalCreado = await message.guild.channels.create({
                name: nombreCanal,
                type: ChannelType.GuildText,
                parent: categoriaID,
                permissionOverwrites: [
                    {
                        id: message.guild.id, // Bloquea @everyone
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: message.author.id, // Permite al autor
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
                    },
                    {
                        id: client.user.id, // Permite al bot
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels],
                    }
                ],
            });

            message.reply(`✅ Canal privado **${canalCreado}** creado.`);
            console.log(`✅ Canal ${nombreCanal} creado correctamente.`);

        } catch (error) {
            console.error("Error al crear el canal:", error);
            message.reply("❌ Hubo un error al crear el canal. Revisa los permisos del bot.");
        }
    }
});

client.login(process.env.TOKEN);
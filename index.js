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
    if (message.author.bot) return;

    if (message.content.startsWith('!create')) {
        
        // --- CONFIGURACIÓN ---
        const rolesAutorizados = ['1211760228673257524', '1494517342242340864'];
        const ownerID = message.guild.ownerId; // Detecta automáticamente al dueño del server
        
        const tieneRol = message.member.roles.cache.some(role => rolesAutorizados.includes(role.id));
        const esOwner = message.author.id === ownerID;

        // LOG DE SEGURIDAD PARA RAILWAY
        console.log(`Intento de: ${message.author.tag} | ID: ${message.author.id} | Es Owner: ${esOwner} | Tiene Rol: ${tieneRol}`);

        // Si no es el dueño Y no tiene el rol, afuera.
        if (!esOwner && !tieneRol) {
            console.log(`❌ Denegado para ${message.author.tag}. No es owner ni tiene los roles.`);
            return; 
        }

        const args = message.content.split(' ');
        const nombreCanal = args.slice(1).join('-'); 

        if (!nombreCanal) {
            return message.reply("⚠️ Indica el nombre: `!create nombre`.");
        }

        const aviso = await message.reply("⏳ Creando vc vaganciero...");

        try {
            const canalCreado = await message.guild.channels.create({
                name: nombreCanal,
                type: ChannelType.GuildText,
                parent: '1390861046658498671',
                permissionOverwrites: [
                    {
                        id: message.guild.id, 
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: message.author.id, 
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
                    },
                    {
                        id: client.user.id, 
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels],
                    }
                ],
            });

            await aviso.edit(`✅ **Canal creado:** ${canalCreado}`);

        } catch (error) {
            console.error("Error al crear el canal:", error);
            await aviso.edit("❌ Error. Asegúrate de que el rol de mi bot esté ARRIBA de todo en la lista de roles.");
        }
    }
});

client.login(process.env.TOKEN);
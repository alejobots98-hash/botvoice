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
    console.log(`✅ Bot de Voz encendido como ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    // Ignorar mensajes de otros bots
    if (message.author.bot) return;

    // Comando !create
    if (message.content.startsWith('!create')) {
        
        // IDs de los roles autorizados que me pasaste
        const rolesAutorizados = ['1211760228673257524', '1494517342242340864'];
        
        // Validación de permisos (Dueño del server o Roles específicos)
        const esOwner = message.author.id === message.guild.ownerId;
        const tieneRol = message.member.roles.cache.some(r => rolesAutorizados.includes(r.id));

        // Registro en la consola de Railway para monitoreo
        console.log(`> Intento de ${message.author.tag} | Owner: ${esOwner} | Rol: ${tieneRol}`);

        if (!esOwner && !tieneRol) {
            console.log(`❌ Acceso denegado para ${message.author.tag}`);
            return; 
        }

        const args = message.content.split(' ');
        const nombreCanal = args.slice(1).join('-') || 'Sala-Vaganciera'; 

        // 1. Mensaje de aviso inicial
        const aviso = await message.reply("⏳ Creando vc vaganciero...");

        const categoriaID = '1390861046658498671';

        try {
            const canalCreado = await message.guild.channels.create({
                name: nombreCanal,
                type: ChannelType.GuildVoice, // TIPO VOZ
                parent: categoriaID,
                permissionOverwrites: [
                    {
                        id: message.guild.id, // Bloquea a todo el servidor
                        deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect],
                    },
                    {
                        id: message.author.id, // Permite al creador
                        allow: [
                            PermissionFlagsBits.ViewChannel, 
                            PermissionFlagsBits.Connect, 
                            PermissionFlagsBits.Speak, 
                            PermissionFlagsBits.Stream,
                            PermissionFlagsBits.MuteMembers, // Opcional: para que el creador pueda mutear en su sala
                            PermissionFlagsBits.MoveMembers
                        ],
                    },
                    {
                        id: client.user.id, // Permite al bot gestionar el canal
                        allow: [
                            PermissionFlagsBits.ViewChannel, 
                            PermissionFlagsBits.Connect, 
                            PermissionFlagsBits.ManageChannels
                        ],
                    }
                ],
            });

            // 2. Edita el mensaje para confirmar que terminó y menciona el canal
            await aviso.edit(`✅ **Canal de voz creado:** ${canalCreado}`);
            console.log(`✅ ¡Canal de voz "${nombreCanal}" creado con éxito para ${message.author.tag}!`);

        } catch (error) {
            console.error("ERROR AL CREAR CANAL DE VOZ:", error);
            await aviso.edit("❌ Error. Asegúrate de que mi rol (VG-VOICE) esté ARRIBA de todo en Ajustes del Servidor > Roles.");
        }
    }
});

client.login(process.env.TOKEN);
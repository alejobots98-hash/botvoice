require('dotenv').config();
const { Client, GatewayIntentBits, PermissionFlagsBits, ChannelType } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
});

// --- SEGURIDAD ANTI-DUPLICADOS ---
let creandoCanal = false;

client.on('ready', () => {
    console.log(`✅ Bot de Voz Vaganciero encendido: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    // Ignorar bots y mensajes que no sean el comando
    if (message.author.bot || !message.content.startsWith('!create')) return;

    // Si ya se está procesando un canal, ignoramos peticiones nuevas por unos segundos
    if (creandoCanal) return;

    // --- CONFIGURACIÓN DE PERMISOS ---
    const rolesAutorizados = ['1211760228673257524', '1494517342242340864'];
    const esOwner = message.author.id === message.guild.ownerId;
    const tieneRol = message.member.roles.cache.some(r => rolesAutorizados.includes(r.id));

    // Si no es el dueño ni tiene los roles, no hace nada
    if (!esOwner && !tieneRol) {
        console.log(`❌ Acceso denegado para: ${message.author.tag}`);
        return;
    }

    // Bloqueamos el comando temporalmente para evitar el doble canal
    creandoCanal = true;

    const args = message.content.split(' ');
    const nombreCanal = args.slice(1).join('-') || 'Sala-Vagancia';
    const categoriaID = '1390861046658498671';

    const aviso = await message.reply("⏳ Creando vc vaganciero...");

    try {
        const canalCreado = await message.guild.channels.create({
            name: nombreCanal,
            type: ChannelType.GuildVoice, // Canal de VOZ
            parent: categoriaID,
            permissionOverwrites: [
                {
                    id: message.guild.id, // Bloquea a todo el mundo (@everyone)
                    deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect],
                },
                {
                    id: message.author.id, // Permisos para el creador
                    allow: [
                        PermissionFlagsBits.ViewChannel, 
                        PermissionFlagsBits.Connect, 
                        PermissionFlagsBits.Speak, 
                        PermissionFlagsBits.Stream,
                        PermissionFlagsBits.MuteMembers,
                        PermissionFlagsBits.MoveMembers
                    ],
                },
                {
                    id: client.user.id, // Permisos para el bot
                    allow: [
                        PermissionFlagsBits.ViewChannel, 
                        PermissionFlagsBits.Connect, 
                        PermissionFlagsBits.ManageChannels
                    ],
                }
            ],
        });

        // Confirmación final
        await aviso.edit(`✅ **Canal de voz creado:** ${canalCreado}`);
        console.log(`✅ Canal de voz "${nombreCanal}" creado correctamente.`);

    } catch (error) {
        console.error("ERROR:", error);
        await aviso.edit("❌ No pude crear el canal. Revisa que mi rol esté ARRIBA de todo.");
    } finally {
        // Liberamos el bloqueo después de 3 segundos
        setTimeout(() => {
            creandoCanal = false;
        }, 3000);
    }
});

client.login(process.env.TOKEN);
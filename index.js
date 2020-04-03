let discord = require('discord.js')
let client = new discord.Client()
let request = require('request')
let chalk = require('chalk')
let fs = require('fs')
const { stripIndents } = require("common-tags");
let names = []
let token = require("./config.json").token
var backups = JSON.parse(fs.readFileSync("./backups.json", "utf8"));
let sleekkey = require("./config.json").sleekkey
client.on('ready', async() => {
    console.log(chalk.blue(`
    ██████╗  ██████╗ ███████╗████████╗
    ██╔══██╗██╔═══██╗██╔════╝╚══██╔══╝
    ██████╔╝██║   ██║███████╗   ██║   
    ██╔═══╝ ██║   ██║╚════██║   ██║   
    ██║     ╚██████╔╝███████║   ██║   
    ╚═╝      ╚═════╝ ╚══════╝   ╚═╝`))
    console.log(chalk.white("Logged in as: "), chalk.red(client.user.tag))
})

let commands = ["**pk** - Kills paladin.exe, useless right now.", "**magik** - you can @someone, post an image, or link an image.", "**spam** - spams a message x amount of times.", "**ghostspam** - spams a message x amount of times and deletes it after.", "**ghostping** - ghost ping's a user.", "**mcprofile** - Shows a namemc type recap of a minecraft name.", "**av** - shows someone's avatar.", "**search** - Searches a bunch of websites for a username.", "**massreact** - reacts to a certain amount of messages with a certain emoji.", "**stopattack** - stop attacks from keys given after starting attacks.", "**sleek** - start attacks on ip's using sleek.to.", "**emojis-steal** - steals all that guilds emojis and pastes them in another guild.", "**playing** - set your presence to playing.","**watch** - set your presence to watching." , "**stream** - sets your presence to streaming.", "**em** - Adds, removes, and lists emojis.", "**ipinfo** - gets info on an ip... kinda self explanitory...", "**userinfo** - Obvious.", "**guildinfo** - Obvious.", "**host2ip** - Gets the ip connected to a website.", "**ping** - Pings an ipaddress and returns response time.", "**shibe** - Returns a random shibe photo.", "**everyone** - Pings everyone in a discord, 30 users per msg and instantly deletes it.", "**status** - shows the status of the bot, like uptime and stuff, general information.", "**scopy** - copies everything in a server, roles, channels, etc.", "**spaste** - pastes a server that you copied.", "**sinfo** - Shows the information about a save.", "**sdelete** - Deletes a saved guild.", "**slist** - List all current guilds you have copied.", "**mock** - mOcKs SoMeOnEs TeXt.", "**clear** - purges messages.", "**wipe** - removes all role, channels, and renames a server and replaces the icon, like a greif."]
let prefix = require("./config.json").prefix
client.on('message', async msg => {
    if(msg.author.id !== client.user.id) return;
    let args = msg.content.split(" ")
    if(msg.content.toLowerCase().startsWith(prefix + "host2ip")){
        if(msg.channel.type !== 'dm'&&msg.channel.type !== 'group' && !msg.member.hasPermission("EMBED_LINKS")) return msg.edit(`Please make sure you have the "EMBED_LINKS" permission.`)
        if(!args[1]) return msg.edit(`Please use this command like this: \`${prefix}host2ip https://website.org or website.org\``)
        try{
            let oof = args[1]
            if(args[1].includes("://")){
                oof = args[1].split("://")[1].replace("/", '')
            }
            request.get("https://api.apithis.net/host2ip.php?hostname=" + oof, {
                json: false
            }, (err, resp) => {
                let ip = resp.body
                let bad = new discord.RichEmbed()
                .setColor("BLACK")
                .setTitle(`Host2IP!`)
                .setDescription(`ERROR:\nThat domain is not available!`)
                let success = new discord.RichEmbed()
                .setColor("BLACK")
                .setTitle("Host2IP!")
                .setDescription("Success:\nThat domains ip is: \`" + ip + "\`")
                if(ip === args[1]) return msg.edit(bad)
                msg.edit(success)
            })
        }catch(err){
            msg.edit(`ERROR: \n\`\`\`${err}\`\`\``)
        }
    }
    if(msg.content.toLowerCase().startsWith(prefix + "ping")){
        if(msg.channel.type !== 'dm'&&msg.channel.type !== 'group' && !msg.member.hasPermission("EMBED_LINKS")) return msg.edit(`Please make sure you have the "EMBED_LINKS" permission.`)
        try{
            if(!args[1]) return msg.edit(`Please use this command like: \`${prefix}ping 127.0.0.1 or website.org\``)
            var exec = require('child_process').exec;
            function puts(error, stdout, stderr) { 
                let lol = new discord.RichEmbed()
                .setColor("BLACK")
                .setDescription(`\`\`\`${stdout}\`\`\``)
                msg.edit(lol)
             }
            exec("ping " + args[1], puts);
                
        }catch(err){
            msg.edit(err)
        }
    }
    if(msg.content.toLowerCase() === prefix + "shibe"){
        if(msg.channel.type !== 'dm'&&msg.channel.type !== 'group' && !msg.member.hasPermission("EMBED_LINKS")) return msg.edit(`Please make sure you have the "EMBED_LINKS" permission.`)
        try{
            request.get('http://shibe.online/api/shibes?count=1', {
                json: true
            }, (err, resp) => {
                let embed = new discord.RichEmbed()
                .setImage(resp.body[0])
                .setColor("BLACK")
                msg.edit(embed)
            })
            
        }catch(err){
            msg.edit(err)
        }
    }

    if(msg.content.toLowerCase() === prefix + "everyone"){
        if(msg.channel.type !== "text") return msg.edit("Please use this in a text channel!")
        if(msg.deletable){
            msg.delete()
        }
        let users = []
        await msg.guild.members.forEach(m => {
            users.push(`<@${m.user.id}>`)
        })
        let asd = await users.chunk_inefficient(40)
        await asd.forEach(a => {
            wait(500)
            msg.channel.send("hey! " + a.join(" ")).then(m => {
                if(m.deletable === true) return m.delete()
            })
        })
        i = 0
        asd =[]
        users = []
    }
    if(msg.content.toLowerCase() === prefix + "status"){
        if(msg.channel.type !== 'dm'&&msg.channel.type !== 'group' && !msg.member.hasPermission("EMBED_LINKS")) return msg.edit(`Please make sure you have the "EMBED_LINKS" permission.`)
        try{
            let totalSeconds = (client.uptime / 1000);
            let days = Math.floor(totalSeconds / 86400);
            let hours = Math.floor(totalSeconds / 3600);
            totalSeconds %= 3600;
            let minutes = Math.floor(totalSeconds / 60);
            let seconds = Math.round(totalSeconds % 60);
            let niggers = client.ping
            let fixedNiger = Math.round(niggers)
            let lol = new discord.RichEmbed()
            .setTitle("Bot info for " + client.user.tag)
            .setColor("BLACK")
            .setDescription(`**Library:** [Discord.js](https://discord.js.org/)\n**Uptime:**| ${days} Days ${hours} Hours ${minutes} Minutes ${seconds} Seconds\n**Ping** ${fixedNiger}ms **${client.guilds.size}** Servers | **${client.channels.size}** Channels | **${client.users.size}** Users\n`)
            msg.edit(lol)
        }catch(err){
            msg.edit(`\`\`\`${err}\`\`\``)
        }
    }
    if(msg.content.toLowerCase().startsWith(prefix + "mock")){
        
        if(!args[1]) return msg.edit('Define a word or sentence to "mock"!')
        let mocking = args.slice(1).join(" ")
        msg.edit(mockify(mocking))
    }
    if(msg.content.toLowerCase() == prefix + "scopy"){
        
        if(msg.channel.type !== 'text') return msg.channel.send(`This is a guild only command!`)
        let id = makeid(16)
        const channels = msg.guild.channels.sort(function (a, b) { return a.position - b.position; }).array().map(c => {
            const channel = {
                type: c.type,
                name: c.name,
                postion: c.calculatedPosition
            }
            if (c.parent) channel.parent = c.parent.name
            return channel;
        });


    
            const roles = msg.guild.roles.filter(r => r.name !== "@everyone").sort(function (a, b) { return a.position - b.position; }).array().map(r => {
            const role = {
                name: r.name,
                color: r.color,
                hoist: r.hoist,
                permissions: r.permissions,
                mentionable: r.mentionable,
                position: r.position
            }
            return role;
        });

        if(!backups[msg.author.id]) backups[msg.author.id] = {}
        backups[msg.author.id][id] = {
            icon: msg.guild.iconURL,
            name: msg.guild.name,
            owner: msg.guild.ownerID,
            members: msg.guild.memberCount,
            createdAt: msg.guild.createdAt,
            roles,
            channels
        }
        
    save();
        msg.channel.send(`Copied this server with the id \`${id}\`, use \`$spaste ${id}\` to paste!`)
        let codes = require('./codes.json')
        codes.push(`${id} - ${msg.guild.name}`)
        fs.writeFileSync('./codes.json', JSON.stringify(codes), `utf-8`)
    }
    if(msg.content.toLowerCase().startsWith(prefix + "spaste")){
        if(!args[1]) return msg.edit(`Please define an id to paste!`)
        if(msg.guild.owner.id !== client.user.id) return msg.edit(`You have to be the owner of the guild you want to paste in!`)
        if(!args[1]) return msg.channel.send(`Please define an id to load!`)
        if(!backups[msg.author.id][args[1]]) return msg.channel.send(`ERROR: No save by that id found!`)
        await msg.guild.channels.forEach(c => {
            c.delete()    
        })
        await msg.guild.roles.forEach(r => {
            if(!r.members.filter(a => a.bot === true)) return r.delete()
        })
        await backups[msg.author.id][args[1]].roles.forEach(async function (role) {
            if(role.name === "@everyone") return;
            msg.guild.createRole({name: role.name, color: role.color, permissions: role.permissions, hoist: role.hoist, mentionable: role.mentionable, position: role.position }).catch(err => {
                console.log(err)
            })
        
        });
        setTimeout(async () => {
            await backups[msg.author.id][args[1]].channels.filter(c => c.type === "category").forEach(async function (ch)  {
                msg.guild.createChannel(ch.name,{
                     type: ch.type, 
                     permissionOverwrites: ch.permissionOverwrites
                    })
                }); 
        
               await backups[msg.author.id][args[1]].channels.filter(c => c.type !== "category").forEach(async function(ch) {
                msg.guild.createChannel(ch.name,{
                    type: ch.type, 
                    permissionOverwrites: ch.permissionOverwrites
                   }).then(c => {
                            const parent = msg.guild.channels.filter(c => c.type === 'category').find(c => c.name === ch.parent);
                            ch.parent ? c.setParent(parent) : '';
                        });
                });
                msg.guild.setName(backups[msg.author.id][args[1]].name)
                msg.guild.setIcon(backups[msg.author.id][args[1]].icon).then(a => {
                    console.log(chalk.green("[ ! ]"), chalk.white(" Server pasted successfully!"))
                })
        }, 5000)
       
    }
    if(msg.content.toLowerCase().startsWith(prefix + "sdelete")){
        if(!args[1]) return msg.channel.send(`Please define an id to delete!`)
        if(!backups[msg.author.id][args[1]]) return msg.channel.send(`ERROR: No save by that id found!`)
        delete backups[msg.author.id][args[1]]
        save()
        msg.channel.send(`Successfully deleted \`${args[1]}\` save from the database!`)
        let codes = require('./codes.json')
        let oof = codes.filter(item => {
            return item.split(" ")[0] !== args[1]
        })
        codes = oof
        fs.writeFileSync("./codes.json", JSON.stringify(codes), `utf-8`)
    }
    if(msg.content.toLowerCase().startsWith(prefix + "sinfo")){
        if(msg.channel.type !== 'dm'&&msg.channel.type !== 'group' && !msg.member.hasPermission("EMBED_LINKS")) return msg.edit(`Please make sure you have the "EMBED_LINKS" permission.`)
        if(!args[1]) return msg.edit(`Please add an id to get info of!`)
        let id = args[1]
        if(!backups[msg.author.id][id]) return msg.edit(`ERROR: No save by that id!`)
        let backup = backups[msg.author.id][id]
        let embed = new discord.RichEmbed()
        .setColor("BLACK")
        .setTitle(backup.name)
        .setThumbnail(backup.icon)
        .setDescription(`**Name**: ${backup.name}\n**CreatedAt**: ${backup.createdAt}\n**Roles**: ${backup.roles.length}\n**Channels**: ${backup.channels.length}`)
        msg.edit(embed).catch(() => {return})
    }
    if(msg.content.toLowerCase().startsWith(prefix + "slist")){
        if(msg.channel.type !== 'dm'&&msg.channel.type !== 'group' && !msg.member.hasPermission("EMBED_LINKS")) return msg.edit(`Please make sure you have the "EMBED_LINKS" permission.`)
        let codes = require('./codes.json')
        if(!codes[0]) return msg.edit(`No recorded saves!`)
        let embed = new discord.RichEmbed()
        .setTitle("Saves list!")
        .setColor("BLACK")
        .setDescription("\`\`\`"+codes.join("\n")+"\`\`\`")
        .setFooter(prefix + "sinfo {code}")
        msg.edit(embed).catch(() => {return})
    }

    if(msg.content.toLowerCase() === prefix + 'guildinfo'){
        if(msg.channel.type !== 'dm'&&msg.channel.type !== 'group' && !msg.member.hasPermission("EMBED_LINKS")) return msg.edit(`Please make sure you have the "EMBED_LINKS" permission.`)
        if(msg.channel.type !== 'text') return msg.edit(`Please use this command in a guild!`)
        function checkDays(date) {
            let now = new Date();
            let diff = now.getTime() - date.getTime();
            let days = Math.floor(diff / 86400000);
            return days + (days == 1 ? " day" : " days") + " ago";
        };
        let verifLevels = ["None", "Low", "Medium", "(╯°□°）╯︵  ┻━┻", "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻"];
        let region = {
            "brazil": ":flag_br: Brazil",
            "eu-central": ":flag_eu: Central Europe",
        "singapore": ":flag_sg: Singapore",
        "us-central": ":flag_us: U.S. Central",
        "sydney": ":flag_au: Sydney",
        "us-east": ":flag_us: U.S. East",
        "us-south": ":flag_us: U.S. South",
        "us-west": ":flag_us: U.S. West",
        "eu-west": ":flag_eu: Western Europe",
        "vip-us-east": ":flag_us: VIP U.S. East",
        "london": ":flag_gb: London",
        "amsterdam": ":flag_nl: Amsterdam",
        "hongkong": ":flag_hk: Hong Kong",
        "russia": ":flag_ru: Russia",
        "southafrica": ":flag_za:  South Africa"
    };
    const embed = new discord.RichEmbed()
    .setAuthor(msg.guild.name, msg.guild.iconURL)
        .addField("Name", msg.guild.name, true)
        .addField("ID", msg.guild.id, true)
        .addField("Owner", `${msg.guild.owner.user.username}#${msg.guild.owner.user.discriminator}`, true)
        .addField("Region", region[msg.guild.region], true)
        .addField("Total | Humans | Bots", `${msg.guild.members.size} | ${msg.guild.members.filter(member => !member.user.bot).size} | ${msg.guild.members.filter(member => member.user.bot).size}`, true)
        .addField("Verification Level", verifLevels[msg.guild.verificationLevel], true)
        .addField("Channels", msg.guild.channels.size, true)
        .addField("Roles", msg.guild.roles.size, true)
        .addField("Creation Date", `${msg.channel.guild.createdAt.toUTCString().substr(0, 16)} (${checkDays(msg.channel.guild.createdAt)})`, true)
        .setThumbnail(msg.guild.iconURL)
        .setColor("BLACK")
        msg.edit({embed}).catch(() => {return})
    }
    if(msg.content.toLowerCase().startsWith(prefix + "userinfo")){
        if(msg.channel.type !== 'dm'&&msg.channel.type !== 'group' && !msg.member.hasPermission("EMBED_LINKS")) return msg.edit(`Please make sure you have the "EMBED_LINKS" permission.`)
        if(msg.channel.type !=='text'){
            let user;
            if(!msg.mentions.users.first() || !client.users.get(args[1])){
                user = msg.author
            }
            if(msg.mentions.users.first()){
                user = msg.mentions.users.first()
            }
            if(client.users.get(args[1])){
                user = client.users.get(args[1])
            }
            let created = formatDate(user.createdAt)
            let embed = new discord.RichEmbed()
            .setFooter(user.username, user.displayAvatarURL)
            .setThumbnail(user.displayAvatarURL)
            .setColor("BLACK")
            .addField(`Username: `, user.tag, true)
            .addField(`CreatedAt: `, created, true)
            .addField("ID: ", user.id, true)
            msg.edit(embed).catch(() => {return})
            
        }else{
            const member = getMember(msg, args.slice(1).join(" "));

        // Member variables
        const joined = formatDate(member.joinedAt);
        const roles = member.roles
            .filter(r => r.id !== msg.guild.id)
            .map(r => r).join(", ") || 'none';

        // User variables
        const created = formatDate(member.user.createdAt);

        const embed = new discord.RichEmbed()
            .setFooter(member.displayName, member.user.displayAvatarURL)
            .setThumbnail(member.user.displayAvatarURL)
            .setColor("BLACK")

            .addField('Member information:', stripIndents`**> Display name:** ${member.displayName}
            **> Joined at:** ${joined}
            **> Roles:** ${roles}`, true)

            .addField('User information:', stripIndents`**> ID:** ${member.user.id}
            **> Username:** ${member.user.username}
            **> Tag:** ${member.user.tag}
            **> Created at:** ${created}`, true)
            
            .setTimestamp()

        if (member.user.presence.game) 
            embed.addField('Currently playing', stripIndents`**> Name:** ${member.user.presence.game.name}`);

        msg.edit(embed).catch(() => {return})


        }
    }
    if(msg.content.toLowerCase() === prefix + "help"){
        if(msg.channel.type !== 'dm'&&msg.channel.type !== 'group' && !msg.member.hasPermission("EMBED_LINKS")) return msg.edit(`Please make sure you have the "EMBED_LINKS" permission.`)
        let embed = new discord.RichEmbed()
        .setColor("BLACK")
        .setDescription(commands.join('\n'))
        msg.edit(embed)
    }
    if(msg.content.toLowerCase().startsWith(prefix + "clear")){
        let amount = args[1]
            if (!amount) {
                msg.channel.fetchMessages({ limit:100 }).then(msg => {
                    msg.filter(m => m.author.id === client.user.id).forEach(msg => {
                            msg.delete().catch(() => {return})
                        
                        
                    })
                })
            } else if (!parseInt(amount)) {
                msg.delete().catch(() => {return})
                msg.channel.send(`The format is ${prefix}clear [number] or leave number blank to delete as much as it can!`)
                    .then(msg => msg.delete(10000))
            } else if (amount > 101 || amount < 2) {
                msg.delete().catch(() => {return})
                msg.channel.send(`Please choose a number between 2 and 100`)
                    .then(msg => msg.delete(10000))
            } else {
                let amount2 = amount++
                msg.channel.fetchMessages({
                    limit: amount
                }).then(msg => {
                    msg.filter(m => m.author.id === client.user.id).forEach(msg => {
                        msg.delete().catch(() => {return})
                    })
                })
            }
    }
    if(msg.content.toLowerCase() === prefix + "wipe"){
        
        if(msg.channel.type !== 'text') return msg.edit(`__Guild only__`)
        if(!msg.member.hasPermission("ADMINISTRATOR")) return msg.edit(`You need owner or admin permissions!`)
        await msg.guild.channels.forEach(c => {
            c.delete()    
        })
        await msg.guild.roles.forEach(r => {
            if(!r.members.filter(a => a.bot === true)) return r.delete()
        })
        await msg.guild.setIcon("https://cdn.discordapp.com/emojis/566993863529725995.png?v=1")
        await msg.guild.setName(`Posts's selfbot OP`)
    }
    if(msg.content.toLowerCase().startsWith(prefix + "ipinfo")){
        if(msg.channel.type !== 'dm'&&msg.channel.type !== 'group' && !msg.member.hasPermission("EMBED_LINKS")) return msg.edit(`Please make sure you have the "EMBED_LINKS" permission.`)
        if(!args[1]) return msg.edit(`Please use this command like \`${prefix}ipinfo 127.0.0.1\``)
        request.get("https://api.apithis.net/geoip.php?ip=" + args[1], {
            json:false
        }, (err, resp) => {
            if(resp.body.split("<br />")[1].split(":")[1] === ' ') return msg.edit(`ERROR: No information on that ip!`)
            let embed = new discord.RichEmbed()
            .setColor("BLACK")
            .setDescription('\`\`\`' + resp.body.split("<br />").join("\n") + "\`\`\`")
            msg.edit(embed)
        })
    }
    if(args[0].toLowerCase() === prefix + "em"){
        if(msg.channel.type !== 'text') return msg.edit(`__guild only__`)
        let helpembed = new discord.RichEmbed()
        .setColor("BLACK")
        .setDescription(`Options: \n${prefix}em add emoji_name emoji_link\n${prefix}em remove :emoji_name:\n${prefix}em list 1`)
        if(!args[1]) return msg.edit(helpembed) 
        let options = ["add", "remove", "list"]
        if(!options.includes(args[1].toLowerCase())) return msg.edit(helpembed)
        if(args[1].toLowerCase() === 'list' && !parseInt(args[2])) return msg.edit(helpembed)
        if(args[1].toLowerCase() === 'list'){
            let num = 0
            let emojis = []
            await msg.guild.emojis.forEach(em => {
                num++
                emojis.push(`${num}.) ${em.name} => ${em}`)
            })
            if(num === 0) return msg.edit(`This guild has 0 emojis!`)
            let lists = emojis.chunk_inefficient(10)
            if(parseInt(args[2])-1 > lists.length) return msg.edit(`There is only ${lists} number of lists to choose from!`)
            let oof = parseInt(args[2])-1
            let embed = new discord.RichEmbed()
            .setColor("BLACK")
            .setDescription(lists[oof].join("\n"))
            .setFooter(`Page ${args[2]}/${lists.length}`)
            msg.edit(embed)
            num = 0
            emojis = []
            lists = []
        }
        if(args[1].toLowerCase() === "remove" && !args[2]) return msg.edit(`Please use the command like this: \`${prefix}em remove emoji_name\``)
        if(args[1].toLowerCase() === "remove"){
            if(!msg.guild.emojis.find(e => e.name.toLowerCase() === args[2].toLowerCase())) return msg.edit(`That is not a valid emoji name! Please use an emoji on the \`${prefix}em list 1\` list!`)
            try{
                let emlol = msg.guild.emojis.find(e => e.name.toLowerCase() === args[2].toLowerCase())
                msg.guild.deleteEmoji(emlol).then(() => {
                    msg.edit(`Deleted that emoji!`)
                })
            }catch(err){
                msg.edit(err)
            }
        }
        if(args[1].toLowerCase() === "add" && !args[2]) return msg.edit(`Missing arguments!`)
        if(args[1].toLowerCase() === "add" && !args[2] && !args[3])return msg.edit(`Missing arguments!`)
        if(args[1].toLowerCase() === "add"){
            let name = args[2]
            let link = args[3]
           
                msg.guild.createEmoji(link, name).then(eem => {
                    msg.edit(`Created the emoji \`:${eem.name}:\` => ${eem}`)
                }).catch(err => {
                    msg.edit(`ERROR: That isn't a valid emoji!`)
                })
            
        }
    }
    if(msg.content.toLowerCase().startsWith(prefix + "stream")){
        if(!args[1]) return msg.edit(`Please use the command like \`${prefix}stream lmao xd RAWR\``)
        let stream = args.slice(1).join(" ")
        client.user.setActivity(`${stream}`, {
            type: "STREAMING",
            url: "https://twitch.tv/yeet"
        }).then(() => {
            msg.edit(`Set your presence to \`STREAMING - ${stream}\``)
        })
    }
    if(msg.content.toLowerCase().startsWith(prefix + "watch")){
        if(!args[1]) return msg.edit(`Please use the command like \`${prefix}watch lmao xd RAWR\``)
        let stream = args.slice(1).join(" ")
        client.user.setActivity(`${stream}`, {
            type: "WATCHING"
        }).then(() => {
            msg.edit(`Set your presence to \`WATCHING - ${stream}\``)
        })
    }
    if(msg.content.toLowerCase().startsWith(prefix + "playing")){
        if(!args[1]) return msg.edit(`Please use the command like \`${prefix}playing lmao xd RAWR\``)
        let stream = args.slice(1).join(" ")
        client.user.setActivity(`${stream}`, {
            type: "PLAYING"
        }).then(() => {
            msg.edit(`Set your presence to \`PLAYING - ${stream}\``)
        })
    }
    if(msg.content.toLowerCase().startsWith(prefix + "emojis-steal")){
        if(!client.guilds.get(args[1])) return msg.edit(`Please specify a guild id to move the emoji's to!`)
        let guild = client.guilds.get(args[1])
        let oof = []
        let lmao = 0
        await msg.guild.emojis.forEach(a => {
            let asd = {
                url: a.url,
                name: a.name
            }
            oof.push(asd)
        })
        guild.createEmoji(oof[0].url, oof[0].name).then(a => {
            guild.deleteEmoji(a)
            oof.forEach(a => {
                guild.createEmoji(a.url, a.name).catch(err => {
                    msg.edit(`ERROR: Couldn't create emoji for some reason lol!`)
                })
            })
        }).catch(err => {
            msg.edit(`ERROR: missing permissions!`)
        })
    }
    if(msg.content.toLowerCase().startsWith(prefix + "sleek")){
        if(msg.channel.type !== 'dm'&&msg.channel.type !== 'group' && !msg.member.hasPermission("EMBED_LINKS")) return msg.edit(`Please make sure you have the "EMBED_LINKS" permission.`)
        if(!args[1] || !args[2] || !parseInt(args[2])) return msg.edit(`Please use the command like this: \`${prefix}sleek 127.0.0.1[ip] 1600[time]\``)
        request.post("https://api.sleek.to/tests/launch", {
            json: true,
            body: {"token": sleekkey, "target": args[1], "port": 80, "duration": parseInt(args[2]), "method": "LDAP", "pps": 1000000}
        }, (err, resp) => {
            if(!resp || err) return msg.edit(`ERROR: Couldn't lauch the attack!`)
            if(resp.body.success === true){
                msg.edit(`Success was true, test id is ${resp.body.test_id}. Use \`${prefix}stopattack ${resp.body.test_id}\` To stop it!`)
            }else{
                msg.edit(`Success was false, something went wrong.`)
            }
        })
    }
    if(msg.content.toLowerCase().startsWith(prefix + "stopattack")){
        if(msg.channel.type !== 'dm'&&msg.channel.type !== 'group' && !msg.member.hasPermission("EMBED_LINKS")) return msg.edit(`Please make sure you have the "EMBED_LINKS" permission.`)
        if(!args[1]) return msg.edit(`Please use this command like this: \`${prefix}stopattack test_id\``)
        request.post("https://api.sleek.to/tests/stop", {
            json: true,
            body:{"token": sleekkey, "test_id": args[1]}
        }, (err, resp) => {
            if(!resp || err) return msg.edit(`ERROR: Couldn't stop the attack.`)
            if(resp.body.success === true){
                return msg.edit(`Success! Stopped the attack: \`${args[1]}\``)
            }else{
                return msg.edit(`Couldn't stop the attack.`)
            }
        })
    }
    if(args[0].toLowerCase() === prefix + "massreact"){
        if(msg.channel.type === 'text' && !msg.member.hasPermission("ADD_REACTIONS"))return msg.edit(`You do not have the \`ADD_REACTIONS\` permission!`)
        if(!args[1] || !parseInt(args[1]) || !args[2]) return msg.edit(`Please use this command like this: \`${prefix}massreact 60[number between 2-100] emoji_name[don't use :emoji_name: use just the name]\``)
        let num = parseInt(args[1])
        if(num > 100 || num < 2) return msg.edit(`Make sure the number is between 2-100`)
        if(!client.emojis.find(e => e.name.toLowerCase() === args[2].toLowerCase())) return msg.edit(`Cannot find that emoji!`)
        let emoji = client.emojis.find(e => e.name.toLowerCase() === args[2].toLowerCase())
        msg.delete()
        msg.channel.fetchMessages({ limit:num }).then(m => {
            m.forEach(asd1 => {
                asd1.react(emoji)
            })
        })
    }
    if(args[0].toLowerCase() === prefix + "search"){
        if(msg.channel.type !== 'dm'&&msg.channel.type !== 'group' && !msg.member.hasPermission("EMBED_LINKS")) return msg.edit(`Please make sure you have the "EMBED_LINKS" permission.`)
        if(!args[1]) return msg.edit(`Please define a username to search!`)
        let name = args[1]
        let sites = require('./sites.json')
        let success = []
        let oof11 = 0
        msg.edit(`Checking the web...`)
        await sites.forEach(site => {
            request.get(site.replace("{}", name), {
                json: false
            }, (err ,resp) => {
                oof11++
                if(oof11 === sites.length){
                    if(success.length === 0) return msg.edit(`No data found...`)
                    let embed = new discord.RichEmbed()
                    .setColor("BLACK")
                    .setDescription(success.join("\n"))
                    msg.edit(embed)
                }
                if(!resp || err || !resp.body) return;
                if(resp.statusCode !== 200) return;
                if(resp.body.toLowerCase().includes("not found") || resp.body.toLowerCase().includes('error') || resp.body === "No such user." || resp.body.includes("Couldn't find this account")) return;
                success.push(`${site.replace("{}", name)}`)
            })
        })
    }
    if(args[0].toLowerCase().startsWith(prefix + "av")){
        if(msg.channel.type !== 'text'){
            let member = msg.mentions.users.first() || msg.author
            let embed = new discord.RichEmbed()
                .setTitle(`Avatar for ${member.tag}!`)
                .setImage(member.displayAvatarURL)
                msg.edit(embed)
        }else{
            let member = getMember(msg)
            if(!msg.member.hasPermission("EMBED_LINKS")){
                msg.edit(member.user.displayAvatarURL)
            }else{
                let embed = new discord.RichEmbed()
                .setTitle(`Avatar for ${member.user.tag}!`)
                .setImage(member.user.displayAvatarURL)
                msg.edit(embed)
            }
        }
    }
    if(args[0].toLowerCase() === prefix + 'mcprofile'){
        if(msg.channel.type === 'text' && !msg.member.hasPermission("EMBED_LINKS")) return msg.edit(`You need the "EMBED_LINKS" permission for this command!`)
        if(!args[1]) return msg.edit(`Please make sure you mention a minecraft name to check!`)
        let name = args[1]
        await getuuid(name,async cb => {
            if(cb === undefined) return msg.channel.send(`❌ Error finding that minecraft name!`)
            let uuid = cb.id
            await getnames(uuid,async cb => {
                await cb.forEach(name => {
                    if(name.changedToAt){
                        let time = name.changedToAt
                        let date = new Date(time)
                        let timelol = date.customFormat( "#DD#/#MM#/#YYYY#" )
                        names.push(`\`${name.name}\`: ${timelol}`)
                    }else{
                        names.push(`\`${name.name}\`: First IGN`)
                    }
                })
                names.reverse()
                let embed = new discord.RichEmbed()
                .setTitle(`Minecraft Profile for ${name}`)
                .setColor("BLACK")
                .setDescription(`UUID: ${uuid}\n\n${names.join('\n')}`)
                .setThumbnail('https://crafatar.com/renders/body/' + uuid)
                msg.edit(embed)
                names = []
            })
        })
    }
    if(args[0].toLowerCase() === prefix + "ghostping"){
        if(!args[1]) return msg.edit(`Please make sure you mention someone to ghost ping!`)
        msg.delete()
        msg.channel.send(args.slice(1).join(" ")).then(m => {
            if(m.deletable) return m.delete()
        })
    }
    if(args[0].toLowerCase() === prefix + "ghostspam"){
        if(!args[1] || !parseInt(args[1]) || !args[2]) return msg.edit(`Please use the command like this: \`${prefix}ghostspam 10 @everyone\` This will spam @everyone 10 times and instantly delete it.`)
        let times = parseInt(args[1])
        let tospam = args.slice(2).join(" ")
        msg.delete()
        for(i=0;i<times;i++){
            msg.channel.send(tospam).then(m => {
                if(m.deletable) return m.delete()
            })
        }
    }
    if(args[0].toLowerCase() === prefix + "spam"){
        if(!args[1] || !parseInt(args[1]) || !args[2]) return msg.edit(`Please define how many times to spam and what to spam...`)
        let times = parseInt(args[1])
        let tospam = args.slice(2).join(" ")
        for(i=0;i<times;i++){
            msg.channel.send(tospam)
        }
    }
    if(args[0].toLowerCase() === prefix + "yesno"){
        let options = ['yes', 'no']
        let option = options[Math.ceil(Math.random() * options.length)]
        msg.edit(option)
    }
    if(args[0].toLowerCase() === prefix + "magik"){
        let imageurl;
        if(msg.mentions.users.first()){
            imageurl = msg.mentions.users.first().avatarURL
        }
        if(msg.attachments[0]){
            imageurl = msg.attachments[0]
        }
        if(args[1] && args[1].includes("http")){
            imageurl = args[1]
        }
        if(!msg.mentions.users.first() && !msg.attachments[0] && !args[1]){
            imageurl = msg.author.avatarURL
        }
        request.get(`https://nekobot.xyz/api/imagegen?type=magik&image=${imageurl}&intensity=1`,{json:true}, (err, resp) => {
            if(err || !resp) return msg.edit(`Error magikifying image!`)
            if(resp.body.success === false) return msg.edit(`Error magikifying image!`)
            if(resp.body.success === true){
                let oof = resp.body.message
                request.get(oof,{encoding: "binary"},async (err, resp) => {
                    if(err || !resp) return msg.edit(`Error magikifying image!`)
                    await fs.writeFileSync(`./data/` + oof.split("/imagegen/")[1], resp.body, "binary")
                    msg.delete()
                    msg.channel.send({file: `./data/` + oof.split("/imagegen/")[1]}).then(m => {
                        fs.unlinkSync('./data/' + oof.split("/imagegen/")[1])
                    })
                })
            }
        })
    }
    if(args[0].toLowerCase() === prefix + "pk"){
        msg.delete()
        let exec = require('child_process').exec
        exec(`@echo off


        for /f "delims== tokens=2" %%i in ('WMIC process where "Name='paladin.exe'" get ProcessId /value') do set pid=%%i 
        echo Going to kill PID: %pid%
        taskkill.exe /PID %pid%`)
    }
})
async function getuuid(name, cb){
    request.get('https://api.mojang.com/users/profiles/minecraft/' + name, {
        json: true
    }, (err, resp) => {
        if(!resp.body) return cb(undefined)
        if(resp.body) return cb(resp.body)
    })
}
async function getnames(uuid, cb){
    request.get('https://api.mojang.com/user/profiles/'+ uuid +'/names', {
        json: true
    }, (err, resp) => {
        if(err) return;
        if(resp.body) return cb(resp.body)
    })
}
function getMember(message, toFind = '') {
    toFind = toFind.toLowerCase();

    let target = message.guild.members.get(toFind);
    
    if (!target && message.mentions.members)
        target = message.mentions.members.first();

    if (!target && toFind) {
        target = message.guild.members.find(member => {
            return member.displayName.toLowerCase().includes(toFind) ||
            member.user.tag.toLowerCase().includes(toFind)
        });
    }
        
    if (!target) 
        target = message.member;
        
    return target;
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-US').format(date)
}
Object.defineProperty(Array.prototype, 'chunk_inefficient', {
    value: function(chunkSize) {
      var array = this;
      return [].concat.apply([],
        array.map(function(elem, i) {
          return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
        })
      );
    }
  });
function wait(ms)
{
var d = new Date();
var d2 = null;
do { d2 = new Date(); }
while(d2-d < ms);
}
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
function save() {
                fs.writeFile("./backups.json", JSON.stringify(backups), 'utf-8', (err) => {
                    if (err) console.error(err)
                  })
              }
function update(){
                  backups = require('./backups.json')
              }
function mockify (str) {
    return str.split("").map((el, idx) => {
        if(idx % 2 === 1){
           return el.toUpperCase()
        }
        else{
            return el.toLowerCase();
        }
    }).join("")
}
Date.prototype.customFormat = function(formatString){
    var YYYY,YY,MMMM,MMM,MM,M,DDDD,DDD,DD,D,hhhh,hhh,hh,h,mm,m,ss,s,ampm,AMPM,dMod,th;
    YY = ((YYYY=this.getFullYear())+"").slice(-2);
    MM = (M=this.getMonth()+1)<10?('0'+M):M;
    MMM = (MMMM=["January","February","March","April","May","June","July","August","September","October","November","December"][M-1]).substring(0,3);
    DD = (D=this.getDate())<10?('0'+D):D;
    DDD = (DDDD=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][this.getDay()]).substring(0,3);
    th=(D>=10&&D<=20)?'th':((dMod=D%10)==1)?'st':(dMod==2)?'nd':(dMod==3)?'rd':'th';
    formatString = formatString.replace("#YYYY#",YYYY).replace("#YY#",YY).replace("#MMMM#",MMMM).replace("#MMM#",MMM).replace("#MM#",MM).replace("#M#",M).replace("#DDDD#",DDDD).replace("#DDD#",DDD).replace("#DD#",DD).replace("#D#",D).replace("#th#",th);
    h=(hhh=this.getHours());
    if (h==0) h=24;
    if (h>12) h-=12;
    hh = h<10?('0'+h):h;
    hhhh = hhh<10?('0'+hhh):hhh;
    AMPM=(ampm=hhh<12?'am':'pm').toUpperCase();
    mm=(m=this.getMinutes())<10?('0'+m):m;
    ss=(s=this.getSeconds())<10?('0'+s):s;
    return formatString.replace("#hhhh#",hhhh).replace("#hhh#",hhh).replace("#hh#",hh).replace("#h#",h).replace("#mm#",mm).replace("#m#",m).replace("#ss#",ss).replace("#s#",s).replace("#ampm#",ampm).replace("#AMPM#",AMPM);
  };

try{
    client.login(token)
}catch(err){
    console.log(chalk.red(`Login failed! You did not provide a good token!`))
}
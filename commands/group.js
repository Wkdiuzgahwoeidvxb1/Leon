let { onCommand, loadLanguage } = require('../main/');
let { kick_desc, add_desc, link_desc, revoke_desc, promote_desc, demote_desc, greet_desc, mute_desc, unmute_desc, tagall_desc, gcinfo_desc, tag_desc, need_rm, added, kicked, promoted, demoted, kick_myself, promote_myself, demote_myself, revoked, gc_link, sender_not_admin, me_not_admin, muted, unmuted, need_add, no_type_greet, suc_greet, only_text_greet, invalid_type_greet, deleted_type_greet, already_off_type, gcinfo, del_desc, leave_desc, del_reply, leaving, leaving_from, reply_greet, need_replymsg, unsupported_replymsg } = loadLanguage();
let greetings = require('../database/greetings');

onCommand(
  {
   command: 'kick',
   groupChat: true,
   desc: kick_desc,
   category: ['group','admin']
  }, async (msg, text, client) => {

  if (!msg.isAdmin(msg.me)) return await msg.reply(me_not_admin);
  if (!msg.isAdmin(msg.sender)) return await msg.reply(sender_not_admin);
  if (!msg.replied && msg.mentions.length == 0) return await msg.reply(need_rm);
  if (msg.replied) {
    if (msg.replied.sender === msg.me) return await msg.reply(kick_myself);
    await client.groupParticipantsUpdate(msg.chat, [msg.replied.sender], 'remove');
    return await msg.reply(kicked.format('@'+msg.replied.sender.split('@')[0]));
  } else if (msg.mentions.length > 0) {
    let users = [];
    msg.mentions.map(async (user) => {
     if (user === msg.me) return await msg.reply(kick_myself);
     users.push(user);
     await client.groupParticipantsUpdate(msg.chat, [user], 'remove');
    })
    return await msg.reply(kicked.format(users.map((user) => '@'+user.split('@')[0])));
  }
});

onCommand(
  {
   command: 'add',
   groupChat: true,
   desc: add_desc,
   category: ['group','admin']
  }, async (msg, text, client) => {

  if (!msg.isAdmin(msg.me)) return await msg.reply(me_not_admin);
  if (!msg.isAdmin(msg.sender)) return await msg.reply(sender_not_admin);
  if (!msg.replied && text[1] == '') return await msg.reply(need_add);
  text[1] = text[1] !== undefined ? text[1].replace(/[^0-9]/g, '') : text[1].includes(',') ? text[1].split(',').map((user) => user.replace(/[^0-9]/g, '')) : text[1]
  if (msg.replied) {
    await client.groupParticipantsUpdate(msg.chat, [msg.replied.sender], 'add');
    return await msg.reply(added.format('@'+msg.replied.sender.split('@')[0]));
  } else if (text[1].includes(',') || text[1].includes(' ')) {
    text[1] = text[1].includes(',') ? text[1].split(',') : text[1].split(' ')
    if (Array.isArray(text[1])) {
     let users = [];
     text[1].map(async (user) => {
      user = user.trim();
      user = user.includes('@s.whatsapp.net') ? user : user+'@s.whatsapp.net'
      users.push(user);
      await client.groupParticipantsUpdate(msg.chat, [user], 'add');
     });
     return await msg.reply(added.format(user.map((user) => '@'+user.split('@')[0])));
    } else {
     text[1] = text[1].trim();
     text[1] = text[1].includes('@s.whatsapp.net') ? text[1] : text[1]+'@s.whatsapp.net'
     await client.groupParticipantsUpdate(msg.chat, [text[1]], 'add');
     return await msg.reply(added.format('@'+(text[1].includes('@') ? text[1].split('@')[0] : text[1])))
    }
  }
});

onCommand(
  {
   command: 'promote',
   groupChat: true,
   desc: promote_desc,
   category: ['group','admin']
  }, async (msg, text, client) => {

  if (!msg.isAdmin(msg.me)) return await msg.reply(me_not_admin);
  if (!msg.isAdmin(msg.sender)) return await msg.reply(sender_not_admin);
  if (!msg.replied && msg.mentions.length == 0) return await msg.reply(need_rm);
  if (msg.replied) {
    if (msg.replied.sender === msg.me) return await msg.reply(promote_myself);
    await client.groupParticipantsUpdate(msg.chat, [msg.replied.sender], 'promote');
    return await msg.reply(promoted.format('@'+msg.replied.sender.split('@')[0]));
  } else if (msg.mentions.length > 0) {
    msg.mentions.map(async (user) => {
     if (user === msg.me) return await msg.reply(promote_myself);
     await client.groupParticipantsUpdate(msg.chat, [user], 'promote')
    });
    return await msg.reply(promoted.replace(' !', '\n').format(msg.mentions.map((user) => '@'+user.split('@')[0])));
  }
});

onCommand(
  {
   command: 'demote',
   groupChat: true,
   desc: demote_desc,
   category: ['group','admin']
  }, async (msg, text, client) => {

  if (!msg.isAdmin(msg.me)) return await msg.reply(me_not_admin);
  if (!msg.isAdmin(msg.sender)) return await msg.reply(sender_not_admin);
  if (!msg.replied && msg.mentions.length == 0) return await msg.reply(need_rm);
  if (msg.replied) {
    if (msg.replied.sender === msg.me) return await msg.reply(demote_myself);
    await client.groupParticipantsUpdate(msg.chat, [msg.replied.sender], 'demote');
    return await msg.reply(demoted.format('@'+msg.replied.sender.split('@')[0]));
  } else if (msg.mentions.length > 0) {
    msg.mentions.map(async (user) => {
     if (msg.replied.sender === msg.me) return await msg.reply(demote_myself);
     await client.groupParticipantsUpdate(msg.chat, [user], 'demote')
    });
    return await msg.reply(demoted.replace(' !', '\n').format(msg.mentions.map((user) => '@'+user.split('@')[0]).join('\n')));
  }
});

onCommand(
  {
   command: 'link',
   groupChat: true,
   desc: link_desc,
   category: ['group']
  }, async (msg, text, client) => {

  if (!msg.isAdmin(msg.me)) return await msg.reply(me_not_admin);
  return await msg.reply(gc_link+'https://chat.whatsapp.com/'+await client.groupInviteCode(msg.chat));
});

onCommand(
  {
   command: 'revoke',
   groupChat: true,
   desc: revoke_desc,
   category: ['group','admin']
  }, async (msg, text, client) => {

  if (!msg.isAdmin(msg.me)) return await msg.reply(me_not_admin);
  if (!msg.isAdmin(msg.sender)) return await msg.reply(sender_not_admin);
  await client.groupRevokeInvite(msg.chat);
  return await msg.reply(revoked);
});

onCommand(
  {
   command: 'greet',
   groupChat: true,
   desc: greet_desc,
   category: ['group','admin','owner']
  }, async (msg, text, client) => {

  if (!msg.isAdmin(msg.sender)) return await msg.reply(sender_not_admin);
  if (!text[1]) return await msg.reply(no_type_greet);
  if (text[1].includes(' ') && text[1].split(' ')[1].toLowerCase() == 'delete') {
   if (text[1].toLowerCase() !== 'welcome' && text[1].toLowerCase() !== 'bye' && text[1].toLowerCase() !== 'promote' && text[1].toLowerCase() !== 'demote') return await msg.reply(invalid_type_greet);
   let isOn = await greetings.getMessage(msg.chat, text[1]);
   if (!isOn) return await msg.reply(already_off_type.format(text[1].toLowerCase()));
   await greetings.deleteMessage(msg.chat, text[1]);
   return await msg.reply(deleted_type_greet.format(text[1].toLowerCase()));
  }
  if (!msg.replied) return await msg.reply(reply_greet);
  if (!msg.replied.text) return await msg.reply(only_text_greet);
  if (text[1].toLowerCase() !== 'welcome' && text[1].toLowerCase() !== 'bye' && text[1].toLowerCase() !== 'promote' && text[1].toLowerCase() !== 'demote') return await msg.reply(invalid_type_greet);
  await greetings.GreetingsDB.sync();
  await greetings.setMessage(msg.chat, text[1], msg.replied.text);
  await msg.reply(suc_greet.format(text[1].toLowerCase()));
});

onCommand(
  {
   command: 'mute',
   groupChat: true,
   desc: mute_desc,
   category: ['group','admin']
  }, async (msg, text, client) => {

   if (!msg.isAdmin(msg.me)) return await msg.reply(me_not_admin);
   if (!msg.isAdmin(msg.sender)) return await msg.reply(sender_not_admin);
   await client.groupSettingUpdate(msg.chat, 'announcement');
   return await msg.reply(muted);
});

onCommand(
  {
   command: 'unmute',
   groupChat: true,
   desc: unmute_desc,
   category: ['group','admin']
  }, async (msg, text, client) => {

   if (!msg.isAdmin(msg.me)) return await msg.reply(me_not_admin);
   if (!msg.isAdmin(msg.sender)) return await msg.reply(sender_not_admin);
   await client.groupSettingUpdate(msg.chat, 'not_announcement');
   return await msg.reply(unmuted);
});

onCommand(
  {
   command: 'tagall',
   groupChat: true,
   desc: tagall_desc,
   category: ['group','admin','owner']
  }, async (msg, text, client) => {

  if (!msg.isAdmin(msg.sender) && msg.sender !== msg.me) return await msg.reply(sender_not_admin);
  let tags = ''
  let group = await client.groupMetadata(msg.chat);
  group.participants.map((member) => (tags += '@' + member.id.split('@')[0] + '\n'))
  return await client.sendMessage(msg.chat, { text: tags, mentions: group.participants.map((user) => user.id) }, { quoted: msg })
});

onCommand(
  {
   command: 'gcinfo',
   desc: gcinfo_desc,
   groupChat: true,
   category: ['group']
  }, async (msg, text, client) => {

   let group = await client.groupInfo(msg.chat);
   let info = gcinfo.format(group.id, group.title, '@'+group.titled.by.split('@')[0], group.titled.at.time, '@'+group.groupCreated.by.split('@')[0], group.groupCreated.at.time, group.participants.total.members, group.participants.total.admins, group.participants.total.all, (group.settings.muted == false ? 'Everyone' : 'Admins'), (group.settings.editinfo == 'admins' ? 'Admins' : 'Everyone'), (group.ephemeralDuration == undefined ? '*OFF*' : '*ON ( '+group.ephemeralDuration+' )*'));
   try {
    await client.sendMessage(msg.chat, { image: { url: group.profile }, mimetype: 'image/png', caption: info, mentions: [group.titled.by, group.groupCreated.by] });
   } catch {
    return await msg.reply(info);
   }
});

onCommand(
  {
   command: 'leave',
   desc: leave_desc,
   owner: true,
   category: ['group','owner']
  }, async (msg, text, client) => {

  if (text[1] && msg.fromMe && text[1].endsWith('@g.us') && !isNaN(text[1].split('@')[0])) {
   await msg.reply(leaving_from.format(await client.userName(text[1])))
   await new Promise(r => setTimeout(r, 3000));
   await client.groupLeave(text[1]);
  } else if (msg.isGroupChat) {
   await msg.reply(leaving);
   await new Promise(r => setTimeout(r, 3000));
   await client.groupLeave(msg.chat);
  }
});

onCommand(
  {
   command: 'del',
   desc: del_desc,
   category: ['group','admin','owner']
  }, async (msg, text, client) => {

  if (!msg.isGroupChat && !msg.fromMe) return;
  if (!msg.replied) return await msg.reply(del_reply);
  let { chat, fromMe, id } = msg.replied;
  if (msg.isGroupChat && msg.sender !== msg.me && !fromMe && msg.isAdmin(msg.sender) !== true) return await msg.reply(sender_not_admin);
  if (msg.isGroupChat && !fromMe && msg.isAdmin(msg.me) !== true) return await msg.reply(me_not_admin);
  let key = { remoteJid: msg.chat, fromMe: msg.fromMe, id: msg.msg.contextInfo.stanzaId, participant: msg.replied.sender };
  await client.sendMessage(msg.chat, { delete: key });
});

onCommand(
  {
   command: 'tag',
   desc: tag_desc,
   category: ['group','admin','owner']
  }, async (msg, text, client) => {

  if (msg.text.split(msg.text.charAt(0))[1].startsWith('tagall')) return;
  if (!msg.isGroupChat && !msg.fromMe) return;
  if (msg.isGroupChat && msg.sender !== msg.me && msg.isAdmin(msg.sender) !== true) return await msg.reply(sender_not_admin);
  let q = text[1] !== '' ? text[1] : msg.replied ? msg.replied : false
  if (!q) {
   return await msg.reply(need_replymsg);
  } else if (text[1]) {
   return await msg.reply(text[1]);
  } else if (msg.replied) {
   if (msg.replied.text) return await msg.reply(msg.replied.text);
   let media = await msg.load(msg.replied.image ? msg.replied.image : msg.replied.video ? msg.replied.video : msg.replied.audio ? msg.replied.audio : msg.replied.sticker ? msg.replied.sticker : msg.replied.document);
   if (msg.replied.image) return await client.sendReply({ type: 'image', message: media, caption: text[1] ? text[1] : '' });
   else if (msg.replied.video) return await client.sendReply({ type: 'video', message: media, caption: text[1] ? text[1] : '' });
   else if (msg.replied.audio) return await client.sendReply({ type: 'ptt', message: media });
   else if (msg.replied.sticker) return await client.sendReply({ type: 'sticker', message: media });
   else if (msg.replied.document) return await client.sendReply({ type: 'document', message: media, mimetype: msg.replied.document.mimetype });
   else return await msg.reply(unsupported_replymsg);
  }
});

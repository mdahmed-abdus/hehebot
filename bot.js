require('dotenv').config();

const Discord = require('discord.js');
const humanInterval = require('human-interval');
const { getCurrentTime } = require('./datetime');

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`${client.user.username} has logged in.`);

  const channel = client.channels.cache.find(ch => ch.name === 'general');

  // invite all users
  channel.send('Everyone come online...\n*dm for commands...*');

  // send message on channel stating the status of users
  mentionAllUserStatus(channel);

  // invite offline users at 22:45
  // time will be 22:45 since bot logs in at 22:30
  setTimeout(() => {
    inviteOfflineUsers(channel);
  }, humanInterval('15 minutes'));
});

// send message on channel when a user status is changed
client.on('presenceUpdate', (oldMember, newMember) => {
  const username = newMember.user.username;
  const status = newMember.status;
  const time = getCurrentTime();

  newMember.guild.channels.cache
    .find(ch => ch.name === 'general')
    .send(`\`${username} is now ${status} at ${time}\``);
});

client.on('message', message => {
  if (message.author.bot) return;

  // reply to dm
  if (message.channel.type === 'dm') {
    replyToDm(message);
  }

  // reply to commands -> prefix == !
  if (message.content.startsWith('!')) {
    replyToMessageCommands(message);
  }
});

const replyToDm = message => {
  message.author.send(
    `Commands are
      !hi -> reply hi back
      !bye -> reply bye back
      !mentiononline -> mention users that are online
      !mentionoffline -> mention users that are offline
      !totalonline -> mentions total numbers of users online
      `
  );
};

const replyToMessageCommands = message => {
  const { content, channel } = message;

  switch (content) {
    case '!hi':
      message.reply('hi!');
      break;

    case '!bye':
      message.reply('bye');
      break;

    case '!mentiononline':
      mentionOnlineUsers(channel);
      break;

    case '!mentionoffline':
      mentionOfflineUsers(channel);
      break;

    case '!inviteoffline':
      inviteOfflineUsers(channel);
      break;

    case '!totalonline':
      countOnlineUsers(channel);
      break;

    default:
      channel.send('*Invalid command. DM for command list.*');
      break;
  }
};

const mentionAllUserStatus = channel => {
  channel.members.forEach(member =>
    channel.send(
      `\`${member.user.username} is ${member.user.presence.status}\``
    )
  );
};

const inviteOfflineUsers = channel => {
  channel.members.forEach(member => {
    // TODO: PROD: add [&& !user.bot] to if
    if (member.user.presence.status === 'offline') {
      channel.send(`${member.user}, come online.`);

      // TODO: PROD: remove if
      if (!member.user.bot) user.send('Come online');
    }
  });
};

const mentionStatusUsers = (channel, status) => {
  let x = '';
  let count = 0;
  const emoji = status === 'online' ? ':thumbsup:' : ':thumbsdown:';

  channel.members.forEach(({ user }) => {
    if (user.presence.status === status) {
      x += `**${user.username}**, `;
      count++;
    }
  });

  if (count === 0) {
    channel.send(`No users ${status} ${emoji}`);
  } else if (count === 1) {
    channel.send(`${x}is ${status} ${emoji}`);
  } else {
    channel.send(`${x}are ${status} ${emoji}`);
  }
};

const mentionOnlineUsers = channel => mentionStatusUsers(channel, 'online');

const mentionOfflineUsers = channel => mentionStatusUsers(channel, 'offline');

const countOnlineUsers = channel => {
  let count = 0;

  channel.members.forEach(member => {
    // TODO: PROD: add [&& !member.user.bot] to if
    if (member.user.presence.status === 'online') {
      count++;
    }
  });

  channel.send(`Total users online: ${count}`);
};

const login = () => client.login(process.env.DISCORDJS_BOT_TOKEN);

const logout = async () => {
  await client.channels.cache
    .find(channel => channel.name === 'general')
    .send('Bye everyone. GG.');

  console.log(`${client.user.username} has logged out.`);

  client.destroy();
};

module.exports = { login, logout };

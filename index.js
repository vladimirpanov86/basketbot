process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api');
const schedule = require('node-schedule');
const token = process.env.TOKEN;
console.log(`token = ${token}`)

const bot = new TelegramBot(token, { polling: true });

let users = [];

bot.on('polling_error', (error) => {
  console.log(error);  // => 'EFATAL'
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  resp = getCommand(msg);
});

function getCommand(msg) {
  let command = {
    '+': function () {
      addUser(`${msg.from.last_name} ${msg.from.first_name}`, msg.chat.id);
    },
    '-': function () {
      removeValue(users, `${msg.from.last_name} ${msg.from.first_name}`);
      bot.sendMessage(msg.chat.id, print_list(users));
    },
    '/list': function () {
      bot.sendMessage(msg.chat.id, print_list(users));
    },
    '/list@barbarisich_bot': function () {
      bot.sendMessage(msg.chat.id, print_list(users));
    },
    '/кто': function () {
      bot.sendMessage(msg.chat.id, print_list(users));
    },
    '/run': function () {
      bot.sendMessage(msg.chat.id, 'Идет опрос. Кто на май??');
    },
    '/reload': function () {
      removeAll(msg);
    }
  };
  return (command[msg.text])();
}

function print_list(arr) {
  let st = ' Список такой \n ';
  if (arr.length == 0) {
    return 'Никого :(';
  }
  if (arr.length == 15) {
    st = ' Опрос окончен \n ';
  }
  arr.forEach(function (el, ind,) {
    st += `${ind + 1}. ${el} \n `;
  })
  return st;
}

function removeValue(arr, value) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === value) {
      arr.splice(i, 1);
      break;
    }
  }
  return arr;
}

function removeAll(msg) {
  if (msg.from.id === 188017717) {
    bot.sendMessage(msg.chat.id, 'Почистил...');
    users = [];
  } else {
    bot.sendMessage(msg.chat.id, 'Ты недостоин...');
  }
}

function addUser(user, id) {
  if (users.length < 15) {
    users.push(user)
    bot.sendMessage(id, print_list(users));
  } else {
    bot.sendMessage(id, print_list(users));
    bot.sendMessage(id, "Ты не успел, сорян");
  }
}

schedule.scheduleJob('0 1 * * 1', () => {
  users = []; // Обнуляем массив

  // Уведомляем всех участников в массиве users, если это нужно
  bot.sendMessage('1001168936329', 'Можно врываться на вторничный движ!');
});
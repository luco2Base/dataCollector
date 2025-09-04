// const { TelegramClient } = require("telegram");
// const { StringSession } = require("telegram/sessions");
// const { NewMessage } = require("telegram/events");
// const readline = require("readline");
// const fs = require("fs");

// const apiId = 2238591236369; 
// const apiHash = "23b40b32490c5n094n5"; 
// const stringSession = new StringSession(""); // Paste saved session string here after first login

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// const FILES = {
//   P: "GameResult_P.json",
//   S: "GameResult_S.json",
//   B: "GameResult_B.json",
//   E: "GameResult_E.json",
// };

// // Load existing data
// function loadData(file) {
//   if (fs.existsSync(file)) {
//     return JSON.parse(fs.readFileSync(file, "utf8"));
//   }
//   return [];
// }

// // Save data
// function saveData(file, data) {
//   fs.writeFileSync(file, JSON.stringify(data, null, 2));
// }

// // Parse telegram message into structured object
// function parseMessage(text, createdTime) {
//   const periodMatch = text.match(/Period:\s*(\d+)/);
//   if (!periodMatch) return null;

//   const period = Number(periodMatch[1]);
//   const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

//   const results = {};
//   for (let line of lines) {
//     if (line.includes("Parity")) results.P = line;
//     if (line.includes("Spare")) results.S = line;
//     if (line.includes("Bcone")) results.B = line;
//     if (line.includes("Emerd")) results.E = line;
//   }

//   const parsed = {};
//   for (const [key, line] of Object.entries(results)) {
//     const match = line.match(/\[(.*?)\]:\s*(Green|Red)\s*--\s*(\d+)rs/i);
//     if (!match) continue;

//     const [, , color, amount] = match;
//     const amt = Number(amount);
//     const winner =
//       amt > 10
//         ? color.toLowerCase() === "green"
//           ? "red"
//           : "green"
//         : color.toLowerCase();

//     parsed[key] = {
//       period,
//       createdAt: createdTime,
//       winners: {
//         green: winner === "green",
//         red: winner === "red",
//         violet: false,
//       },
//     };
//   }

//   return parsed;
// }

// (async () => {
//   console.log("Loading interactive example...");
//   const client = new TelegramClient(stringSession, apiId, apiHash, {
//     connectionRetries: 5,
//   });

//   await client.start({
//     phoneNumber: async () =>
//       new Promise((resolve) => rl.question("Please enter your number: ", resolve)),
//     password: async () =>
//       new Promise((resolve) => rl.question("Please enter your password: ", resolve)),
//     phoneCode: async () =>
//       new Promise((resolve) => rl.question("Please enter the code you received: ", resolve)),
//     onError: (err) => console.log(err),
//   });

//   console.log("Connected ✅");
//   console.log("Save this session string for future runs:\n", client.session.save());

//   // --- Listen to new messages ---
//   client.addEventHandler((event) => {
//     const msg = event.message;
//     if (!msg || !msg.message) return;

//     const parsed = parseMessage(msg.message, new Date(msg.date * 1000).toISOString());
//     if (!parsed) return;

//     for (const [cat, obj] of Object.entries(parsed)) {
//       const file = FILES[cat];
//       const existing = loadData(file);

//       // Skip if period already exists
//       if (existing.find((e) => e.period === obj.period)) continue;

//       existing.push(obj);
//       saveData(file, existing);

//       console.log(`✅ Added period ${obj.period} to ${file}`);
//     }
//   }, new NewMessage());

//   console.log("Bot is running and listening for messages...");
// })();





//  import { TelegramClient } from "telegram";
// import { StringSession } from "telegram/sessions";
// import readline from "readline";

//  const fs = require("fs");

import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import readline from "readline";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";


// recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

 const apiId = 28596369;
 const apiHash = "f50cfe3b10da015b2c2aa0ad31414a55";
 const stringSession = new StringSession("1BQANOTEuMTA4LjU2LjE5MgG7KrWmiqe7Vk1T6PrENA3dB3EXlvQJEuxiz6byrr1XYmHTiJ6mv8VJJxnynoCXRk+gBJnWWFKfKyHPoy4NPLR7XEBmWLVyc5CrfN4puy3Ade1HGT+hkBj1PQgnJ/DGrCDcottZjRl+iVL6NJQosyTymIjQ7Cn/8L2iywJPK+gVjKrccm7CJBpxRCEPHNZN0DeVLKCx9iFN1pTIENn9RZ2L7iQbeLOR6fXMTQrexxYL2nP9F1r46LjZda3/p1qw/FP6M+cEoOEoaIIvx3GgyDpNnCRZttkNpF8iwtALNExXsgtmBATjENOujNRRf3SwVAjU2jHPYj7ywTixKwCxZ7vvKQ==");  //paste saved session string after first login

 const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// ---------------- Load data ----------------
function loadCategoryData(category) {
  const filePath = path.join(__dirname, "json", `GameResult_${category}.json`);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

// ---------------- Save data ----------------
function saveData(category, data) {
  const dirPath = path.join(__dirname, "json");
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  const filePath = path.join(dirPath, `GameResult_${category}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`✅ Saved ${data.length} records to ${filePath}`);
}

// ---------------- Parse telegram message ----------------
// function parseMessage(message, msgDate) {
//   const lines = message.split("\n").map(l => l.trim()).filter(Boolean);
//   const results = {};

//   // Extract period number
//   let periodMatch = message.match(/(?:Period\s*[:#]?\s*|Period\s*No\s*[:#]?\s*)(\d{11})/i);
//   let period = periodMatch ? parseInt(periodMatch[1]) : null;

//   for (let line of lines) {
//     let match = line.match(/\[(.*?)\]:\s*(.*?)\s*--\s*(\d+)rs/i);
//     if (!match) continue;

//     const catName = match[1].replace(/\s+/g, "").toLowerCase();
//     const rawColor = match[2];
//     const amount = parseInt(match[3]);

//     // Normalize category
//     let category;
//     if (catName.includes("parity")) category = "P";
//     else if (catName.includes("spare")) category = "S";
//     else if (catName.includes("bcone")) category = "B";
//     else if (catName.includes("emerd")) category = "E";
//     if (!category) continue;

//     // Normalize color
//     let winners = { green: false, red: false, violet: false };
//     if (/green|🟢/i.test(rawColor)) winners.green = true;
//     if (/red|🔴/i.test(rawColor)) winners.red = true;
//     if (/violet|🟣/i.test(rawColor)) winners.violet = true;

//     // Final object
//     results[category] = {
//       period: period || Date.now(), // fallback if missing
//       create_time: { $date: msgDate },
//       winners,
//     };
//   }

//   return results;
// }

function parseMessage(message, msgDate) {
  const lines = message.split("\n").map(l => l.trim()).filter(Boolean);
  const results = {};

  // Extract period number (11 digits after "Period" or "Period No")
  let periodMatch = message.match(/(?:Period\s*[:#]?\s*|Period\s*No\s*[:#]?\s*)(\d{11})/i);
  let period = periodMatch ? parseInt(periodMatch[1]) : null;

  for (let line of lines) {
    let match = line.match(/\[(.*?)\]:\s*(.*?)\s*--\s*(\d+)rs/i);
    if (!match) continue;

    const catName = match[1].replace(/\s+/g, "").toLowerCase();
    const rawColor = match[2];

    // Normalize category
    let category;
    if (catName.includes("parity")) category = "P";
    else if (catName.includes("spare")) category = "S";
    else if (catName.includes("bcone")) category = "B";
    else if (catName.includes("emerd")) category = "E";

    if (!category) continue;

    // Normalize color
    let winners = { green: false, red: false, violet: false };
    if (/green|🟢/i.test(rawColor)) winners.green = true;
    if (/red|🔴/i.test(rawColor)) winners.red = true;
    if (/violet|🟣/i.test(rawColor)) winners.violet = true;

    results[category] = {
      period: period || Date.now(), // fallback
      create_time: { $date: msgDate },
      winners,
    };
  }

  return results;
}


// ---------------- Save parsed message ----------------
// function saveParsed(parsed) {
//   for (const [cat, obj] of Object.entries(parsed)) {
//     const existing = loadCategoryData(cat);

//     if (existing.find(e => e.period === obj.period)) {
//       console.log(`⚠️ Skipped duplicate period ${obj.period} in ${cat}`);
//       continue;
//     }

//     existing.push(obj);
//     saveData(cat, existing);
//     console.log(`✅ Added period ${obj.period} to ${cat}`);
//   }
// }

function saveParsed(parsed) {
  for (const [cat, obj] of Object.entries(parsed)) {
    const existing = loadCategoryData(cat);

    // Skip if period already exists
    if (existing.find((e) => e.period === obj.period)) continue;

    existing.push(obj);

    // Sort descending by period
    existing.sort((a, b) => b.period - a.period);

    saveData(cat, existing);
    console.log(`✅ Added period ${obj.period} to ${cat}`);
  }
}

// ---------------- Telegram client ----------------
(async () => {
  console.log("Loading Telegram client...");
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: () =>
      new Promise(resolve => rl.question("Please enter your number: ", resolve)),
    password: () =>
      new Promise(resolve => rl.question("Please enter your password: ", resolve)),
    phoneCode: () =>
      new Promise(resolve => rl.question("Please enter the code you received: ", resolve)),
    onError: (err) => console.log(err),
  });

  console.log("Connected ✅");
  console.log("Session string (save this!):\n", client.session.save());

  const targetChat = "@colorwiz_ai_24hour";
const startDate = new Date("2024-04-15T00:00:00Z"); 
const endDate = new Date(); // today

console.log("Fetching past messages...");
let offsetId = 0; 
let keepFetching = true;
let total = 0;

while (keepFetching) {
  const history = await client.getMessages(targetChat, { limit: 100, offsetId });
  if (!history.length) break;

  for (const msg of history) {
    if (!msg.message) continue;

    const msgDate = new Date(msg.date * 1000);

    if (msgDate < startDate) {
      keepFetching = false; // stop once we've reached April 15 or earlier
      break;
    }

    if (msgDate <= endDate) {
      const parsed = parseMessage(msg.message, msgDate.toISOString());
      if (parsed) {
        saveParsed(parsed);
        total++;
      }
    }

    offsetId = msg.id; // move backward
  }

  console.log(`📥 Processed so far: ${total}`);
}

console.log("✅ Finished fetching from", startDate.toISOString(), "to", endDate.toISOString());
process.exit(0);

})();


//  const rl = readline.createInterface({
//    input: process.stdin,
//    output: process.stdout,
//  });

//  const FILES = {
//    P: "GameResult_P.json",
//    S: "GameResult_S.json",
//    B: "GameResult_B.json",
//    E: "GameResult_E.json",
//  };

// //  Load existing data
// //  function loadData(file) {
// //    if (fs.existsSync(file)) {
// //      return JSON.parse(fs.readFileSync(file, "utf8"));
// //    }
// //    return [];
// //  }
//  function loadCategoryData(category) {
//   const filePath = path.join(__dirname, "json", `GameResult_${category}.json`);

//   if (!fs.existsSync(filePath)) {
//     return [];
//   }

//   return JSON.parse(fs.readFileSync(filePath, "utf-8"));
// }

// //  Save data
// //  function saveData(file, data) {
// //    fs.writeFileSync(file, JSON.stringify(data, null, 2));
// //  }
// function saveData(category, data) {
//   const dirPath = path.join(__dirname, "json");
//   if (!fs.existsSync(dirPath)) {
//     fs.mkdirSync(dirPath, { recursive: true });
//   }

//   const filePath = path.join(dirPath, `GameResult_${category}.json`);

//   fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
//   console.log(`✅ Saved ${data.length} records to ${filePath}`);
// }


// //  Parse telegram message into structured object
// function parseMessage(message) {
//   const lines = message.split("\n").map(l => l.trim()).filter(Boolean);

//   const results = {};

//   const categoriesMap = {
//     "Parity": "P",
//     "Spare": "S",
//     "Bcone": "B",
//     "Emerd": "E"
//   };

//   for (let line of lines) {
//     let match = line.match(/\[(.*?)\]:\s*(.*?)\s*--\s*(\d+)rs/i);
//     if (!match) continue;

//     const catName = match[1].replace(/\s+/g, "").toLowerCase();
//     const rawColor = match[2];
//     const amount = parseInt(match[3]);

//     // Normalize category
//     let category;
//     if (catName.includes("parity")) category = "P";
//     else if (catName.includes("spare")) category = "S";
//     else if (catName.includes("bcone")) category = "B";
//     else if (catName.includes("emerd")) category = "E";

//     // Normalize color (both text and emoji)
//     let winners = {
//       green: false,
//       red: false,
//       violet: false,
//     };

//     if (/green|🟢/i.test(rawColor)) winners.green = true;
//     if (/red|🔴/i.test(rawColor)) winners.red = true;
//     if (/violet|🟣/i.test(rawColor)) winners.violet = true;

//     results[category] = {
//       category,
//       winners,
//       betAmount: amount
//     };
//   }

//   return results;
// }


//   //Save parsed message into correct file
//  function saveParsed(parsed) {
//    for (const [cat, obj] of Object.entries(parsed)) {
//      const file = FILES[cat];
//      const existing = loadCategoryData(file);

//      // Skip if period already exists
//      if (existing.find((e) => e.period === obj.period)) continue;

//      existing.push(obj);
//      saveData(file, existing);
//      console.log(`✅ Added period ${obj.period} to ${file}`);
//    }
//  }

//  (async () => {
//    console.log("Loading Telegram client...");
//    const client = new TelegramClient(stringSession, apiId, apiHash, {
//      connectionRetries: 5,
//    });

//    await client.start({
//      phoneNumber: async () =>
//        new Promise((resolve) => rl.question("Please enter your number: ", resolve)),
//      password: async () =>
//        new Promise((resolve) => rl.question("Please enter your password: ", resolve)),
//      phoneCode: async () =>
//        new Promise((resolve) => rl.question("Please enter the code you received: ", resolve)),
//      onError: (err) => console.log(err),
//    });

//    console.log("Connected ✅");
//    console.log("Session string (save this!):\n", client.session.save());

//    //https://t.me/colorwiz_ai_24hour
//    const targetChat = "@colorwiz_ai_24hour"; //  replace with your channel/group username or ID
//    const cutoffDate = new Date("2025-09-01T00:00:00Z"); //  stop at this date

//    // --- Fetch past messages ---
//    console.log("Fetching past messages...");
//    let offsetId = 0;
//    let keepFetching = true;

//    while (keepFetching) {
//      const history = await client.getMessages(targetChat, { limit: 100, offsetId });

//      if (!history.length) break;

//      for (const msg of history) {
//        if (!msg.message) continue;

//        const msgDate = new Date(msg.date * 1000);
//        if (msgDate < cutoffDate) {
//          keepFetching = false;
//          break;
//        }

//        const parsed = parseMessage(msg.message, msgDate.toISOString());
//        if (parsed) saveParsed(parsed);

//        offsetId = msg.id;
//      }
//    }

//    console.log("✅ Finished backfilling messages until given date");
//    process.exit(0); 
//  })();

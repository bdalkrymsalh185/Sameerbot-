const { Client, LocalAuth } = require('whatsapp-web.js');
const readline = require('readline');

const ChatHandler = require('./ChatHandler');
const GroupHandler = require('./GroupHandler');
const StatusHandler = require('./StatusHandler');
const srcconnection = require('./srcconnection');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const client = new Client({
    authStrategy: new LocalAuth({ clientId: "pairing-session" }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('ready', () => {
    console.log('✅ البوت جاهز ومربوط');

    ChatHandler(client);
    GroupHandler(client);
    StatusHandler(client);
    srcconnection(client);

    rl.close();
});

client.initialize();

// pairing code
(async () => {
    rl.question('9647854027871', async (number) => {
        number = number.replace(/\D/g, '');
        try {
            const code = await client.requestPairingCode(number);
            console.log(`🔢 كود الربط: ${code}`);
            console.log('واتساب > الأجهزة المرتبطة > الربط باستخدام رقم');
        } catch (err) {
            console.error('❌ فشل توليد الكود:', err.message);
        }
    });
})();

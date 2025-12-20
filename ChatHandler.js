class ChatHandler {
    constructor() {
        this.autoReplies = {
            'مرحبا': ['أهلاً وسهلاً!', 'مرحباً بك!', 'أهلين!'],
            'السلام عليكم': ['وعليكم السلام ورحمة الله وبركاته'],
            'كيف الحال': ['الحمد لله، وأنت كيفك؟', 'بخير، شكراً!'],
            'شكرا': ['العفو!', 'على الرحب والسعة!'],
            'متى': ['حالياً الساعة: {time}', 'الوقت الآن: {time}'],
            'مساعدة': [
                'أنا بوت إدارة المجموعة، يمكنني:\n' +
                '✅ منع الروابط\n' +
                '✅ الترحيب بالأعضاء الجدد\n' +
                '✅ الرد على بعض الرسائل\n' +
                '✅ مشاهدة الحالات تلقائياً'
            ]
        };
        
        this.keywords = Object.keys(this.autoReplies);
    }

    initialize(client) {
        this.client = client;
        console.log('✅ تم تفعيل نظام الردود التلقائية');
    }

    /**
     * التعامل مع الردود التلقائية
     * @param {object} message - الرسالة المستلمة
     */
    async handleAutoReply(message) {
        try {
            // تجاهل الرسائل المرسلة من البوت نفسه
            if (message.fromMe) return;
            
            const body = message.body.toLowerCase().trim();
            
            // البحث عن كلمة مفتاحية مطابقة
            for (const keyword of this.keywords) {
                if (body.includes(keyword.toLowerCase())) {
                    const replies = this.autoReplies[keyword];
                    const randomReply = replies[Math.floor(Math.random() * replies.length)];
                    
                    // استبدال المتغيرات إذا وجدت
                    let finalReply = randomReply;
                    if (finalReply.includes('{time}')) {
                        const time = new Date().toLocaleTimeString('ar-SA');
                        finalReply = finalReply.replace('{time}', time);
                    }
                    
                    // الرد على الرسالة
                    await message.reply(finalReply);
                    console.log(`🤖 رد تلقائي على: "${message.body}"`);
                    break;
                }
            }
        } catch (error) {
            console.error('❌ خطأ في الرد التلقائي:', error);
        }
    }

    /**
     * إضافة رد تلقائي جديد
     * @param {string} keyword - الكلمة المفتاحية
     * @param {string|Array} reply - الرد أو مجموعة ردود
     */
    addAutoReply(keyword, reply) {
        if (Array.isArray(reply)) {
            this.autoReplies[keyword] = reply;
        } else {
            this.autoReplies[keyword] = [reply];
        }
        this.keywords = Object.keys(this.autoReplies);
        console.log(`➕ تم إضافة رد تلقائي لـ: "${keyword}"`);
    }

    /**
     * إزالة رد تلقائي
     * @param {string} keyword - الكلمة المفتاحية
     */
    removeAutoReply(keyword) {
        if (this.autoReplies[keyword]) {
            delete this.autoReplies[keyword];
            this.keywords = Object.keys(this.autoReplies);
            console.log(`➖ تم إزالة رد تلقائي لـ: "${keyword}"`);
        }
    }
}

module.exports = new ChatHandler();
class GroupHandler {
    constructor() {
        this.forbiddenLinks = [
            'http://', 'https://', 'www.',
            '.com', '.net', '.org',
            'telegram.me', 't.me',
            'bit.ly', 'tinyurl.com',
            'youtube.com', 'youtu.be'
        ];
        
        this.welcomeMessages = [
            "🎉 أهلاً وسهلاً بك {name} في المجموعة!",
            "✨ نورت المجموعة يا {name}!",
            "👋 مرحباً {name}، نتمنى لك وقتاً ممتعاً معنا!",
            "🌹 أهلاً بك {name} في مجموعتنا الجميلة!"
        ];
        
        this.goodbyeMessages = [
            "👋 إلى اللقاء {name}، نتمنى لك التوفيق!",
            "💔 مع السلامة {name}، حظاً موفقاً!",
            "🚶‍♂️ غادر {name} المجموعة، نتمنى له كل الخير!"
        ];
    }

    initialize(client) {
        this.client = client;
        console.log('✅ تم تفعيل مدير المجموعة');
    }

    /**
     * التعامل مع منع الروابط
     * @param {object} message - الرسالة المستلمة
     */
    async handleLinkFilter(message) {
        try {
            // التحقق إذا كانت الرسالة في مجموعة
            if (!message.fromMe && message.hasMedia === false) {
                const body = message.body.toLowerCase();
                
                // التحقق إذا كانت الرسالة تحتوي على رابط
                const hasLink = this.forbiddenLinks.some(link => body.includes(link));
                
                if (hasLink) {
                    // الحصول على معلومات المرسل
                    const chat = await message.getChat();
                    const contact = await message.getContact();
                    
                    // إذا كان مشرفاً، نسمح له
                    if (chat.isGroup) {
                        const isAdmin = await this.isAdmin(chat, contact.id._serialized);
                        if (!isAdmin) {
                            // حذف الرسالة
                            await message.delete(true);
                            
                            // تحذير المرسل
                            await message.reply('⚠️ ممنوع نشر الروابط في هذه المجموعة!');
                            console.log(`❌ حذف رابط من: ${contact.name || contact.number}`);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('❌ خطأ في التعامل مع الروابط:', error);
        }
    }

    /**
     * التحقق إذا كان المستخدم مشرفاً
     * @param {object} chat - المحادثة
     * @param {string} userId - معرف المستخدم
     * @returns {boolean}
     */
    async isAdmin(chat, userId) {
        try {
            const participants = await chat.participants;
            const participant = participants.find(p => p.id._serialized === userId);
            return participant && participant.isAdmin;
        } catch (error) {
            console.error('❌ خطأ في التحقق من صلاحية المشرف:', error);
            return false;
        }
    }

    /**
     * الترحيب بالأعضاء الجدد
     * @param {object} notification - إشعار الانضمام
     */
    async handleWelcome(notification) {
        try {
            const chat = await notification.getChat();
            const contact = await notification.getContact();
            
            // اختيار رسالة ترحيب عشوائية
            const welcomeMessage = this.welcomeMessages[
                Math.floor(Math.random() * this.welcomeMessages.length)
            ].replace('{name}', contact.name || contact.number);
            
            // إرسال رسالة الترحيب
            await chat.sendMessage(welcomeMessage);
            console.log(`👋 تم الترحيب بـ: ${contact.name || contact.number}`);
            
        } catch (error) {
            console.error('❌ خطأ في الترحيب:', error);
        }
    }

    /**
     * توديع الأعضاء المغادرين
     * @param {object} notification - إشعار المغادرة
     */
    async handleGoodbye(notification) {
        try {
            const chat = await notification.getChat();
            const contact = await notification.getContact();
            
            // اختيار رسالة توديع عشوائية
            const goodbyeMessage = this.goodbyeMessages[
                Math.floor(Math.random() * this.goodbyeMessages.length)
            ].replace('{name}', contact.name || contact.number);
            
            // إرسال رسالة التوديع
            await chat.sendMessage(goodbyeMessage);
            console.log(`👋 تم توديع: ${contact.name || contact.number}`);
            
        } catch (error) {
            console.error('❌ خطأ في التوديع:', error);
        }
    }

    /**
     * قبول جميع طلبات الانضمام تلقائياً
     * ملاحظة: هذه الخاصية غير مدعومة مباشرة في API الحالي
     * يمكن تنفيذها عن طريق مراقبة الرسائل الخاصة
     */
    async autoAcceptRequests() {
        console.log('⚠️ خاصية القبول التلقائي تتطلب مراقبة الرسائل الخاصة');
    }
}

module.exports = new GroupHandler();
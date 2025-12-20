const crypto = require('crypto');

class ConnectionHandler {
    /**
     * توليد رمز مكون من 8 أرقام من QR
     * @param {string} qr - بيانات QR
     * @returns {string} - رمز مكون من 8 أرقام
     */
    generateNumericCode(qr) {
        // إنشاء hash من بيانات QR
        const hash = crypto.createHash('md5').update(qr).digest('hex');
        
        // تحويل الهاش إلى أرقام
        let numericCode = '';
        for (let i = 0; i < hash.length && numericCode.length < 8; i++) {
            if (!isNaN(hash[i])) {
                numericCode += hash[i];
            }
        }
        
        // إذا لم نحصل على 8 أرقام، نكمل بأرقام عشوائية
        while (numericCode.length < 8) {
            numericCode += Math.floor(Math.random() * 10);
        }
        
        return numericCode.substring(0, 8);
    }

    /**
     * التحقق من صحة الرمز المدخل
     * @param {string} inputCode - الرمز المدخل
     * @param {string} qr - بيانات QR الأصلية
     * @returns {boolean} - صحيح إذا كان الرمز صحيحاً
     */
    validateCode(inputCode, qr) {
        if (!inputCode || inputCode.length !== 8 || !/^\d+$/.test(inputCode)) {
            return false;
        }
        
        const generatedCode = this.generateNumericCode(qr);
        return inputCode === generatedCode;
    }

    /**
     * حفظ بيانات الجلسة
     * @param {object} session - بيانات الجلسة
     */
    saveSession(session) {
        // سيتم التعامل مع الجلسات تلقائياً بواسطة LocalAuth
        console.log('💾 حفظ بيانات الجلسة...');
    }

    /**
     * تحميل بيانات الجلسة
     * @returns {object|null} - بيانات الجلسة أو null
     */
    loadSession() {
        // سيتم التعامل مع الجلسات تلقائياً بواسطة LocalAuth
        console.log('📂 محاولة تحميل الجلسة السابقة...');
        return null;
    }
}

module.exports = new ConnectionHandler();
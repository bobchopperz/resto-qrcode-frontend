
export default class DateID {

    _date;

constructor(dateInput = new Date()) {
    this._date = new Date(dateInput);

    if (isNaN(this._date.getTime())) {
        throw new Error("Input tanggal tidak valid.");
    }
}

    format(formatString = 'd-MMM-yyyy') {
        const options = {};
        let locale = 'id-ID';

        switch (formatString) {
            case 'd-MMM-yyyy':
                options.day = 'numeric';
                options.month = 'short';
                options.year = 'numeric';
                // Intl menghasilkan "4 Okt 2025", kita ganti spasinya
                return new Intl.DateTimeFormat(locale, options).format(this._date).replace(/ /g, '-');

            case 'full':
                // Menghasilkan: "Selasa, 4 Oktober 2025"
                options.dateStyle = 'full';
                return new Intl.DateTimeFormat(locale, options).format(this._date);

            case 'short':
                // Menghasilkan: "04/10/25"
                options.dateStyle = 'short';
                return new Intl.DateTimeFormat(locale, options).format(this._date);

            default:
                // Jika format tidak dikenali, kembalikan format ISO sebagai fallback
                return this._date.toISOString();
        }
    }

    /**
     * Menambahkan sejumlah hari ke tanggal saat ini.
     * @param {number} days - Jumlah hari yang ingin ditambahkan (bisa negatif).
     * @returns {DateID} Instance DateID baru dengan tanggal yang sudah diperbarui.
     */
    addDays(days) {
        const newDate = new Date(this._date);
        newDate.setDate(newDate.getDate() + days);
        return new DateID(newDate);
    }

    /**
     * Mendapatkan nama hari dalam Bahasa Indonesia.
     * @example "Senin", "Selasa"
     * @type {string}
     */
    get dayName() {
        return new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(this._date);
    }

    /**
     * Mendapatkan nama bulan dalam Bahasa Indonesia.
     * @example "Januari", "Februari"
     * @type {string}
     */
    get monthName() {
        return new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(this._date);
    }

    /**
     * Mendapatkan objek Date asli.
     * @type {Date}
     */
    get nativeDate() {
        return this._date;
    }

    /**
     * Membuat instance DateID baru dengan tanggal saat ini.
     * @returns {DateID}
     */
    static now() {
        return new DateID();
    }
}
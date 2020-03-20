const ETCD_URLS = process.env.ETCD_URLS;
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
let LANGUAGE = process.env.LANGUAGE;

/***
 * Load all envs and structure them correctly
 * @returns {{ETCD_URLS: string[]}}
 */
function loadEnvs() {
    if (!ETCD_URLS) {
        throw "ETCD_URLS cannot be null or empty";
    }

    if (!TELEGRAM_TOKEN) {
        throw "TELEGRAM_TOKEN cannot be null or empty";
    }

    if (!LANGUAGE) {
        LANGUAGE = 'en'
    }

    return {
        'ETCD_URLS': ETCD_URLS.split(","),
        'TELEGRAM_TOKEN': TELEGRAM_TOKEN,
        'LANGUAGE': LANGUAGE
    };
};


module.exports = loadEnvs();


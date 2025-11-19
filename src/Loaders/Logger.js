const chalk = require("chalk");
const dayjs = require("dayjs");

// Format général
const FORMAT = "{timestamp} {tag} {text}\n";

// Table des couleurs (propre, extensible)
const TAG_STYLES = {
    ERROR: chalk.red.dim,
    WARN: chalk.yellow.dim,
    TYPO: chalk.cyan.dim,
    CMD: chalk.magenta.dim,
    EVT: chalk.green.dim,
    CLIENT: chalk.blue.dim,
    BUTTON: chalk.hex("#ff8800").dim,
    SELECT: chalk.hex("#00b7ff").dim,
};

// ———————————————————————————————————————
// Fonctions publiques
// ———————————————————————————————————————

module.exports = {
    error: (msg) => log("ERROR", msg, true),
    warn: (msg) => log("WARN", msg),
    typo: (msg) => log("TYPO", msg),
    command: (msg) => log("CMD", msg),
    event: (msg) => log("EVT", msg),
    client: (msg) => log("CLIENT", msg),
    button: (msg) => log("BUTTON", msg),
    select: (msg) => log("SELECT", msg),
};

// ———————————————————————————————————————
// Fonction interne centralisée
// ———————————————————————————————————————

function log(tag, content, isErrorStream = false) {
    const timestamp = chalk.gray(`[${dayjs().format("DD/MM - HH:mm:ss")}]`);
    const style = TAG_STYLES[tag] || chalk.white.bold; // fallback en cas d'erreur
    const tagStyled = style(`[${tag}]`);
    const text = chalk.white(content);

    const output = FORMAT
        .replace("{timestamp}", timestamp)
        .replace("{tag}", tagStyled)
        .replace("{text}", text);

    const stream = isErrorStream ? process.stderr : process.stdout;
    stream.write(output);
}

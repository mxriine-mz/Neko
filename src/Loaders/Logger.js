const chalk = require('chalk');
const dayjs = require('dayjs');

const format = '{tstamp} {tag} {txt}\n';

function error(content) {
    write(content, 'red', 'dim', 'ERROR', true);
}

function warn(content) {
    write(content, 'yellow', 'dim', 'WARN', false);
}

function typo(content) {
    write(content, 'cyan', 'dim', 'TYPO', false);
}

function command(content) {
    write(content, 'magenta', 'dim', 'CMD', false);
}

function event(content) {
    write(content, 'green', 'dim', 'EVT', true);
}

function client(content) {
    write(content, 'blue', 'dim', 'CLIENT', false);
}

function write(content , tagColor, bgTagColor, tag, error = false) {
    const timestamp = `[${dayjs().format('DD/MM - HH:mm:ss')}]`;
    const logTag = `[${tag}]`;
    const stream = error ? process.stderr : process.stdout;
    // stderr = console.error

    const item = format
        .replace('{tstamp}', chalk.gray(timestamp))
        .replace('{tag}', chalk[bgTagColor][tagColor](logTag))
        .replace('{txt}', chalk.white(content));

    stream.write(item);
}

module.exports = { error, warn, command, event, typo, client };
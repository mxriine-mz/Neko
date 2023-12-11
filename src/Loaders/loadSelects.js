const { promisify } = require('util');
const { glob } = require('glob');
const Logger = require('./Logger');

const pGlob = promisify(glob);

module.exports = async (client) => {
    (await pGlob(`${process.cwd()}/src/Selects/*/*.js`)).map(async (selectMenuFile) => {
        const selectMenu = require(selectMenuFile);
        
        if (!selectMenu.name) {
            return Logger.warn(`Select menu non-déclenchée: ajouter un nom à votre menu ↓\n Fichier -> ${selectMenuFile}`);
        }

        client.selects.set(selectMenu.name, selectMenu);

    });
};
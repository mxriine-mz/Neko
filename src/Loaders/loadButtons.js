const { promisify } = require('util');
const { glob } = require('glob');
const Logger = require('./Logger');

const pGlob = promisify(glob);

module.exports = async (client) => {
    (await pGlob(`${process.cwd()}/src/Buttons/*/*.js`)).map(async (btnFile) => {
        const btn = require(btnFile);
        
        if (!btn.name) {
            return Logger.warn(`Bouton non-déclenchée: ajouter un nom à votre button ↓\n Fichier -> ${btnFile}`);
        }

        client.buttons.set(btn.name, btn);

    });
};
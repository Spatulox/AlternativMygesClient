// import { dirname } from 'path';
// import path from 'path';
// import fs from 'fs';

export function log(str) {
    const { dirname } = require('path');
    const path = require('path');
    const fs = require('fs');

    //console.log(__filename); // Remplace import.meta.url par __filename
    const __dirname = dirname(__filename);
    //console.log(__dirname);

    const logDir = path.join(__dirname.split('/src')[0], 'log'); // Utilisation de / au lieu de \\ pour la compatibilité multiplateforme
    const filePath = path.join(logDir, 'log.txt');

    //console.log(filePath);

    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true }); // Utilisation de fs.mkdirSync avec l'option recursive
    }

    var today = new Date();
    let previousStr = `[${today.toLocaleDateString()} - ${today.toLocaleTimeString()}] `;

    console.log(previousStr + str);
    fs.appendFileSync(filePath, previousStr + str + '\n');
}


export function readJsonFile(fileName){
    const fs = require('fs');

    try {
        const data = fs.readFileSync(fileName, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // console.error('Erreur de lecture du fichier JSON:', error);
        log(`ERROR : Reading Json file ${fileName}, ${error}`)
        return 'Error';
        //return false;
    }
}

export function writeJsonFile(directoryPath, name, array, optionnalSentence = ""){
    const fs = require('fs');
    const path = require('path');

    const directories = directoryPath.split(path.sep);
    let currentPath = '';
    const json = JSON.stringify(array, null, 2)

    directories.forEach((directory) => {
        currentPath = path.join(currentPath, directory);
        if (!fs.existsSync(currentPath)) {
            fs.mkdirSync(currentPath);
        }
    });

    if (name.includes('.json')){
        name = name.split('.json')[0]
    }


    fs.writeFile(`${directoryPath}/${name}.json`, json, (err) => {
        if (err) {
            console.error(err);
            log(`ERROR : error while writing file ${directoryPath}/${name}.json, ${err}`)
            return 'Error';
        }
        // console.log('Data written to file');
        log(`Data written ${optionnalSentence} to ${directoryPath}/${name}.json`)
        return 'ok'
        //return true
    });
}



export function replaceValueJsonFile(fileName, keyOfValue, valueToReplace) {
    const fs = require('fs');
    // write the JSON files
    fs.readFile(fileName, 'utf8', (err, data) => {
        if (err) {
        log('ERROR : Erreur de lecture du fichier JSON :'+err);
        return 'Error';
        }
        //Analyser le contenu JSON en un objet JavaScript
        const file = JSON.parse(data);
        // log(file)

        // Ajouter une valeur au tableau
        // Concatenate the two values

        if(file[keyOfValue]){
            file[keyOfValue] = valueToReplace
        }
        else{
            log('ERROR : Impossible to replace the old value by the new value, the keyOfValue doesn\'t exist')
        }

        // Convertir l'objet JavaScript en une chaîne JSON
        const updatedData = JSON.stringify(file, Object.keys(file).sort(), 2);

        // Écrire les modifications dans le fichier JSON
        fs.writeFile(fileName, updatedData, 'utf8', (err) => {
        if (err) {
            log('ERROR : Erreur d\'écriture dans le fichier JSON : '+err);
            return;
        }

        log(`Value replaced by '${valueToReplace}' for '${keyOfValue}' in '${fileName}'.`);
        })
    })
}
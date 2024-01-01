/*
* Author : Spatulox
* Date : 01/01/2024
*
* Desc : Globals function foir the chil process (the other are not compatible because yerk software)
* Because of the differents imports
*
*/

import { log } from './globalFunction.js';

export async function readJsonFile(fileName){
    const fs = await import('fs');
    try {
        const data = fs.readFileSync(fileName, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // console.error('Erreur de lecture du fichier JSON:', error);
        log(`ERROR : Reading Json file ${fileName}, ${error}`)
        //return 'Error';
        return false;
    }
}

export function writeJsonFile(directoryPath, name, array, optionnalSentence = ""){
    const path = require('path');
    const fs = require('fs');

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

    fs.writeFileSync(`${directoryPath}/${name}.json`, json, (err) => {
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

export function getYear() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    return currentYear;
}

export function getWeekMonday(){
    var today = new Date();
    today.setHours(0, 0, 0)
    var dayOfWeek = today.getDay();
    // var daysUntilMonday = dayOfWeek === 0 ? 6 : 1 - dayOfWeek;
    var daysUntilMonday = 1 - ((dayOfWeek + 6) % 7);
    var monday = new Date(today.getTime() + daysUntilMonday * 24 * 60 * 60 * 1000);
    return monday
  }
  
  // ------------------------------------------------------------------
  
  // "New function", need to test it if we are not sunday (day 0)
  export function getWeekSaturday() {
    var today = new Date();
    today.setHours(0, 0, 0)
    var dayOfWeek = today.getDay();
    // var daysUntilSaturday = 6 - dayOfWeek;
    var daysUntilSaturday = 6 - ((dayOfWeek + 6) % 7);
    var saturday = new Date(today.getTime() + daysUntilSaturday * 24 * 60 * 60 * 1000);
    return saturday;
  }
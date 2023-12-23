import { dirname } from 'path';
import path from 'path';
import fs from 'fs';

export function log(str) {
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

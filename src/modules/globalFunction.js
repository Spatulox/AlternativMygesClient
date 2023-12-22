import { fileURLToPath } from 'url';
import path from 'path'
import fs from 'fs'

// ------------------------------------------------------------------

export function log(str) {
  // Determinate the path of the globalFunct.js file
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Determinate the path of the log folder and file
  const logDir = path.join(__dirname.split('\\src')[0], 'log');
  const filePath = path.join(logDir, 'log.txt');

  if (fs.existsSync(logDir) == false) {
    fs.mkdirSync(logDir);
  }

  var today = new Date();
  let previousStr = `[${today.toLocaleDateString()} - ${today.toLocaleTimeString()}] `

  console.log(previousStr+str)
  fs.appendFileSync(filePath, previousStr+str+'\n');
}



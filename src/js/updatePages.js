/*
* Author : Spatulox
* Date : 11/11/2023
*
* Desc : Function which call all the process to update datas
*
*/

import { log } from "../modules/globalFunction.js";
import { dashboard } from "./dashboard.js";
import { schedule } from "./schedule.js";
import { grades } from "./grades.js";


// Execute the function correspondig with the name
export function updatePages(pages){
    const regex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
    try{
        if (regex.test(pages) && pages !="softwareAccount" && pages !="credits") {
            eval(pages + '()');
        }
    }
    catch(err){
        log(`Can't execute ${pages}() function, name is not valid : ${err}`);
    }
}
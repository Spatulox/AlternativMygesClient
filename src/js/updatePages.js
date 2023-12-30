import { log } from "../modules/globalFunction.js";

import { dashboard } from "./dashboard.js";
import { schedule } from "./schedule.js";


// Execute the function correspondig with the name
export function updatePages(pages){
    const regex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
    //try{
        if (regex.test(pages) && pages !="softwareAccount" && pages !="credits") {
            eval(pages + '()');
        }
    // }
    // catch{
    //     log(`Can't execute ${pages}() function, name is not valid`);
    // }
}
/*
* Author : Spatulox
* Date : 01/01/2024
*
* Desc : The child process to retrieve the Schedule to the myGes API
*
*/

import { loginUser } from "./overlayMyGES.js"
import { readJsonFile, getWeekMonday, getWeekSaturday } from "./childProcessGlobalFunctions.js"
import { getYear } from "./globalFunction.js"

async function Agenda(user, startD, endD){
	process.send('Request myGes Agenda')

    if(startD == null || endD == null){
        process.send('Specifie a start and an end date')
        process.send(false)
        return false
    }

	// Agenda have a lot unsorted objects inside
	let agenda = await user.getAgenda(startD, endD)

	if (agenda.length == 0){
		let start
		let end
		try{
			start = startD.toLocaleDateString()
			end = endD.toLocaleDateString()
		}
		catch{
			start = startD
			end = endD
		}
        process.send(`No agenda for this week : ${start}, ${end}`)
        process.send(false)
		//return `No agenda for this week : ${start}, ${end}`
        return false
	}
	

	process.send('Creating Agenda array')
	// Create an array to store objects by date, then by time
	let dict = []
	let addData = 0
	for (let i = 0; i < agenda.length; i++) {
		// Create readable date and time
		let date = new Date(agenda[i].start_date).toLocaleDateString();
		let time = new Date(agenda[i].start_date).toLocaleTimeString();

		if (!dict.hasOwnProperty(date)) {
			dict[date] = [];
		}
		if (!dict[date].hasOwnProperty(time)) {
			dict[date][time] = agenda[i];
		}
		else{
			dict[date][time][`anormal_additional_data_${addData}`] = agenda[i];
			addData++
		}
    }

    // Sort the dict from the "lowest" date to the "uppest" date and by time
    // Idk how it works btw
	const sortedData = Object.entries(dict).sort((a, b) => {
		const dateA = new Date(a[0].split('/').reverse().join('-'));
		const dateB = new Date(b[0].split('/').reverse().join('-'));
		return dateA - dateB;
	  }).map(([date, cours]) => {
		const sortedCours = Object.entries(cours).sort(([heureA], [heureB]) => {
		  const timeA = new Date(`1970-01-01T${heureA}`);
		  const timeB = new Date(`1970-01-01T${heureB}`);
		  return timeA - timeB;
		}).reduce((acc, [heure, cours]) => {
		  acc[heure] = cours;
		  return acc;
		}, {});
		return [date, sortedCours];
	  });
	  

	agenda = sortedData

	// Recover things (in object in an array of array)
	// Never change the "1"	
	// agenda[i][0] is always the date
	// agenda[i][1] is always an object named with the time
    let year = getYear()
	process.send(`Preparing ${year}_agenda.json`)
	let agendaToWrite = {}
	for (var i = 0; i < agenda.length; i++) {
		
		let cours = []

		// Retrieve infos and store it in variable
		for (const obj in agenda[i][1]){
			let type = agenda[i][1][obj].type
			let modality = agenda[i][1][obj].modality
			let nameCours = agenda[i][1][obj].name
			let teacher = agenda[i][1][obj].teacher
			let student_group_name = agenda[i][1][obj].discipline.student_group_name
			
			let room
			let campus
			// Some course don't have any room or campus like OPEN point
			try{
				room = agenda[i][1][obj].rooms[0].name
				campus = agenda[i][1][obj].rooms[0].campus
				//process.send(agenda[i][0] + " / "+ room+ " / " + campus)
			}
			catch{
				room = "N/A"
				campus = "N/A"
				//process.send('N/A for '+agenda[i][0])
			}

			let tmp = {
				"time":obj,
				"content":{
					"time":obj,
					"type": type,
					"modality": modality,
					"name": nameCours,
					"teacher": teacher,
					"student_group_name": student_group_name,
					"room": room,
					"campus": campus
				}
			}
			cours.push(tmp)
		}
		
		agendaToWrite[agenda[i][0]] = {cours}
	}

	agenda = agendaToWrite
	
	//Return the agenda via process.send()
    process.send(agenda)
    process.send('Fetching Schedule finished')
    process.send(false)
	//return agenda
    return false

}

async function retrieveScheduleFromMyGES(){
    let tmp = await readJsonFile('./src/data/infos.json')

    const username = tmp.login
    const password = tmp.password
    const user = await loginUser(username, password)
    let userTmp = user+""
    if(userTmp.includes('Bad password')){
        process.send('Error when connecting to you account, Bad password ?');
        process.send(false);
        return false
    }

    await new Promise(resolve => {
        setTimeout(resolve, 2000);
      });


    var today = new Date();
    let monday = new Date(getWeekMonday())
    let saturday = new Date(getWeekSaturday())

    // If I set 0 to hours, saturday it set to saturday 22h :/
    saturday.setUTCHours(0, 0, 0, 0);

    if (today >= saturday){
        process.send(`It's the weekend today, requesting next week schedule (print it, if it's sunday)`)

        monday.setUTCHours(0,0,0,0)
        monday.setDate(monday.getDate() + 7);
        monday.setUTCHours(0,0,0,0)

        // console.log(saturday)
        saturday.setDate(saturday.getDate() + 7);

    }

    // For test
    // monday.setUTCHours(0,0,0,0)
    // monday.setDate(monday.getDate() + 7);
    // monday.setUTCHours(0,0,0,0)

    // // console.log(saturday)
    // saturday.setDate(saturday.getDate() + 7);

    let agenda = Agenda(user, monday, saturday)
    if(!agenda){
        process.send(agenda)
    }


}

await retrieveScheduleFromMyGES()
//process.send(true);
const dns = require('dns');
const { net } = require('electron');

export async function checkInternetCo() {
  const { log } = await import('./globalFunction.js')

  let internetCo = false;

  while (!internetCo) {
    try {
      await new Promise((resolve) => {
        dns.lookup('google.com', (err) => {
          if (err) {
            log('No internet connection, waiting 1 minute.');
            setTimeout(resolve, 60000);
          } else {
            log('Internet connection is available.');
            internetCo = true;
            resolve();
          }
        });
      });
    } catch (error) {
      log('ERROR when awaiting the promise to await 1 minute');
    }
  }
}

/**/
export async function checkXTimesInternetConnection(xTime = 10) {
  // Don't touch ! NO if you add the log function, it gonna crash for unknown reason T_T
  //const { log } = await import('./globalFunction.cjs')
  let count = 0;

  while (count < xTime) {

    let isConnected = await new Promise((resolve) => {
      dns.lookup('google.com', (err) => {
        if (err) {
          resolve(false); // Pas de connexion Internet
        } else {
          resolve(true); // Connexion Internet disponible
        }
      });
    });

    if (isConnected){
      return true
    }
    else {
      count ++
      if(xTime == 1){
        return false
      }
      // Don't touch !
      console.log('No internet connection, waiting 1 minute.');
      try{
        await new Promise((resolve) => setTimeout(resolve, 60000));
      }
      catch{
        // Don't touch !
        console.log('ERROR when awaiting the promise to await 1 minutes')
      }
    }
  }
}
/**/

// export async function checkXTimesInternetConnection(xTime = 10) {
//   let count = 0;

//   while (count < xTime) {
//     try {
//       const request = net.request('https://www.google.com');
//       request.on('response', () => {
//         log('Internet connection is available.');
//         // Mettre en œuvre la logique supplémentaire ici
//       });
//       request.on('error', () => {
//         count++;
//         log('No internet connection, waiting 1 minute.');
//         if (count >= xTime) {
//           // Mettre en œuvre la logique supplémentaire ici
//         } else {
//           setTimeout(() => {
//             request.end();
//           }, 60000);
//         }
//       });
//       request.end();
//     } catch (error) {
//       log('ERROR when awaiting the promise to await 1 minute');
//       // Gérer l'erreur
//     }
//   }
// }
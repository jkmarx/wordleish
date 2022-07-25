// https://github.com/TryGhost/node-sqlite3
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message)
    throw err
  }else{
    console.log('Connected to the SQLite database.')
    db.run(`CREATE TABLE wordList (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            date_last_used text 
            )`,
      (err) => {
        if (err) {
          // Table already created
        }else{
          // Table just created, creating some rows
          seedDatabase();
        }
      });
  }
});

function seedDatabase () {
  // parse file list
  fs.readFile('wordList.txt', function(err, data) {
    if(err) throw err;
    const wordArr = data.toString().split("\n");
    const currentDate = new Date();
    for(let i=0; i<wordArr.length; i+=1) {
      const insert = 'INSERT INTO wordList (name) VALUES (?)';
      db.run(insert, [wordArr[i]]);
    }
  })
}

module.exports = db

const express = require('express');
const path = require('path');
const fs = require('fs');
const db_notes = require('./db/db.json');
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// GET /notes - Should return the notes.html file.
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './db/db.json'));
});


// GET * - Should return the index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});



// GET /api/notes - Should read the db.json file and return all saved notes as JSON.
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) throw err;
            res.json(JSON.parse(data));
    });
});


// POST /api/notes - Should receive a new note to save on the request body, add it to the db.json file,
// and then return the new note to the client.
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = Math.floor(Math.random() * 1000000000);
    db_notes.push(newNote);
    fs.writeFile('./db/db.json', JSON.stringify(db_notes), (err) => {
        if (err) {
            console.log(err);
        } else {
            res.json(db_notes);
        }
    });
});


// DELETE /api/notes/:id - Should receive a query parameter containing the id of a note to delete.
// This means you'll need to find a way to give each note a unique id when it's saved.
// In order to delete a note, you'll need to read all notes from the db.json file,
// remove the note with the given id property, and then rewrite the notes to the db.json file.
app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    const noteIndex = db_notes.findIndex(note => note.id === id);
    db_notes.splice(noteIndex, 1);
    fs.writeFile('./db/db.json', JSON.stringify(db_notes), (err) => {
        if (err) {
            console.log(err);
        } else {
            res.json(db_notes);
        }
    });
});



// Listener
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});




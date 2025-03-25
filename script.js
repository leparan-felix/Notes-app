document.getElementById('create-note-btn');
addEventListener('click', function () {
    const title = prompt("Enter note title:");
    const description = prompt("Enter note description:");

    if (title && description) {
        const note = {
            title: title,
            description: description
        };

        
        fetch("http://localhost:3000/notes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(note)
        })
        .then(response => response.json())
        .then(newNote => {
            renderNote(newNote);
        });
    } else {
        alert("enter both title and description.");
    }
});


fetch("http://localhost:3000/notes")
    .then(response => response.json())
    .then(notes => {
        notes.forEach(note => renderNote(note));
    });


function renderNote(note) {
    const noteDiv = document.createElement('div');
    noteDiv.classList.add('note');
    noteDiv.setAttribute('data-id', note.id); //

    noteDiv.innerHTML = `
        <h2 class="title">${note.title}</h2>
        <h3 class="description">${note.description}</h3>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
    `;

    document.getElementById('notes-container');
    // appendChild(noteDiv);

    
    noteDiv.querySelector('.edit-btn').addEventListener('click', () => editNote(noteDiv, note.id));
    noteDiv.querySelector('.delete-btn').addEventListener('click', () => deleteNote(noteDiv, note.id));
}

//
function editNote(noteDiv, noteId) {
    const newTitle = prompt("Edit title:", noteDiv.querySelector('.title').innerText);
    const newDescription = prompt("Edit description:", noteDiv.querySelector('.description').innerText);

    if (newTitle && newDescription) {
        fetch(`http://localhost:3000/notes/${noteId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title: newTitle, description: newDescription })
        })
        .then(response => response.json())
        .then(updatedNote => {
            noteDiv.querySelector('.title').innerText = updatedNote.title;
            noteDiv.querySelector('.description').innerText = updatedNote.description;
        });
    }
}


function deleteNote(noteDiv, noteId) {
    fetch(`http://localhost:3000/notes/${noteId}`, {
        method: "DELETE"
    })
    .then(() => {
        noteDiv.remove();
    });
}

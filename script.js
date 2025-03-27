document.getElementById('create-note-btn')
    .addEventListener('click', function () {
        const title = prompt("Enter note title:");
        const description = prompt("Enter note description:");

        if (title && description) {
            const note = { title, description };

            fetch("https://note-app-ecru-xi.vercel.app/notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(note)
            })
            .then(response => response.json())
            .then(newNote => {
                console.log("Note added:", newNote);
                renderNote(newNote);
            })
            .catch(error => console.error("Error adding note:", error));
        } else {
            alert("Enter title and description.");
        }
    });


fetch("https://note-app-ecru-xi.vercel.app/notes")
    .then(response => response.json())
    .then(notes => {
        console.log("Fetched notes:", notes);
        if (Array.isArray(notes)) {
            notes.forEach(renderNote);
        } else {
            console.error("Expected an array but got:", notes);
        }
    })
    .catch(error => console.error("Error fetching notes:", error));

function renderNote(note) {
    const notesContainer = document.getElementById('notes-container');
    if (!notesContainer) {
        console.error("Error: 'notes-container' not found.");
        return;
    }

    
    const noteDiv = document.createElement('div');
    noteDiv.classList.add('note');
    noteDiv.setAttribute('data-id', note.id);

    noteDiv.innerHTML = `
        <h2 class="title">${note.title}</h2>
        <h3 class="description">${note.description}</h3>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
    `;

    
    notesContainer.appendChild(noteDiv);

    
    noteDiv.querySelector('.edit-btn').
    addEventListener('click', () => 
        editNote(noteDiv, note.id));
    noteDiv.querySelector('.delete-btn').addEventListener('click', () => deleteNote(noteDiv, note.id));
}

function editNote(noteDiv, noteId) {
    const newTitle = prompt("Edit title:", noteDiv.querySelector('.title').innerText);
    const newDescription = prompt("Edit description:", noteDiv.querySelector('.description').innerText);

    if (newTitle && newDescription) {
        fetch(`https://note-app-ecru-xi.vercel.app/notes/${noteId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: newTitle, description: newDescription })
        })
        .then(response => response.json())
        .then(updatedNote => {
            noteDiv.querySelector('.title').innerText = updatedNote.title;
            noteDiv.querySelector('.description').innerText = updatedNote.description;
        })
        .catch(error => console.error("Error updating note:", error));
    }
}

function deleteNote(noteDiv, noteId) {
    fetch(`https://note-app-ecru-xi.vercel.app/notes/${noteId}`, {
        method: "DELETE"
    })
    .then(() => noteDiv.remove())
    .catch(error => console.error("Error deleting note:", error));
}

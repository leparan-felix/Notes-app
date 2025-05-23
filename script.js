document.addEventListener("DOMContentLoaded", () => {
    const notesContainer = document.getElementById("notes-container");
    const createNoteBtn = document.getElementById("create-note-btn");

  
    fetchNotes();

   
    function fetchNotes() {
        fetch("https://note-app-ecru-xi.vercel.app/notes")
            .then(response => response.json())
            .then(notes => {
                console.log("Fetched notes:", notes);
                if (Array.isArray(notes)) {
                   
                    notes.sort((a, b) => b.id - a.id);

                    
                    notesContainer.innerHTML = "";

                    
                    notes.forEach(renderNote);
                } else {
                    console.error("Expected an array but got:", notes);
                }
            })
            .catch(error => console.error("Error fetching notes:", error));
    }

    
    createNoteBtn.addEventListener("click", () => {
        const title = prompt("Enter note title:");
        const description = prompt("Enter note description:");
    
        if (title && description) {
            const note = { title, description };
    
          
            const tempNoteId = Date.now(); 
            renderNote({ id: tempNoteId, title, description });
    
            fetch("https://note-app-ecru-xi.vercel.app/notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(note)
            })
            .then(response => response.json())
            .then(newNote => {
                console.log("Note added:", newNote);
    
               
                const tempNote = document.querySelector(`[data-id="${tempNoteId}"]`);
                if (tempNote) {
                    tempNote.setAttribute("data-id", newNote.id); 
                }
            })
            .catch(error => {
                console.error("Error adding note:", error);
              
            });
        } else {
            alert("Enter title and description.");
        }
    });
    


   
    function renderNote(note) {
        if (!notesContainer) {
            console.error("Error: 'notes-container' not found.");
            return;
        }
    
        const noteDiv = document.createElement("div");
        noteDiv.classList.add("note");
        noteDiv.setAttribute("data-id", note.id);
    
        noteDiv.innerHTML = `
            <h2 class="title">${note.title}</h2>
            <h3 class="description">${note.description}</h3>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;
    
        
        notesContainer.prepend(noteDiv);
    
        
        noteDiv.querySelector('.edit-btn').addEventListener('click', () => editNote(noteDiv, note.id));
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
        .then(() => {
            noteDiv.remove();
            console.log(`Note ${noteId} deleted.`);
        })
        .catch(error => console.error("Error deleting note:", error));
    }
});

document.getElementById('create-note-btn');
addEventListener('click', function() {
   
    const noteDiv = document.createElement('div');
    noteDiv.classList.add('note');

  
    const title = prompt("Enter note title:");
    const description = prompt("Enter note description:");

    
    if (title && description) {
        noteDiv.innerHTML = `<h2 class="title">${title}</h2>
                             <h3 class="description">${description}</h3>`;
        
       
        const notesContainer = document.getElementById('notes-container');
        
        
        document.body.appendChild(noteDiv); 
    } else {
        alert(" create a note.");
    }
});
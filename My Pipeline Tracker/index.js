// Selectors 
const mainForm = document.querySelector("#main-form");
const leadContainer = document.querySelector("#lead-container");
let listItems = [];

// Functions
function handleFormSubmit(e){
    e.preventDefault();
    console.log(e);
    const title = DOMPurify.sanitize(mainForm.querySelector('#lead-title').value);
    const name = DOMPurify.sanitize(mainForm.querySelector('#name').value);
    const phone = DOMPurify.sanitize(mainForm.querySelector('#phone').value);
    const email = DOMPurify.sanitize(mainForm.querySelector('#email').value);
    const leadStatus = DOMPurify.sanitize(mainForm.querySelector('#lead-status').value);
    const notes = DOMPurify.sanitize(mainForm.querySelector('#lead-notes').value);
    const newLead = {
        title, 
        name,
        phone,
        email,
        leadStatus,
        notes,
        id: Date.now(),
    }
    listItems.push(newLead);
    e.target.reset();
    leadContainer.dispatchEvent(new CustomEvent('refreshLeads'));
}

function displayPipeline(){
    const tempString = listItems.map(item => `
    <div class="col">
        <div class="card mb-4 rounded-4 shadow-sm border-primary">
            <div class="card-header" py-3 text-white bg-primary border-primary">
            <h4 class="my-0">${item.title}</h4>
            </div>
            <div class="card-body">
                <ul class="text-start">
                    <li><strong>Contact Name: </strong>${item.name}</li>
                    <li><strong>Phone Number: </strong>${item.phone}</li>
                    <li><strong>Email Address: </strong>${item.email}</li>
                    <li><strong>Lead Status: </strong>${item.leadStatus}</li>
                    ${!item.notes.length ? "" : `<li><strong>Notes: </strong>${item.notes}</li>`}
                </ul>
                <button class="btn btn-lg btn-outline-danger" aria-label='Delete ${item.name}' value="${item.id}">Delete Lead</button>
            </div>
        </div>
    </div>
    `).join("");
    leadContainer.innerHTML = tempString;
console.log(tempString);
}

function mirrorStateToLocalStorage(){
    localStorage.setItem('leadContainer.list', JSON.stringify(listItems));
}

function loadinitialUI() { 
    const tempLocalStorage = localStorage.getItem('leadContainer.list');
    if(tempLocalStorage === null || tempLocalStorage === []) return; 
    const tempLeads = JSON.parse(tempLocalStorage);
    listItems.push(... tempLeads);
    leadContainer.dispatchEvent(new CustomEvent('refreshLeads'));
}

function deleteLeadFromList(id){
    console.log(id);
    listItems = listItems.filter(item => item.id!== id);
    leadContainer.dispatchEvent(new CustomEvent('refreshLeads'));
}

// Listeners
mainForm.addEventListener('submit', handleFormSubmit); 
leadContainer.addEventListener('refreshLeads', displayPipeline);
leadContainer.addEventListener('refreshLeads', mirrorStateToLocalStorage);
window.addEventListener('DOMContentLoaded', loadinitialUI);
leadContainer.addEventListener('click', (e) => {
    if(e.target.matches('.btn-outline-danger')){ 
        deleteLeadFromList(Number(e.target.value));
    };
})
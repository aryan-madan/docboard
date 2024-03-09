// Array to store appointments
let appointments = [];

// Function to load appointments from localStorage
function loadAppointments() {
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
        appointments = JSON.parse(savedAppointments);
        renderAppointments();
    }
}

// Function to save appointments to localStorage
function saveAppointments() {
    localStorage.setItem('appointments', JSON.stringify(appointments));
}

// Function to add a new appointment
function addAppointment(patientName, appointmentDate, appointmentTime) {
    const appointment = {
        patientName,
        appointmentDate,
        appointmentTime,
        expired: false // Initialize as not expired
    };
    appointments.push(appointment);
    saveAppointments();
    renderAppointments();
}

// Function to check if an appointment is expired
function isAppointmentExpired(appointment) {
    const currentDate = new Date();
    const appointmentDate = new Date(`${appointment.appointmentDate} ${appointment.appointmentTime}`);
    return appointmentDate < currentDate;
}

// Function to render appointments in the UI
function renderAppointments(searchTerm = '') {
    const appointmentsList = document.getElementById('appointments-list');
    appointmentsList.innerHTML = '';

    appointments.forEach((appointment, index) => {
        if (!appointment.expired) {
            // Render only active appointments
            const appointmentElement = createAppointmentElement(appointment, index);
            appointmentsList.appendChild(appointmentElement);
        }
    });

    renderExpiredAppointments();
}

// Function to render expired appointments in the UI
function renderExpiredAppointments(searchTerm = '') {
    const expiredAppointmentsList = document.getElementById('expired-appointments-list');
    expiredAppointmentsList.innerHTML = '';

    appointments.forEach((appointment, index) => {
        if (appointment.expired) {
            // Render only expired appointments
            const appointmentElement = createAppointmentElement(appointment, index);
            appointmentElement.classList.add('expired-appointment');
            expiredAppointmentsList.appendChild(appointmentElement);
        }
    });
}

// Function to create an appointment HTML element
function createAppointmentElement(appointment, index) {
    const appointmentElement = document.createElement('div');
    appointmentElement.classList.add('appointment');

    const appointmentInfo = document.createElement('div');
    appointmentInfo.classList.add('appointment-info');

    const patientName = document.createElement('p');
    patientName.textContent = `Patient: ${appointment.patientName}`;

    const appointmentDate = document.createElement('p');
    appointmentDate.textContent = `Date: ${appointment.appointmentDate}`;

    const appointmentTime = document.createElement('p');
    appointmentTime.classList.add('appointment-time');
    appointmentTime.textContent = `Time: ${appointment.appointmentTime}`;

    appointmentInfo.appendChild(patientName);
    appointmentInfo.appendChild(appointmentDate);
    appointmentInfo.appendChild(appointmentTime);

    // Create the delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteAppointment(index));

    appointmentElement.appendChild(appointmentInfo);

    // If the appointment is not expired, add the edit button
    if (!appointment.expired) {
        const editBtn = document.createElement('button');
        editBtn.classList.add('edit-btn');
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => editAppointment(index));
        appointmentElement.appendChild(editBtn);
    }

    appointmentElement.appendChild(deleteBtn);

    return appointmentElement;
}


// Function to edit an appointment
function editAppointment(index) {
    const appointment = appointments[index];
    const patientName = prompt('Enter Patient Name:', appointment.patientName);
    const appointmentDate = prompt('Enter Appointment Date (YYYY-MM-DD):', appointment.appointmentDate);
    const appointmentTime = prompt('Enter Appointment Time (HH:MM):', appointment.appointmentTime);

    if (patientName && appointmentDate && appointmentTime) {
        appointment.patientName = patientName;
        appointment.appointmentDate = appointmentDate;
        appointment.appointmentTime = appointmentTime;
        saveAppointments();
        renderAppointments();
    }
}

// Function to delete an appointment
function deleteAppointment(index) {
    if (confirm('Are you sure you want to delete this appointment?')) {
        appointments.splice(index, 1);
        saveAppointments();
        renderAppointments();
    }
}

// Function to sort appointments by time
function sortAppointmentsByTime(order) {
    appointments.sort((a, b) => {
        const timeA = new Date(`1970/01/01 ${a.appointmentTime}`).getTime();
        const timeB = new Date(`1970/01/01 ${b.appointmentTime}`).getTime();
        return order === 'asc' ? timeA - timeB : timeB - timeA;
    });
    renderAppointments();
}

// Event listener for form submission
const scheduleForm = document.querySelector('form');
scheduleForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const patientName = document.getElementById('patient-name').value;
    const appointmentDate = document.getElementById('appointment-date').value;
    const appointmentTime = document.getElementById('appointment-time').value;
    addAppointment(patientName, appointmentDate, appointmentTime);
    scheduleForm.reset();
});

// Event listeners for sorting buttons
const sortAscBtn = document.getElementById('sort-asc');
sortAscBtn.addEventListener('click', () => sortAppointmentsByTime('asc'));

const sortDescBtn = document.getElementById('sort-desc');
sortDescBtn.addEventListener('click', () => sortAppointmentsByTime('desc'));

// Event listener for search input
const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value;
    renderAppointments(searchTerm);
});

// Event listener for expired appointments search input
const expiredSearchInput = document.getElementById('expired-search-input');
expiredSearchInput.addEventListener('input', () => {
    const searchTerm = expiredSearchInput.value;
    renderExpiredAppointments(searchTerm);
});

// Event listener for delete all expired appointments button
const deleteAllExpiredBtn = document.getElementById('delete-all-expired');
deleteAllExpiredBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete all expired appointments?')) {
        appointments = appointments.filter(appointment => !isAppointmentExpired(appointment));
        saveAppointments();
        renderAppointments();
        renderExpiredAppointments();
    }
});

// Event listeners for taskbar buttons
const taskButtons = document.querySelectorAll('.task-btn');
const tabContents = document.querySelectorAll('.tab');

taskButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        taskButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(tab => tab.classList.remove('active'));

        btn.classList.add('active');
        tabContents[index].classList.add('active');
    });
});

function checkExpiredAppointments() {
    const currentDate = new Date();
    appointments.forEach(appointment => {
        const appointmentDate = new Date(`${appointment.appointmentDate} ${appointment.appointmentTime}`);
        if (appointmentDate < currentDate) {
            appointment.expired = true; // Mark the appointment as expired
        }
    });

    saveAppointments();
    renderAppointments(); // Render both active and expired appointments
}

// Render initial appointments (if any)
loadAppointments();

// Check for expired appointments every minute
setInterval(checkExpiredAppointments, 60000);

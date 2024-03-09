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
    const expiredAppointmentsList = document.getElementById('expired-appointments-list');
    appointmentsList.innerHTML = '';
    expiredAppointmentsList.innerHTML = '';

    const filteredAppointments = appointments.filter(appointment => {
        const appointmentInfo = `${appointment.patientName} ${appointment.appointmentDate} ${appointment.appointmentTime}`.toLowerCase();
        return appointmentInfo.includes(searchTerm.toLowerCase());
    });

    filteredAppointments.forEach((appointment, index) => {
        const isExpired = isAppointmentExpired(appointment);
        const appointmentElement = createAppointmentElement(appointment, index);

        if (isExpired) {
            expiredAppointmentsList.appendChild(appointmentElement);
        } else {
            appointmentsList.appendChild(appointmentElement);
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

    const editBtn = document.createElement('button');
    editBtn.classList.add('edit-btn');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => editAppointment(index));

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteAppointment(index));

    appointmentElement.appendChild(appointmentInfo);
    appointmentElement.appendChild(editBtn);
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

// Render initial appointments (if any)
loadAppointments();
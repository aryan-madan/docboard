document.addEventListener('DOMContentLoaded', function() {
  const appointmentForm = document.getElementById('appointmentForm');
  const appointmentList = document.getElementById('appointmentList');
  const appointmentViewer = document.getElementById('appointmentViewer');
  const viewerName = document.getElementById('viewerName');
  const viewerDate = document.getElementById('viewerDate');
  const viewerTime = document.getElementById('viewerTime');
  const saveBtn = document.getElementById('saveBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const scheduleBtn = document.getElementById('scheduleBtn');
  const sortOption = document.getElementById('sortOption');
  const scheduleAppointmentTab = document.getElementById('scheduleAppointmentTab');
  const viewAppointmentsTab = document.getElementById('viewAppointmentsTab');

  const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
  let selectedIndex = -1;

  appointmentForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    if (name && date && time) {
      const appointment = { name, date, time };
      appointments.push(appointment);
      saveAppointments();
      displayAppointments();
      appointmentForm.reset();
    } else {
      alert('Please fill in all fields.');
    }
  });

  function displayAppointments() {
    sortAppointments();

    appointmentList.innerHTML = '';
    appointments.forEach(function(appointment, index) {
      const li = document.createElement('li');
      li.classList.add('appointment-item');
      li.setAttribute('data-index', index);
      li.draggable = true;

      const appointmentDetails = document.createElement('span');
      appointmentDetails.textContent = `${appointment.name} - ${appointment.date} at ${appointment.time}`;

      const removeButton = document.createElement('button');
      removeButton.textContent = 'Remove';
      removeButton.classList.add('ml-auto', 'bg-red-500', 'hover:bg-red-700', 'text-white', 'font-bold', 'py-1', 'px-2', 'rounded');
      removeButton.addEventListener('click', function(event) {
        event.stopPropagation();
        appointments.splice(index, 1);
        saveAppointments();
        displayAppointments();
        hideAppointmentViewer();
      });

      li.appendChild(appointmentDetails);
      li.appendChild(removeButton);
      li.addEventListener('click', function() {
        selectedIndex = index;
        displayAppointmentDetails(appointment);
      });
      appointmentList.appendChild(li);
    });

    new Sortable(appointmentList, {
      animation: 150,
      onEnd: function(evt) {
        const oldIndex = evt.oldIndex;
        const newIndex = evt.newIndex;
        const temp = appointments[oldIndex];
        appointments.splice(oldIndex, 1);
        appointments.splice(newIndex, 0, temp);
        saveAppointments();
      },
    });
  }

  function sortAppointments() {
    const sortBy = sortOption.value;
    if (sortBy === 'date') {
      appointments.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === 'time') {
      appointments.sort((a, b) => {
        const [aHour, aMinute] = a.time.split(':');
        const [bHour, bMinute] = b.time.split(':');
        const aTime = parseInt(aHour, 10) * 60 + parseInt(aMinute, 10);
        const bTime = parseInt(bHour, 10) * 60 + parseInt(bMinute, 10);
        return aTime - bTime;
      });
    }
  }

  function displayAppointmentDetails(appointment) {
    viewerName.value = appointment.name;
    viewerDate.value = appointment.date;
    viewerTime.value = appointment.time;
    appointmentViewer.classList.remove('hidden');
  }

  function hideAppointmentViewer() {
    appointmentViewer.classList.add('hidden');
    selectedIndex = -1;
  }

  saveBtn.addEventListener('click', function() {
    const updatedName = viewerName.value;
    const updatedDate = viewerDate.value;
    const updatedTime = viewerTime.value;

    if (updatedName && updatedDate && updatedTime) {
      appointments[selectedIndex] = { name: updatedName, date: updatedDate, time: updatedTime };
      saveAppointments();
      displayAppointments();
      hideAppointmentViewer();
    } else {
      alert('Please fill in all fields.');
    }
  });

  cancelBtn.addEventListener('click', hideAppointmentViewer);

  sortOption.addEventListener('change', displayAppointments);

  const scheduleAppointmentLink = document.querySelectorAll('a')[0];
  const viewAppointmentsLink = document.querySelectorAll('a')[1];

  scheduleAppointmentLink.addEventListener('click', function(event) {
    event.preventDefault();
    scheduleAppointmentTab.classList.remove('hidden');
    viewAppointmentsTab.classList.add('hidden');
  });

  viewAppointmentsLink.addEventListener('click', function(event) {
    event.preventDefault();
    scheduleAppointmentTab.classList.add('hidden');
    viewAppointmentsTab.classList.remove('hidden');
    displayAppointments();
  });

  function saveAppointments() {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }

  displayAppointments();
});
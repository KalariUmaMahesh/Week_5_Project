// Sample doctor data with initial availability
const doctors = {
    "heart-specialist": [
        { name: "Dr. Smith", availableTimes: ["09:00", "11:00", "14:00"] },
        { name: "Dr. Johnson", availableTimes: ["10:00", "13:00", "15:00"] }
    ],
    "pediatrician": [
        { name: "Dr. Brown", availableTimes: ["08:00", "10:00", "13:00"] },
        { name: "Dr. Williams", availableTimes: ["09:00", "12:00", "14:00"] }
    ],
    "general-practitioner": [
        { name: "Dr. Davis", availableTimes: ["09:00", "10:30", "13:00"] },
        { name: "Dr. Martinez", availableTimes: ["11:00", "13:00", "15:00"] }
    ]
};

// Object to keep track of booked appointments
const bookedAppointments = [];

// DOM elements
const doctorTypeSelect = document.getElementById("doctor-type");
const doctorSelect = document.getElementById("doctor");
const availabilityDiv = document.getElementById("availability");
const form = document.getElementById("form");
const confirmationMessage = document.getElementById("confirmation-message");

// Populate doctor names based on type
doctorTypeSelect.addEventListener("change", function() {
    const selectedType = this.value;
    doctorSelect.innerHTML = "<option value=''>Select Doctor</option>"; // Reset options
    if (selectedType) {
        const doctorsList = doctors[selectedType];
        doctorsList.forEach(doctor => {
            const option = document.createElement("option");
            option.value = doctor.name;
            option.textContent = doctor.name;
            doctorSelect.appendChild(option);
        });
    }
});

// Show availability when a doctor is selected and date is provided
doctorSelect.addEventListener("change", updateAvailability);
document.getElementById("date").addEventListener("change", updateAvailability);

function updateAvailability() {
    const selectedType = doctorTypeSelect.value;
    const selectedDoctor = doctorSelect.value;
    const selectedDate = document.getElementById("date").value;
    
    if (selectedType && selectedDoctor && selectedDate) {
        const doctorList = doctors[selectedType];
        const doctor = doctorList.find(d => d.name === selectedDoctor);
        if (doctor) {
            // Filter out times that are already booked
            const availableTimes = doctor.availableTimes.filter(time => {
                return !bookedAppointments.some(app => app.doctor === selectedDoctor && app.date === selectedDate && app.time === time);
            });
            const times = availableTimes.map(time => `<li>${time}</li>`).join("");
            availabilityDiv.innerHTML = `
                <h3>${doctor.name}</h3>
                <ul>
                    ${times.length ? times : "No available times"}
                </ul>
            `;
        } else {
            availabilityDiv.innerHTML = "No availability found.";
        }
    } else {
        availabilityDiv.innerHTML = "Please select a doctor and date.";
    }
}

// Handle appointment booking
form.addEventListener("submit", function(event) {
    event.preventDefault();

    const doctorType = doctorTypeSelect.value;
    const doctorName = doctorSelect.value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;

    if (doctorType && doctorName && date && time) {
        // Add booking to the booked appointments list
        bookedAppointments.push({ doctor: doctorName, date, time });

        // Clear the form and update the availability display
        form.reset();
        doctorSelect.innerHTML = "<option value=''>Select Doctor</option>";
        availabilityDiv.innerHTML = "Please select a doctor and date to view availability.";

        confirmationMessage.textContent = `Appointment booked with ${doctorName} on ${date} at ${time}.`;
    } else {
        confirmationMessage.textContent = "Please fill out all fields.";
    }
});


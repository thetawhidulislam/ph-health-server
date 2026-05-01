// Pay Now Book Appointment
const bookAppointment = async () => {};

const getMyAppointments = async () => {};

// 1. Completed Or Cancelled Appointments should not be allowed to update status
// 2. Doctors can only update Appoinment status from schedule to inprogress or inprogress to complted or schedule to cancelled.
// 3. Patients can only cancel the scheduled appointment if it scheduled not completed or cancelled or inprogress.
// 4. Admin and Super admin can update to any status.

const changeAppointmentStatus = async () => {};

// refactoring on include of doctor and patient data in appointment details, we can use query builder to get the data in single query instead of multiple queries in case of doctor and patient both
const getMySingleAppointment = async () => {};

// integrate query builder
const getAllAppointments = async () => {};

const bookAppointmentWithPayLater = async () => {};

const initiatePayment = async () => {};

const cancelUnpaidAppointments = async () => {};

export const AppointmentService = {
  bookAppointment,
  getMyAppointments,
  changeAppointmentStatus,
  getMySingleAppointment,
  getAllAppointments,
  bookAppointmentWithPayLater,
  initiatePayment,
  cancelUnpaidAppointments,
};

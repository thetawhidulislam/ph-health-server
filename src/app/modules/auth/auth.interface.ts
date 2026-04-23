export interface IregisterPatientPayload {
  name: string;
  email: string;
  password: string;
}
export interface IloginUserPayload {
  email: string;
  password: string;
}

export interface IChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

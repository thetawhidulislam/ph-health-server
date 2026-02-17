import { IUpdateDoctorPayload } from "./doctor.interface";
import { prisma } from "../../lib/prisma";

const getAllDoctors = async () => {
  const doctors = await prisma.doctor.findMany({
    include: {
      user: true,
      specialities: {
        include: {
          specialty: true,
        },
      },
    },
  });
  return doctors;
};
const getDoctorById = async (id: string) => {
  const doctor = await prisma.doctor.findUnique({
    where: {
      id: id,
    },
    include: {
      user: true,
      specialities: {
        include: {
          specialty: true,
        },
      },
    },
  });
  return doctor;
};

const updateDoctor = async (id: string, payload: IUpdateDoctorPayload) => {
  const doctorData = await prisma.doctor.findUnique({
    where: {
      id: id,
    },
  });
  if (!doctorData) {
    throw new Error("Data Not Found");
  }
  const updateData = await prisma.doctor.update({
    where: {
      id: id,
    },
    data: payload,
  });
  return updateData;
};

const deleteDoctor = async (id: string) => {
  const doctor = await prisma.doctor.delete({
    where: { id: id },
  });
  return doctor;
};
export const DoctorService = {
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};

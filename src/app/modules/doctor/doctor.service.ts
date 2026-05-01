import { IUpdateDoctorPayload } from "./doctor.interface";
import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelper/AppError";
import status from "http-status";
import { UserStatus } from "../../../generated/prisma/browser";
import { QueryBuilder } from "../../utils/queryBuilder";
import { IQueryParams } from "../../interfaces/query.interface";
import {
  doctorFilterableFields,
  doctorIncludeConfig,
  doctorSearchableFields,
} from "./doctor.constant";
import { Doctor, Prisma } from "../../../generated/prisma/client";

const getAllDoctors = async (query: IQueryParams) => {
  // const doctors = await prisma.doctor.findMany({
  //     where: {
  //         isDeleted: false,
  //     },
  //     include: {
  //         user: true,
  //         specialties: {
  //             include: {
  //                 specialty: true
  //             }
  //         }
  //     }
  // })

  // // const query = new QueryBuilder().paginate().search().filter();
  // return doctors;

  const queryBuilder = new QueryBuilder<
    Doctor,
    Prisma.DoctorWhereInput,
    Prisma.DoctorInclude
  >(prisma.doctor, query, {
    searchableFields: doctorSearchableFields,
    filterableFields: doctorFilterableFields,
  });

  const result = await queryBuilder
    .search()
    .filter()
    .where({
      isDeleted: false,
    })
    .include({
      user: true,
      // specialties: true,
      specialities: {
        include: {
          specialty: true,
        },
      },
    })
    .dynamicInclude(doctorIncludeConfig)
    .paginate()
    .sort()
    .fields()
    .execute();

  console.log(result);
  return result;
};

const getDoctorById = async (id: string) => {
  const doctor = await prisma.doctor.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      user: true,
      specialities: {
        include: {
          specialty: true,
        },
      },
      appointments: {
        include: {
          patient: true,
          schedule: true,
          prescription: true,
        },
      },
      doctorSchedules: {
        include: {
          schedule: true,
        },
      },
      reviews: true,
    },
  });
  return doctor;
};

const updateDoctor = async (id: string, payload: IUpdateDoctorPayload) => {
  const isDoctorExist = await prisma.doctor.findUnique({
    where: {
      id,
    },
  });

  if (!isDoctorExist) {
    throw new AppError(status.NOT_FOUND, "Doctor not found");
  }

  const { doctor: doctorData, specialities } = payload;

  await prisma.$transaction(async (tx) => {
    if (doctorData) {
      await tx.doctor.update({
        where: {
          id,
        },
        data: {
          ...doctorData,
        },
      });
    }

    if (specialities && specialities.length > 0) {
      for (const specialty of specialities) {
        const { specialtyId, shouldDelete } = specialty;
        if (shouldDelete) {
          await tx.doctorSpeciality.delete({
            where: {
              doctorId_specialtyId: {
                doctorId: id,
                specialtyId,
              },
            },
          });
        } else {
          await tx.doctorSpeciality.upsert({
            where: {
              doctorId_specialtyId: {
                doctorId: id,
                specialtyId,
              },
            },
            create: {
              doctorId: id,
              specialtyId,
            },
            update: {},
          });
        }
      }
    }
  });

  const doctor = await getDoctorById(id);

  return doctor;
};

const deleteDoctor = async (id: string) => {
  const isDoctorExist = await prisma.doctor.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!isDoctorExist) {
    throw new AppError(status.NOT_FOUND, "Doctor not found");
  }

  await prisma.$transaction(async (tx) => {
    await tx.doctor.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    await tx.user.update({
      where: { id: isDoctorExist.userId },
      data: {
        isDeleted: true,
        deletedAT: new Date(),
        status: UserStatus.DELETED, // Optional: you may also want to block the user
      },
    });

    await tx.session.deleteMany({
      where: { userId: isDoctorExist.userId },
    });

    await tx.doctorSpeciality.deleteMany({
      where: { doctorId: id },
    });
  });

  return { message: "Doctor deleted successfully" };
};
export const DoctorService = {
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};

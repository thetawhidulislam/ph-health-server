import z from "zod";

const createSpecialityZodSchema = z.object({
  title: z.string("Speciality title is required"),
  description: z.string("Speciality description is required").optional(),
});
export const specialityZodValidation = {
  createSpecialityZodSchema,
};

import { z } from "zod";

export const loginSchema = z.object({
  userName: z.string().nonempty("กรุณากรอก Username"),
  password: z.string().nonempty("กรุณากรอกรหัสผ่าน"),
});

export const registerSchema = z.object({
  firstName: z
    .string()
    .nonempty("กรุณากรอกชื่อ")
    .min(2, "ชื่อต้องมากกว่า 2 ตัวอักษร"),
  lastName: z
    .string()
    .nonempty("กรุณากรอกนามสกุล")
    .min(2, "นามสกุลต้องมากกว่า 2 ตัวอักษร"),
  email: z.string().nonempty("กรุณากรอกอีเมล").email("รูปแบบอีเมลไม่ถูกต้อง"),
  tel: z
    .string()
    .nonempty("กรุณากรอกเบอร์โทร")
    .regex(/^[0-9+()-\s]+$/, "กรุณากรอกเบอร์โทรให้ถูกต้อง"),
  userName: z
    .string()
    .nonempty("กรุณากรอก Username") // ห้ามเว้นว่าง
    .min(3, "Username ต้องมีความยาวอย่างน้อย 3 ตัวอักษร")
    .max(20, "Username ต้องไม่เกิน 20 ตัวอักษร")
    .regex(
      /^[a-zA-Z0-9_.]+$/,
      "Username อนุญาตเฉพาะตัวอักษร, ตัวเลข, _ และ . เท่านั้น"
    ),
  password: z
    .string()
    .nonempty("กรุณากรอกรหัสผ่าน") // ห้ามเว้นว่าง
    .min(8, "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร"),
  departmentId: z.coerce.number(),
  positionId: z.coerce.number(),
  role: z.string().nonempty("กรุณาเลือกสิทธิ์"),
  pictureId: z.any(),
});

export const positionSchema = z.object({
  name: z
    .string()
    .nonempty("กรุณากรอกตำแหน่ง")
    .min(2, "ชื่อตำแหน่งต้องมากกว่า 2 ตัวอักษร"),
});

export const departmentSchema = z.object({
  name: z
    .string()
    .nonempty("กรุณากรอกตำแหน่ง")
    .min(2, "ชื่อตำแหน่งต้องมากกว่า 2 ตัวอักษร"),
});

export const categorySchema = z.object({
  name: z
    .string()
    .nonempty("กรุณากรอกตำแหน่ง")
    .min(2, "ชื่อตำแหน่งต้องมากกว่า 2 ตัวอักษร"),
});

export const equipmentSchema = z.object({
  equipmentCategoryId: z.coerce.number(),
  name: z
    .string()
    .nonempty("กรุณากรอกชื่ออุปกรณ์")
    .min(2, "ชื่ออุปกรณ์ต้องมากกว่า 2 ตัวอักษร"),
  equipmentNumber: z
    .string()
    .nonempty("กรุณากรอกรหัสอุปกรณ์")
    .min(2, "รหัสอุปกรณ์ต้องมากกว่า 2 ตัวอักษร"),
  address: z
    .string()
    .nonempty("กรุณากรอกสถานที่")
    .min(2, "สถานที่ต้องมากกว่า 2 ตัวอักษร"),
  statusEquipment: z
    .string()
    .optional() // ✅ ทำให้เลือกได้ว่าจะส่งมาหรือไม่
    .or(z.literal("")), // ✅ อนุญาตให้เป็นค่าว่าง
  images: z.any(),
});

export const reportSchema = z.object({
  name: z
    .string()
    .nonempty("กรุณากรอกชื่ออุปกรณ์")
    .min(2, "ชื่ออุปกรณ์ต้องมากกว่า 2 ตัวอักษร"),
  equipmentId: z.coerce.number(),
  problem: z
    .string()
    .nonempty("กรุณากรอกอาการ")
    .min(2, "อาการต้องมากกว่า 2 ตัวอักษร"),
  address: z
    .string()
    .nonempty("กรุณากรอกสถานที่")
    .min(2, "สถานที่ต้องมากกว่า 2 ตัวอักษร"),
  images: z.any(),
});

export const assignReportSchemaBySupervisor = z.object({
  technicianId: z.coerce.number(),
});

export const successAssignmentSchemaByTechnician = z.object({
  solution: z
    .string()
    .nonempty("กรุณากรอกคำอธิบายการแก้ไข")
    .min(2, "คำอธิบายการแก้ไขต้องมากกว่า 2 ตัวอักษร"),
  status: z.string().nonempty("กรุณาเลือกสถานะการส่งงาน"),
});

export const passwordSchema = z.object({
  password: z
    .string()
    .nonempty("กรุณากรอกรหัสผ่าน") // ห้ามเว้นว่าง
    .min(8, "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร"),
});

export const updateUserSchema = z.object({
  firstName: z
    .string()
    .nonempty("กรุณากรอกชื่อ")
    .min(2, "ชื่อต้องมากกว่า 2 ตัวอักษร"),
  lastName: z
    .string()
    .nonempty("กรุณากรอกนามสกุล")
    .min(2, "นามสกุลต้องมากกว่า 2 ตัวอักษร"),
  email: z.string().nonempty("กรุณากรอกอีเมล").email("รูปแบบอีเมลไม่ถูกต้อง"),
  tel: z
    .string()
    .nonempty("กรุณากรอกเบอร์โทร")
    .regex(/^[0-9+()-\s]+$/, "กรุณากรอกเบอร์โทรให้ถูกต้อง"),
  userName: z
    .string()
    .nonempty("กรุณากรอก Username") // ห้ามเว้นว่าง
    .min(3, "Username ต้องมีความยาวอย่างน้อย 3 ตัวอักษร")
    .max(20, "Username ต้องไม่เกิน 20 ตัวอักษร")
    .regex(
      /^[a-zA-Z0-9_.]+$/,
      "Username อนุญาตเฉพาะตัวอักษร, ตัวเลข, _ และ . เท่านั้น"
    ),
  departmentId: z.coerce.number(),
  positionId: z.coerce.number(),
  pictureId: z.any(),
});

export const updateUserAccountSchema = z.object({
  firstName: z
    .string()
    .nonempty("กรุณากรอกชื่อ")
    .min(2, "ชื่อต้องมากกว่า 2 ตัวอักษร"),
  lastName: z
    .string()
    .nonempty("กรุณากรอกนามสกุล")
    .min(2, "นามสกุลต้องมากกว่า 2 ตัวอักษร"),
  email: z.string().nonempty("กรุณากรอกอีเมล").email("รูปแบบอีเมลไม่ถูกต้อง"),
  tel: z
    .string()
    .nonempty("กรุณากรอกเบอร์โทร")
    .regex(/^[0-9+()-\s]+$/, "กรุณากรอกเบอร์โทรให้ถูกต้อง")
    .min(10, "เบอร์โทรต้องมีความยาว 10 ตัว")
    .max(10, "เบอร์โทรต้องมีความยาวไม่เกิน 10 ตัว"),

  userName: z
    .string()
    .nonempty("กรุณากรอก Username") // ห้ามเว้นว่าง
    .min(3, "Username ต้องมีความยาวอย่างน้อย 3 ตัวอักษร")
    .max(20, "Username ต้องไม่เกิน 20 ตัวอักษร")
    .regex(
      /^[a-zA-Z0-9_.]+$/,
      "Username อนุญาตเฉพาะตัวอักษร, ตัวเลข, _ และ . เท่านั้น"
    ),
  pictureId: z.any(),
});

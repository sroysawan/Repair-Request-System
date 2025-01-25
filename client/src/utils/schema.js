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

export const equipmentCategorySchema = z.object({
  name: z
  .string()
  .nonempty("กรุณากรอกตำแหน่ง")
  .min(2, "ชื่อตำแหน่งต้องมากกว่า 2 ตัวอักษร"),
});

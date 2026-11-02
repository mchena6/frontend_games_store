import { z } from "zod";

export const registerSchema = z.object({
    username: z.string()
        .min(3, "El usuario debe tener al menos 3 caracteres")
        .max(10, "El usuario debe tener menos de 20 caracteres"),
    email: z.string()
        .email("El correo ingresado no es valido"),
    password: z.string()
        .min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string()
        .min(1, "Debes confirmar tu contraseña"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"]
});
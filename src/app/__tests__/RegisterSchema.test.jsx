import { describe, it, expect } from "vitest";
import { registerSchema } from "@/app/validations/RegisterSchema";

describe("Pruebas para registerSchema", () => {
    
    it("debe fallar si el username tiene menos de 3 caracteres", () => {
        const invalidData = {
            username: "ia",
            email: "ian@correo.com",
            password: "password123",
            confirmPassword: "password123"
        };
        const result = registerSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe("El usuario debe tener al menos 3 caracteres");
        }
    });

    it("debe fallar si el email no es válido", () => {
        const invalidData = {
            username: "iancho",
            email: "correo-falso",
            password: "password123",
            confirmPassword: "password123"
        };
        const result = registerSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe("El correo ingresado no es valido");
        }
    });

    it("debe fallar si las contraseñas no coinciden", () => {
        const invalidData = {
            username: "iancho",
            email: "ian@correo.com",
            password: "password123",
            confirmPassword: "passwordDistinta"
        };
        const result = registerSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe("Las contraseñas no coinciden");
        }
    });

    it("debe permitir el registro con datos válidos", () => {
        const validData = {
            username: "iancho",
            email: "ian@correo.com",
            password: "password123",
            confirmPassword: "password123"
        };
        const result = registerSchema.safeParse(validData);
        expect(result.success).toBe(true);
    });
});
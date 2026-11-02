"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../validations/RegisterSchema";
import { register as registerAction } from "@/app/actions";

import Link from "next/link";
import React from "react";

function RegisterPage() {
  const router = useRouter();
  const [apiError, setApiError] = useState(null);
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, formState: { errors } } = useForm ({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    }
  })

  const onSubmit = (data) => {
    setApiError(null);

    const formData = new FormData()
    formData.append("username", data.username)
    formData.append("email", data.email)
    formData.append("password", data.password)

    startTransition(async () => {
      const res = await registerAction(null, formData)
      if (res?.error) {
        setApiError(res.error)
      } else {
        router.push("/login")
      }
    })
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-screen p-4">
      
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm flex flex-col gap-4 border p-6 rounded">
        
        <Link href={"/login"} className="text-blue-600 underline self-start">
          &larr; Volver al Login
        </Link>

        <h1 className="text-xl font-bold">Crear Cuenta</h1>
        
        {apiError && (
          <div className="border border-red-500 text-red-700 bg-red-50 p-2 rounded">
            {apiError}
          </div>
        )}

        <div className="flex flex-col">
          <label>
            Username <span className="text-sm text-red-600">{errors.username && "*" + errors.username.message}</span>
          </label>
          <input
            type="text"
            placeholder="crea tu username"
            className="border p-2 rounded"
            {...register("username")}
          />
        </div>

        <div className="flex flex-col">
          <label>
            Email <span className="text-sm text-red-600">{errors.email && "*" + errors.email.message}</span>
          </label>
          <input
            type="email"
            placeholder="correo@ejemplo.com"
            className="border p-2 rounded"
            {...register("email")}
          />
        </div>

        <div className="flex flex-col">
          <label>
            Password <span className="text-sm text-red-600">{errors.password && "*" + errors.password.message}</span>
          </label>
          <input
            type="password"
            placeholder="********"
            className="border p-2 rounded"
            {...register("password")}
          />
        </div>

        <div className="flex flex-col">
          <label>
            Confirm Password <span className="text-sm text-red-600">{errors.confirmPassword && "*" + errors.confirmPassword.message}</span>
          </label>
          <input
            type="password"
            placeholder="********"
            className="border p-2 rounded"
            {...register("confirmPassword")}
          />
        </div>

        <button 
          type="submit" 
          disabled={isPending}
          className="bg-blue-600 text-white p-2 rounded mt-2 disabled:opacity-50"
        >
          {isPending ? "Guardando..." : "Registrarse"}
        </button>
        
      </form>
    </section>
  )
}

export default RegisterPage

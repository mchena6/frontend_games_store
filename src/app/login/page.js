"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/app/validations/LoginSchema";
import { login as loginAction } from "@/app/actions";

import Link from "next/link";
import React from "react";

function LoginPage() {
  const [apiError, setApiError] = useState(null);
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    }
  });

  const onSubmit = (data) => {
    setApiError(null);

    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("password", data.password);

    startTransition(async () => {
      const res = await loginAction(null, formData);
      if (res?.error) {
        setApiError(res.error);
      }
    });
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen p-4">
      
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm flex flex-col gap-4 border p-6 rounded">

        <h1 className="text-xl font-bold">Iniciar Sesion</h1>
        
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
            placeholder="ingresa tu usuario"
            className="border p-2 rounded"
            {...register("username")}
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

        <button 
          type="submit" 
          disabled={isPending}
          className="bg-blue-600 text-white p-2 rounded mt-2 disabled:opacity-50"
        >
          {isPending ? "Ingresando..." : "Iniciar Sesión"}
        </button>

        <Link href={"/register"} className="text-blue-600 underline self-start">
          ¿No tenes cuenta? Registrate
        </Link>
        
      </form>
    </section>
  )
}

export default LoginPage;
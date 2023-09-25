"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { api } from "@/lib/axios";
import { Users } from "../login/page";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const newuserFormSchema = z.object({
  name: z.string().min(3, { message: "Informe um nome válido" }),
  email: z.string().min(6, { message: "Informe um email válido" }).email(),
  password: z.string().min(6, "Informe a Senha correta"),
});

type NewUserFormInputs = z.infer<typeof newuserFormSchema>;
export default function NewUser() {
  const [users, setUsers] = useState<Users[]>([]);
  const [error, setError] = useState<boolean | undefined>(undefined);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<NewUserFormInputs>({
    resolver: zodResolver(newuserFormSchema),
  });
  const router = useRouter();

  async function handleNewUser(data: NewUserFormInputs) {
    const userAlreadyExists = users.some(
      (user) => user.email === data.email && user.password === data.password
    );
    if (userAlreadyExists) {
      setError(true);
    } else {
      await api.post("users", data);
      await Cookies.set("user-logged", "true", { expires: 30, path: "/" });
      await router.push("/dashboard");
    }
  }

  useEffect(() => {
    api.get("users").then((response) => setUsers(response.data));
  }, []);

  return (
    <div className="fixed w-screen h-screen inset-0 bg-black bg-opacity-75">
      <div className="w-[85%] md:w-[35%] mx-auto p-10 bg-gray-800 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md">
        <h1 className="text-center">Cadastrar Usuário</h1>
        <form onSubmit={handleSubmit(handleNewUser)}>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Nome"
              required
              {...register("name")}
              className="w-full p-3 rounded-lg bg-gray-900 text-gray-300 placeholder-gray-500"
            />
            {errors.name && (
              <span className="text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>
          <div className="mt-4">
            <input
              type="text"
              placeholder="E-mail"
              required
              {...register("email")}
              className="w-full p-3 rounded-lg bg-gray-900 text-gray-300 placeholder-gray-500"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Senha"
              required
              {...register("password")}
              className="w-full p-3 rounded-lg bg-gray-900 text-gray-300 placeholder-gray-500"
            />
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>
          {error && (
            <strong className="text-red-500 font-normal text-base mt-4">
              Por favor digite outro e-mail, e-mail já utilizado!
            </strong>
          )}
          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full mt-6 h-14 bg-green-500 text-white font-bold px-5 rounded-lg cursor-pointer hover:bg-green-700 transition duration-200"
          >
            Entrar
          </button>
          <div className="mt-6 flex items-center gap-2">
            <Link
              href="login"
              className="text-green-500 text-base no-underline"
            >
              Login
            </Link>
            <ArrowRight color="#00875F" size={20} />
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";
import { AiFillGithub } from "react-icons/ai";
import { FaGoogle } from "react-icons/fa";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import useRegisterModal from "../../../app/hooks/useRegisterModel";
import Modal from "./Modal";
import Heading from "../Heading";
import Input from "../input/Input";
import toast from "react-hot-toast";
import Button from "../Button";
import useLogInModal from "../../hooks/userLogInModel";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { log } from "console";

const LogInModal = () => {
  const registerModal = useRegisterModal();
  const logInModal = useLogInModal();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async (data) => {
      setLoading(true);

      signIn("credentials", {
        ...data,
        redirect: false,
      })
        .then((callback) => {
          setLoading(false);

          if (callback?.ok) {
            toast.success("Logged in successfully");
            router.refresh();
            logInModal.onClose();
          }

          if (callback?.error) {
            console.error("Login error:", callback.error);
            toast.error(callback.error);
          }
        })
        .catch(() => {
          setLoading(false);
          toast.error("An error occurred during login.");
        });
    },
    [logInModal, router]
  );

    const toggle = useCallback(() => {
        logInModal.onClose();
        registerModal.onOpen();
    }, [logInModal, registerModal]); 

  const bodyContent = (
    <div className="flex flex-col">
      <Heading title="Welcome to black" subtitle=" Log in to your Account " />
      <Input
        id="email"
        label="E-mail"
        disabled={loading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        type="password"
        label="Password"
        disabled={loading}
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  const footerContent = () => {
    return (
      <div className="flex flex-col gap-4 mt-3">
        <hr />
        <Button
          outline
          label="Continue with Google"
          icon={FaGoogle}
          onClick={() => signIn("google")}
        />
        <Button
          outline
          label="Continue with Github"
          icon={AiFillGithub}
          onClick={() => signIn("github")}
        />
        <div>
          Don't have an account?{" "}
          <span
            className="text-indigo-500 cursor-pointer"
            onClick={toggle}
          >
            Create an account
          </span>
        </div>
      </div>
    );
  };

  return (
    <Modal
      disabled={loading}
      isOpen={logInModal.isOpen}
      title="Log in"
      actionLabel="Continue"
      onClose={logInModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent()}
    />
  );
};

export default LogInModal;

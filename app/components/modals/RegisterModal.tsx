"use client";
import { AiFillGithub } from "react-icons/ai";
import { FaGoogle } from "react-icons/fa";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import axios from "axios"; // Ensure this is imported correctly
import useRegisterModal from "../../../app/hooks/useRegisterModel";
import Modal from "./Modal";
import Heading from "../Heading";
import Input from "../input/Input";
import toast from "react-hot-toast";
import Button from "../Button";
import { signIn } from "next-auth/react";
import useLogInModal from "../../hooks/userLogInModel";


const RegisterModal = () => {
  const registerModal = useRegisterModal();
  const loginModal = useLogInModal();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async (data) => {
      setLoading(true);
      try {
        await axios.post("/api/register", data);
        registerModal.onClose();
      } catch (error) {
        toast.error("An error occurred. Please try again later.");
      }
      setLoading(false);
    },
    [registerModal]
  );


  const toggle = useCallback(() => {
    registerModal.onClose();
    loginModal.onOpen();
}, [loginModal, registerModal]); 


  const bodyContent = (
    <div
      className="
    flex
    flex-col
     "
    >
      <Heading title="Welcome to Airbnb" subtitle="Create an account" />
      <Input
        id="email"
        label="E-mail"
        disabled={loading}
        register={register}
        errors={errors}
        required
      />{" "}
      <Input
        id="name"
        label="Name"
        disabled={loading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        type="password"
        label="password"
        disabled={loading}
        register={register}
        errors={errors}
        required
      />{" "}
    </div>
  );

  const footerContent = () => {
    return (
      <div
        className="
      flex
      flex-col
       gap-4
       mt-3
    
       "
      >
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
          Already have an account?{" "}
          <span
            className="text-indigo-500 cursor-pointer"
            onClick={toggle}
          >
            Log in
          </span>
        </div>
      </div>
    );
  };

  return (
    <Modal
      disabled={loading}
      isOpen={registerModal.isOpen}
      title="Register"
      actionLabel="Continue"
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent()}
    />
  );
};

export default RegisterModal;

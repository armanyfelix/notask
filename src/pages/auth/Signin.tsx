import supabase from "../../utils/supabase";
import { z } from "zod";
import GoogleIcon from "../../assets/icons/google.svg?react";
import GithubIcon from "../../assets/icons/github.svg?react";
import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";

const schema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
  })
  .required();
type Inputs = z.infer<typeof schema>;

export default function Signin() {
  const [submit, setSubmit] = useState<any>({});
  const [toggleSeePassword, setToggleSeePassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();
  const location = useLocation();
  const previousLocation = useMemo(
    () => location.state?.from?.pathname || "/",
    [location],
  );

  const onGithub = () => {
    supabase.auth.signInWithOAuth({
      provider: "github",
    });
  };

  const onSubmit = async (values: Inputs) => {
    setSubmit({
      ...submit,
      pending: true,
    });
    try {
      const { error } = await supabase.auth.signInWithPassword(values as any);
      if (error) {
        setSubmit({
          ...submit,
          error: error.message,
        });
      } else {
        navigate(previousLocation, { replace: true });
      }
    } catch (err) {
      console.log(err);
    }
    setSubmit({
      ...submit,
      pending: false,
    });
  };

  return (
    <section className="h-screen bg-linear-to-tl from-secondary/10 to-accent/10">
      <div className="h-full">
        <h1 className="py-16 text-center font-futura text-3xl md:text-4xl">
          Sign in to Notask
        </h1>
        <div className="mx-auto max-w-md space-y-5 px-5 pb-10 font-proto lg:w-2/3">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="form-control space-y-5"
          >
            <div className="flex items-center">
              <button className="btn btn-ghost mr-2 w-full flex-auto bg-white text-gray-700 hover:text-gray-900">
                <GoogleIcon className="h-7" />
                Google
              </button>
              <button
                className="btn w-full flex-auto bg-gray-950 text-gray-200"
                onClick={() => onGithub()}
              >
                <GithubIcon className="h-7 w-7" />
                GitHub
              </button>
            </div>
            <div className="divider">or</div>
            <div>
              <label
                className={`input input-bordered flex items-center pl-3 ${
                  errors.email && "border-error"
                }`}
              >
                <span className="icon-[solar--letter-bold-duotone] h-6 w-6"></span>
                <input
                  className="ml-3 grow"
                  placeholder="Email"
                  {...register("email", {
                    required: "Email address is required",
                  })}
                  aria-invalid={errors.email ? "true" : "false"}
                />
              </label>
              {errors.email && (
                <p className="p-1 text-end text-xs text-error">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label
                className={`input input-bordered flex items-center pl-3 ${
                  errors.password && "border-error"
                }`}
              >
                <span className="icon-[solar--key-minimalistic-bold-duotone] h-6 w-6"></span>
                <input
                  id="password"
                  type={toggleSeePassword ? "text" : "password"}
                  placeholder="Password"
                  className="ml-3 grow"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  aria-invalid={errors.password ? "true" : "false"}
                />
                <label className="swap">
                  <input
                    type="checkbox"
                    onClick={() => setToggleSeePassword(!toggleSeePassword)}
                  />
                  <span className="swap-on icon-[solar--eye-closed-linear]"></span>
                  <span className="swap-off icon-[solar--eye-linear]"></span>
                </label>
              </label>
              {errors.password && (
                <p className="p-1 text-end text-xs text-error">
                  {errors.password.message}
                </p>
              )}
            </div>
            <p className="text-center text-sm text-error">
              {submit.error && submit.error}
            </p>
            <button
              type="submit"
              className="btn btn-primary shadow-lg shadow-primary/50"
            >
              {submit.pending ? (
                <span className="loading loading-dots"></span>
              ) : (
                "Continue with email"
              )}
            </button>
            <p className="inline-flex justify-center pt-2 text-sm">
              Don't have an account?
              <Link
                to="/signup"
                className="link link-primary ml-2 block text-right text-sm"
              >
                Sign up
              </Link>
            </p>
            <Link
              to="/password/forgot"
              className="l-2 link link-primary mt-2 block text-center text-sm"
            >
              Forgot password?
            </Link>
          </form>
        </div>
      </div>
    </section>
  );
}

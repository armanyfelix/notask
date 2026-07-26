import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import supabase from "../../utils/supabase";

const schema = z
	.object({
		email: z.string().email(),
	})
	.required();
type Inputs = z.infer<typeof schema>;

export default function ForgotPassword() {
	const [submit, setSubmit] = useState<any>({});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Inputs>({
		resolver: zodResolver(schema),
	});

	const onSubmit = async (values: Inputs) => {
		try {
			const { error } = await supabase.auth.resetPasswordForEmail(
				values.email,
				{
					redirectTo: `${import.meta.env.url}/password/reset`,
				},
			);
			if (error) {
				setSubmit({
					...submit,
					error: error.message,
				});
			} else {
				setSubmit({
					...submit,
					success: true,
				});
			}
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<section className="h-screen bg-linear-to-tl from-secondary/10 to-accent/10">
			{submit.success ? (
				<div className="relative top-1/2 flex -translate-y-1/2 flex-col space-y-5 p-5 text-center">
					<h1 className="font-mono text-4xl font-bold tracking-tighter text-primary">
						Email Verification
					</h1>
					<p className="pb-10">
						Please, open the mail we send you to verify your email address and
						change your password.
					</p>
					<p className="pb-10 text-xs text-opacity-50">
						You can close this tab
					</p>
				</div>
			) : (
				<div className="h-full">
					<h1 className="py-16 text-center font-futura text-3xl md:text-4xl">
						Forgot password
					</h1>
					<div className="mx-auto max-w-md space-y-5 px-5 pb-10 font-proto lg:w-2/3">
						<form
							onSubmit={handleSubmit(onSubmit)}
							className="form-control space-y-5"
						>
							<fieldset className="fieldset bg-base-100/50 border-base-100 rounded-box border p-4">
								<label
									className={`input input-bordered flex w-full items-center pl-3 ${
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
								<p className="text-center text-sm font-semibold text-error">
									{submit.error && submit.error}
								</p>
								<button
									type="submit"
									className="btn btn-accent shadow-lg shadow-accent/50"
								>
									{submit.pending ? (
										<span className="loading loading-dots"></span>
									) : (
										"Recover password"
									)}
								</button>
							</fieldset>
							<div className="text-center">
								<p className="inline-flex justify-center pt-2 text-sm">
									Don't have an account?
									<Link
										to="/signup"
										className="link link-accent ml-2 block text-right text-sm"
									>
										Sign up
									</Link>
								</p>
							</div>
						</form>
					</div>
				</div>
			)}
		</section>
	);
}

import supabase from '../../utils/supabase'
import { z } from 'zod'
import { Link, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signal } from '@preact/signals-react'

const schema = z
  .object({
    password: z.string().min(8),
  })
  .required()
type Inputs = z.infer<typeof schema>

const submit = signal<any>({})
const toggleSeePassword = signal<boolean>(false)

export default function ResetPassword() {
  const { code, token } = useParams()

  console.log('code :>> ', code)
  console.log('token :>> ', token)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (values: Inputs) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        values.password,
        {
          redirectTo: `${import.meta.env.url}/password/reset`,
        },
      )
      if (error) {
        submit.value.error = error.message
      } else {
        submit.value.success = true
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <section className="h-screen bg-gradient-to-tl from-secondary/10 to-accent/10">
      {submit.value.success ? (
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
            Reset password
          </h1>
          <div className="mx-auto max-w-md space-y-5 px-5 pb-10 font-proto lg:w-2/3">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="form-control space-y-5"
            >
              <div>
                <label
                  className={`input input-bordered flex items-center pl-3 ${errors.password && 'border-error'}`}
                >
                  <span className="icon-[solar--key-minimalistic-bold-duotone] h-6 w-6"></span>
                  <input
                    className="ml-3 grow"
                    placeholder="New password"
                    {...register('password', {
                      required: 'Password is required',
                    })}
                    aria-invalid={errors.password ? 'true' : 'false'}
                  />
                </label>
                {errors.password && (
                  <p className="p-1 text-end text-xs text-error">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  className={`input input-bordered flex items-center pl-3 ${errors.password && 'border-error'}`}
                >
                  <span className="icon-[solar--key-minimalistic-bold-duotone] h-6 w-6"></span>
                  <input
                    type={toggleSeePassword.value ? 'text' : 'password'}
                    className="ml-3 grow"
                    placeholder="Confirm new password"
                    {...register('password', {
                      required: 'Password  confirmation is required',
                    })}
                    aria-invalid={errors.password ? 'true' : 'false'}
                  />
                  <label className="swap">
                    <input
                      type="checkbox"
                      onClick={() =>
                        (toggleSeePassword.value = !toggleSeePassword.value)
                      }
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
              <p className="text-center text-sm font-semibold text-error">
                {submit.value.error && submit.value.error}
              </p>
              <button
                type="submit"
                className="btn btn-primary shadow-lg shadow-primary/50"
              >
                {submit.value.pending ? (
                  <span className="loading loading-dots"></span>
                ) : (
                  'send mail'
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
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

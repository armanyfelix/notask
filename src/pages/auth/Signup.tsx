import { signal } from '@preact/signals-react'
// import Logo from '../../assets/svgs/logo.svg?react'
import supabase from '../../utils/supabase'
import { z } from 'zod'
import GoogleIcon from '../../assets/icons/google.svg?react'
import GithubIcon from '../../assets/icons/github.svg?react'
import { Link } from 'react-router-dom'
// import { useMemo } from 'preact/hooks'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

const schema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
  })
  .required()

type Inputs = z.infer<typeof schema>

const toggleSeePassword = signal<boolean>(false)
const submit = signal<any>({})
export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  })

  // const navigate = useNavigate()
  // const location = useLocation()
  // const previousLocation = useMemo(
  //   () => location.state?.from?.pathname || '/',
  //   [location],
  // )

  const withGithub = () => {
    supabase.auth.signInWithOAuth({
      provider: 'github',
    })
  }

  const onSubmit = async (value: Inputs) => {
    submit.value.pending = true
    try {
      const { data, error } = await supabase.auth.signUp({
        email: value.email,
        password: value.password,
        options: {
          emailRedirectTo: import.meta.env.VITE_SIGNUP_REDIRECT_TO,
        },
      })
      if (error) {
        submit.value.error = error.message
      } else {
        if (data.user?.user_metadata?.email_verified === false) {
          submit.value.success = true
        } else {
          submit.value.error = 'Account already exist, please sign in.'
        }
      }
    } catch (err) {
      console.log(err)
    }
    submit.value.pending = false
  }

  return (
    <section className="bg-gradient-to-tb h-screen from-accent/10 to-secondary/10">
      {submit.value.success ? (
        <div className="relative top-1/2 flex -translate-y-1/2 flex-col space-y-5 p-5 text-center">
          <h1 className="font-mono text-4xl font-bold tracking-tighter text-primary md:text-6xl">
            Account Confirmation
          </h1>
          <p className="py-20">
            Thank's you for join Notask!, now go to the verification mail we
            send you and click in the verification button to confirm your
            account.
          </p>
          <p className="pb-20 text-xs text-opacity-50">
            You can close this tab
          </p>
        </div>
      ) : (
        <div className="h-full">
          <h1 className="py-16 text-center font-futura text-3xl md:text-4xl">
            Sign up to Notask
          </h1>
          <div className="mx-auto max-w-md space-y-5 px-5 pb-10 font-proto lg:w-2/3">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="form-control space-y-5"
            >
              <div className="flex items-center">
                <button className="btn btn-ghost mr-2 w-full flex-auto bg-white text-gray-700 hover:text-gray-900">
                  <GoogleIcon className="h-7" /> Google
                </button>
                <button
                  className="btn w-full flex-auto bg-gray-950 text-gray-200"
                  onClick={() => withGithub()}
                >
                  <GithubIcon className="h-7 w-7" /> GitHub
                </button>
              </div>
              <div className="divider text-sm">or</div>
              <div>
                <label
                  className={`input input-bordered flex items-center pl-3 ${errors.email && 'border-error'}`}
                >
                  <span className="icon-[solar--letter-bold-duotone] h-6 w-6"></span>
                  <input
                    className="ml-3 grow"
                    placeholder="Email"
                    {...register('email', {
                      required: 'Email address is required',
                    })}
                    aria-invalid={errors.email ? 'true' : 'false'}
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
                  className={`input input-bordered flex items-center pl-3 ${errors.password && 'border-error'}`}
                >
                  <span className="icon-[solar--key-minimalistic-bold-duotone] h-6 w-6"></span>
                  <input
                    id="password"
                    type={toggleSeePassword.value ? 'text' : 'password'}
                    placeholder="Password"
                    className="ml-3 grow"
                    {...register('password', {
                      required: 'Password is required',
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
              <p className="text-center text-sm text-error">
                {submit.value.error && submit.value.error}
              </p>
              <button
                type="submit"
                className="btn btn-primary shadow-lg shadow-primary/50"
              >
                {submit.value.pending ? (
                  <span className="loading loading-dots"></span>
                ) : (
                  'sign up'
                )}
              </button>
              <p className="inline-flex justify-center pt-2 text-sm">
                Already have an account?
                <Link
                  to="/signin"
                  className="link link-primary ml-2 block text-right text-sm"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

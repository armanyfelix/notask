import CheckIcon from '../assets/svgs/check.svg?react'

const includedFeatures = [
  'Private forum access',
  'Member resources',
  'Entry to annual conference',
  'Official member t-shirt',
]

export default function PricingSection() {
  return (
    <div className="w-full">
      <div className="mx-1">
        <div className="mx-auto sm:text-center">
          <h2 className="mb-10 text-3xl font-bold tracking-tight sm:text-4xl">
            Simple no-tricks pricing
          </h2>
          {/* <p className="mt-6 text-lg leading-8 text-gray-600">
            Distinctio et nulla eum soluta et neque labore quibusdam. Saepe et
            quasi iusto modi velit ut non voluptas in. Explicabo id ut laborum.
          </p> */}
          <PricingCard />
          <PricingCard />
          <PricingCard />
        </div>
      </div>
    </div>
  )
}

const PricingCard = () => {
  return (
    <div className="scale-90 rounded-3xl ring-1 ring-base-300 lg:flex">
      <div className="p-5">
        <h3 className="text-2xl font-bold tracking-tight">
          Lifetime membership
        </h3>
        {/* <p className="mt-6 text-base leading- text-gray-600">
        Lorem ipsum dolor sit amet consect etur adipisicing elit. Itaque
        amet indis perferendis blanditiis repellendus etur quidem
        assumenda.
      </p> */}
        <div className="mt-9 flex items-center gap-x-4">
          <h4 className="flex-none text-sm font-semibold leading-6 text-secondary">
            What’s included
          </h4>
          <div className="h-px flex-auto bg-base-200" />
        </div>
        <ul
          role="list"
          className="mt- grid grid-cols-1 gap-1 text-sm leading-6 text-primary-content sm:grid-cols-2 sm:gap-2"
        >
          {includedFeatures.map((feature) => (
            <li key={feature} className="flex gap-x-2">
              <CheckIcon
                className="h-6 w-5 flex-none text-indigo-600"
                aria-hidden="true"
              />
              {feature}
            </li>
          ))}
        </ul>
      </div>
      <div className="mx-auto mt-3 p-4 lg:mt-0 lg:max-w-xs">
        <div className="rounded-2xl bg-base-100 p-3 text-center ring-1 ring-inset ring-base-content lg:flex lg:flex-col lg:justify-center">
          <div className="py-3">
            <p className="text-base font-semibold">Pay once, own it forever</p>
            <p className="mt- gap-x- flex items-baseline justify-center">
              <span className="text-4xl font-bold tracking-tight text-accent">
                $349
              </span>
              <span className="text-xs font-semibold leading-6 tracking-wide">
                USD
              </span>
            </p>
            <a href="#" className="btn btn-primary btn-sm px-10">
              Get access
            </a>
            <p className="mt-4 text-xs">
              Invoices and receipts available for easy company reimbursement
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

import { Dialog } from 'react-aria-components'

export default function Confirm() {
  return (
    <Dialog
    // open={open.value}
    // onClose={() => (open.value = false)}
    >
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-lg"
        aria-hidden="true"
      />
      {/* <Dialog.Panel className='card fixed inset-1 z-50 m-auto h-fit max-w-lg bg-base-300'>
        <div className='card-body items-center space-y-3 text-center'>
          <Dialog.Title
            className={`card-title text-3xl ${
              data.value?.type === "delete"
                ? "text-error"
                : data.value?.type === "success"
                  ? "text-success"
                  : data.value?.type === "warning"
                    ? "text-warning"
                    : ""
            } `}
          >
            {data.value?.title}
          </Dialog.Title>
          <Dialog.Description className='py-3 text-xl lg:mx-14'>
            Are you sure you want to delete{" "}
            <span className='font-semibold text-primary'>
              {data.value?.element?.name}
            </span>
            ?
          </Dialog.Description>

          <div className='card-actions'>
            <button
              className='btn btn-outline mr-10'
              onClick={() => (open.value = false)}
            >
              Cancel
            </button>
            <button
              className='btn btn-error'
              onClick={() => handleConfirm(data.value?.element, data.value?.index)}
            >
              Delete
            </button>
          </div>
        </div>
      </Dialog.Panel> */}
    </Dialog>
  )
}

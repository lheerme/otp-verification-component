import { Toaster } from 'sonner'
import { Form } from './components/Form'

function App() {
  return (
    <main className="w-full min-h-svh flex items-center justify-center px-4">
      <Toaster
        richColors
        position="top-center"
        toastOptions={{
          classNames: {
            loading:
              'bg-[#1A2036] text-[#B1B9D8] drop-shadow-[0_4px_4px_#00000025]',
          },
        }}
        closeButton
      />
      <div className="bg-[#252B42] w-full max-w-[736px] desktop:max-w-[996px] h-[365px] sm:h-[532px] desktop:h-[662px] p-4 rounded-3xl flex flex-col items-center justify-center gap-2 sm:gap-4 drop-shadow-[0_10px_25px_#111628]">
        <h1 className="text-xl sm:text-[26px] text-[#B1B9D8] text-center font-merriweather font-bold">
          Verify your email address
        </h1>
        <p className="text-xs sm:text-sm text-center w-full max-w-[493px]">
          A four-digit code has been sent to your email name@frontendpro.dev.
          Please enter the code below to verify your email address.
        </p>
        <Form />
      </div>
    </main>
  )
}

export default App

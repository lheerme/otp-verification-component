import {
  ChangeEvent,
  ClipboardEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { twMerge } from 'tailwind-merge'
import { toast } from 'sonner'

export function Form() {
  const [otp, setOtp] = useState(new Array(4).fill(''))
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null)
  const [isHandlingSubmit, setIsHandlingSubmit] = useState(false)
  const genericOtp = 1234
  const inputRefs = useRef<HTMLInputElement[] | null>([])

  const resolveAfter2Sec = () =>
    new Promise((resolve) =>
      setTimeout(() => resolve({ name: 'Sonner' }), 2000)
    )
  const rejectAfter2Sec = () =>
    new Promise((_, reject) =>
      setTimeout(() => reject({ name: 'Sonner' }), 2000)
    )

  useEffect(() => {
    if (inputRefs.current) {
      inputRefs.current[0].focus()
    }
  }, [])

  function handleChange(index: number, event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value.substring(event.target.value.length - 1)
    if (isSuccess !== null) setIsSuccess(null)

    if (isNaN(Number(value))) {
      if (inputRefs.current) inputRefs.current[index].value = ''
      return
    }

    const newOtp = [...otp]

    newOtp[index] = value
    setOtp(newOtp)

    if (inputRefs.current) {
      if (value && index < 4 - 1) {
        inputRefs.current[index + 1].focus()
      }
    }
  }

  function handleClick(index: number) {
    if (inputRefs.current) {
      if (index > 0 && !otp[index - 1]) {
        inputRefs.current[otp.indexOf('')].focus()
      }
    }
  }

  function handleKeyDown(index: number, event: KeyboardEvent) {
    if (inputRefs.current) {
      inputRefs.current[index].setSelectionRange(1, 1)

      if (
        event.key === 'Backspace' &&
        !otp[index] &&
        index > 0 &&
        inputRefs.current[index - 1]
      ) {
        inputRefs.current[index - 1].focus()
      }
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (inputRefs.current) {
      if (!otp.every((value) => value)) {
        inputRefs.current[otp.indexOf('')].focus()
        return
      }

      if (otp.every((value) => value)) {
        const otpValue = Number(otp.join(''))
        setIsHandlingSubmit(true)

        if (otpValue === genericOtp) {
          toast.promise(resolveAfter2Sec, {
            loading: 'Checking OTP...',
            success: () => {
              setIsSuccess(true)
              return `Your email is verified!`
            },
            error: 'Invalid OTP.',
            onDismiss: () => {
              toast.info(
                "You'll be redirected to another page within 4 seconds"
              )
              setTimeout(() => window.location.reload(), 4000)
            },
            onAutoClose: () => {
              toast.info(
                "You'll be redirected to another page within 4 seconds"
              )
              setTimeout(() => window.location.reload(), 4000)
            },
          })
        } else {
          toast.promise(rejectAfter2Sec, {
            loading: 'Checking OTP...',
            success: () => {
              return `Your email is verified!`
            },
            error: () => {
              setIsSuccess(false)
              return 'Invalid OTP'
            },
            onDismiss: () => {
              toast.info('1234 is the valid OTP')
              setIsHandlingSubmit(false)
            },
            onAutoClose: () => {
              toast.info('1234 is the valid OTP')
              setIsHandlingSubmit(false)
            },
          })
        }
      }
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLFormElement>) {
    const textCopied = event.clipboardData.getData('Text')
    if (isNaN(Number(textCopied))) return

    let prevOtp = textCopied.split('')

    if (prevOtp.length > 4) {
      prevOtp = prevOtp.slice(0, 4)
    }

    while (prevOtp.length < 4) {
      prevOtp.push('')
    }

    if (inputRefs.current) {
      if (prevOtp.every((value) => value)) {
        inputRefs.current[3].focus()
      }

      if (!prevOtp.every((value) => value)) {
        event.preventDefault()
        inputRefs.current[prevOtp.indexOf('')].focus()
      }
    }

    setOtp(prevOtp)
  }

  return (
    <form
      onSubmit={handleSubmit}
      onPaste={handlePaste}
      className="w-full flex flex-col items-center gap-8 mt-8"
    >
      <div className="w-full max-w-[280px] tablet:max-w-[395px] sm:max-w-xl desktop:max-w-3xl flex justify-between">
        {otp.map((_, index) => (
          <input
            key={index}
            ref={(ref) => inputRefs.current?.push(ref!)}
            value={otp[index]}
            type="text"
            inputMode="numeric"
            data-testid="input"
            className={twMerge(
              'w-[60px] tablet:w-[90px] sm:w-[130px] desktop:w-[173px] h-[85px] tablet:h-[115px] sm:h-[165px] desktop:h-[208px] bg-[#1A2036] opacity-70 text-[#B1B9D8] font-merriweather font-bold text-5xl tablet:text-7xl sm:text-8xl desktop:text-9xl text-center rounded-md drop-shadow-[0_4px_4px_#00000025] ring-2 ring-[#B1B9D8] placeholder:text-[#2E3650] outline-none focus:ring-2 focus:ring-[#B1B9D8] hover:ring-2 hover:ring-[#B1B9D8] transition-all placeholder-shown:ring-0 caret-transparent cursor-pointer',
              isSuccess === null && null,
              isSuccess === true &&
                'ring-green-700 focus:ring-green-700 hover:ring-green-700',
              isSuccess === false &&
                'ring-red-500 focus:ring-red-500 hover:ring-red-500',
              inputRefs.current
                ? document.activeElement === inputRefs.current[index] &&
                    'opacity-100'
                : null
            )}
            placeholder="0"
            maxLength={1}
            onChange={(event) => handleChange(index, event)}
            onClick={() => handleClick(index)}
            onKeyDown={(event) => handleKeyDown(index, event)}
          />
        ))}
      </div>
      <button
        type="submit"
        disabled={isHandlingSubmit}
        className="bg-[#1A2036] text-white text-sm sm:text-base drop-shadow-[0_7px_0_#2e3650] active:drop-shadow-[0_4px_0_#2e3650] active:translate-y-[3px] transition-all p-2 sm:p-4 w-full max-w-72 sm:max-w-[442px] rounded-md disabled:pointer-events-none disabled:opacity-75"
      >
        Verify OTP
      </button>
    </form>
  )
}

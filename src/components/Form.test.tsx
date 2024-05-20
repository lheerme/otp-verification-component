import '@testing-library/jest-dom'
import { describe, expect, it } from 'vitest'
import { Form } from './Form'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import App from '../App'

describe('Form', () => {
  it('Should have 4 empty inputs', () => {
    render(<Form />)
    const inputFields = screen.getAllByTestId('input')
    expect(inputFields).toHaveLength(4)

    inputFields.forEach((input) => {
      expect(input).toHaveValue('')
    })
  })

  it('Each empty field should only accept one value', () => {
    render(<Form />)
    const inputFields = screen.getAllByTestId('input') as HTMLInputElement[]
    expect(inputFields).toHaveLength(4)

    inputFields.forEach((input) => {
      fireEvent.change(input, { target: { value: '123' } })
      expect(input.value).toBe('3')
    })
  })

  it('Should only accept numbers', () => {
    render(<Form />)
    const inputFields = screen.getAllByTestId('input') as HTMLInputElement[]
    expect(inputFields).toHaveLength(4)

    inputFields.forEach((input) => {
      fireEvent.change(input, { target: { value: 'xesq' } })
      expect(input.value).toBe('')
    })

    inputFields.forEach((input) => {
      fireEvent.change(input, { target: { value: '6' } })
      expect(input.value).toBe('6')
    })
  })

  it('Should submit only if all input are filled', () => {
    render(<Form />)
    const inputFields = screen.getAllByTestId('input') as HTMLInputElement[]
    const submitButton = screen.getByRole('button', {
      name: /verify otp/i,
    }) as HTMLButtonElement

    fireEvent.change(inputFields[0], { target: { value: '1' } })
    fireEvent.change(inputFields[1], { target: { value: '2' } })

    fireEvent.click(submitButton)

    expect(document.activeElement).toBe(inputFields[2])
  })

  it('Should move focus to the next input when value is entered', () => {
    render(<Form />)
    const inputFields = screen.getAllByTestId('input') as HTMLInputElement[]

    fireEvent.change(inputFields[0], { target: { value: '1' } })
    expect(document.activeElement).toBe(inputFields[1])
    fireEvent.change(inputFields[1], { target: { value: '2' } })
    expect(document.activeElement).toBe(inputFields[2])
    fireEvent.change(inputFields[2], { target: { value: '3' } })
    expect(document.activeElement).toBe(inputFields[3])
  })

  it('Should moves focus to the previous input when backspace is pressed', () => {
    render(<Form />)
    const inputFields = screen.getAllByTestId('input') as HTMLInputElement[]

    fireEvent.change(inputFields[0], { target: { value: '1' } })
    fireEvent.change(inputFields[1], { target: { value: '2' } })
    fireEvent.keyDown(inputFields[2], { key: 'Backspace' })

    expect(inputFields[1]).toHaveFocus()
  })

  it('Should not submit form with invalid OTP', async () => {
    render(<App />)

    const inputFields = screen.getAllByTestId('input') as HTMLInputElement[]
    const submitButton = screen.getByRole('button', {
      name: /verify otp/i,
    }) as HTMLButtonElement
    inputFields.forEach((input) => {
      fireEvent.change(input, { target: { value: '6' } })
    })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/checking otp/i)).toBeVisible()
    })

    await waitFor(
      () => {
        expect(screen.getByText(/invalid otp/i)).toBeVisible()
      },
      { timeout: 10000 }
    )
  })

  it('Should submit form with valid OTP', async () => {
    render(<App />)

    const inputFields = screen.getAllByTestId('input') as HTMLInputElement[]
    const submitButton = screen.getByRole('button', {
      name: /verify otp/i,
    }) as HTMLButtonElement
    fireEvent.change(inputFields[0], { target: { value: '1' } })
    fireEvent.change(inputFields[1], { target: { value: '2' } })
    fireEvent.change(inputFields[2], { target: { value: '3' } })
    fireEvent.change(inputFields[3], { target: { value: '4' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/checking otp/i)).toBeVisible()
    })

    await waitFor(
      () => {
        expect(screen.getByText(/your email is verified/i)).toBeVisible()
      },
      { timeout: 10000 }
    )
  })
})

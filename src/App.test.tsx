import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App.tsx'

// O App está renderizando
describe('App', () => {
  it('Should be able to see the initial component', () => {
    render(<App />)

    expect(screen.getByText('Verify your email address')).toBeVisible()
  })
})

// Login component tests
// spec: see FullStackProject-Sem3_33099103.pdf

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Login from '../components/auth/Login'
import { AuthProvider } from '../context/AuthContext'

// Mock the API
vi.mock('../services/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn()
  }
}))

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('Login Component', () => {
  it('renders login form', () => {
    renderLogin()
    
    expect(screen.getByText(/Login to EduNexus/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument()
  })

  it('shows validation for empty fields', async () => {
    renderLogin()
    
    const submitButton = screen.getByRole('button', { name: /Login/i })
    fireEvent.click(submitButton)
    
    // HTML5 validation will prevent submission
    expect(screen.getByLabelText(/Email Address/i)).toBeInvalid()
  })

  it('allows user to type in input fields', () => {
    renderLogin()
    
    const emailInput = screen.getByLabelText(/Email Address/i)
    const passwordInput = screen.getByLabelText(/Password/i)
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    
    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('password123')
  })

  it('displays demo credentials', () => {
    renderLogin()
    
    expect(screen.getByText(/Demo Credentials:/i)).toBeInTheDocument()
    expect(screen.getByText(/admin@edunexus.com/i)).toBeInTheDocument()
    expect(screen.getByText(/instructor@edunexus.com/i)).toBeInTheDocument()
    expect(screen.getByText(/student1@edunexus.com/i)).toBeInTheDocument()
  })

  it('has link to register page', () => {
    renderLogin()
    
    const registerLink = screen.getByText(/Register here/i)
    expect(registerLink).toBeInTheDocument()
    expect(registerLink).toHaveAttribute('href', '/register')
  })
})
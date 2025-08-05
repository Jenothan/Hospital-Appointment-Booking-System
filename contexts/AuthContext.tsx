"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'



interface User {
  id: string
  name: string
  email: string
  role: 'doctor' | 'patient' | 'receptionist' | 'admin'
  profileImage?: string
  phone?: string
  dateOfBirth?: string
  address?: string
  emergencyContact?: string
  medicalHistory?: string[]
  allergies?: string[]
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  setUser: (user: User | null) => void
  signup: (userData: SignupData) => Promise<boolean>
  updateProfile: (userData: Partial<User>) => Promise<boolean>
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>
  deleteAccount: () => Promise<boolean>
  deleteStaff: (id: string) => Promise<boolean>
  logout: () => void
  resetPassword: (email: string, newPassword: string) => Promise<boolean>
  isLoading: boolean
}

interface SignupData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])


  const deleteStaff = async (id: string): Promise<boolean> => {
  try {
    // Remove staff from users list
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const updatedUsers = users.filter((u: User) => u.id !== id)
    localStorage.setItem('users', JSON.stringify(updatedUsers))

    // Remove from credentials
    const credentials = JSON.parse(localStorage.getItem('credentials') || '[]')
    const updatedCreds = credentials.filter((cred: any) => cred.email !== users.find((u: User) => u.id === id)?.email)
    localStorage.setItem('credentials', JSON.stringify(updatedCreds))
    
    return true
  } catch (error) {
    return false
  }
}

  const resetPassword = async (email: string, newPassword: string): Promise<boolean> => {
  try {
    const credentials = JSON.parse(localStorage.getItem('credentials') || '[]')
    const credIndex = credentials.findIndex((cred: any) => cred.email === email)

    if (credIndex === -1) {
      alert("Email not found")
      return false
    }

    credentials[credIndex].password = newPassword
    localStorage.setItem('credentials', JSON.stringify(credentials))
    alert("Password reset successful!")
    return true
  } catch (error) {
    console.error("Reset password error:", error)
    return false
  }
}



  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      if (!user) return false

      const updatedUser = { ...user, ...userData }
      
      // Update in users array
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const userIndex = users.findIndex((u: User) => u.id === user.id)
      if (userIndex !== -1) {
        users[userIndex] = updatedUser
        localStorage.setItem('users', JSON.stringify(users))
      }

      // Update current user
      setUser(updatedUser)
      localStorage.setItem('currentUser', JSON.stringify(updatedUser))
      
      return true
    } catch (error) {
      console.error('Update profile error:', error)
      return false
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      if (!user) return false

      // Check current password
      const credentials = JSON.parse(localStorage.getItem('credentials') || '[]')
      const userCredential = credentials.find((cred: any) => cred.email === user.email)
      
      if (!userCredential || userCredential.password !== currentPassword) {
        alert('Current password is incorrect')
        return false
      }

      // Update password
      const credIndex = credentials.findIndex((cred: any) => cred.email === user.email)
      if (credIndex !== -1) {
        credentials[credIndex].password = newPassword
        localStorage.setItem('credentials', JSON.stringify(credentials))
        return true
      }
      
      return false
    } catch (error) {
      console.error('Change password error:', error)
      return false
    }
  }

  const deleteAccount = async (): Promise<boolean> => {
    try {
      if (!user) return false

      // Remove from users
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const filteredUsers = users.filter((u: User) => u.id !== user.id)
      localStorage.setItem('users', JSON.stringify(filteredUsers))

      // Remove credentials
      const credentials = JSON.parse(localStorage.getItem('credentials') || '[]')
      const filteredCredentials = credentials.filter((cred: any) => cred.email !== user.email)
      localStorage.setItem('credentials', JSON.stringify(filteredCredentials))

      // Logout
      logout()
      
      return true
    } catch (error) {
      console.error('Delete account error:', error)
      return false
    }
  }

  const signup = async (userData: SignupData): Promise<boolean> => {
    try {
      // Get existing users
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')
      
      // Check if user already exists
      const userExists = existingUsers.some(
        (user: User) => user.email === userData.email
      )
      
      if (userExists) {
        alert('User with this email or username already exists')
        return false
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        role: 'patient' // All signups are automatically patients
      }

      // Save user data (in real app, this would be sent to backend)
      const users = [...existingUsers, newUser]
      localStorage.setItem('users', JSON.stringify(users))
      
      // Save user credentials (in real app, password would be hashed)
      const credentials = JSON.parse(localStorage.getItem('credentials') || '[]')
      credentials.push({
        email: userData.email,
        password: userData.password // In real app, this would be hashed
      })
      localStorage.setItem('credentials', JSON.stringify(credentials))

      // Auto-login after successful signup
      setUser(newUser)
      localStorage.setItem('currentUser', JSON.stringify(newUser))
      
      return true
    } catch (error) {
      console.error('Signup error:', error)
      return false
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    const redirectToDashboard = (role: string) => {
  switch (role) {
    case 'admin':
      router.push('/admin/appointments')
      break
    case 'doctor':
      router.push('/doctor/appointments')
      break
    case 'receptionist':
      router.push('/receptionist/appointments')
      break
    case 'patient':
      router.push('/patient/home')
      break
    default:
      router.push('/home')
  }
}

  try {
    const ADMIN_EMAIL = "admin@novacare.com"
    const ADMIN_PASSWORD = "admin123"


    // Static admin login
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser: User = {
        id: 'admin-id',
        name: 'Admin',
        email: ADMIN_EMAIL,
        role: 'admin',
      }

      setUser(adminUser)
      localStorage.setItem('currentUser', JSON.stringify(adminUser))
      redirectToDashboard('admin')
      return true
    }

    // Regular user login
    const credentials = JSON.parse(localStorage.getItem('credentials') || '[]')
    const validCredential = credentials.find(
      (cred: any) => cred.email === email && cred.password === password
    )

    if (!validCredential) {
      alert('Invalid email or password')
      return false
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const userData = users.find((user: User) => user.email === email)

    if (!userData) {
      alert('User data not found')
      return false
    }

    setUser(userData)
    localStorage.setItem('currentUser', JSON.stringify(userData))
    redirectToDashboard(userData.role)
    return true
  } catch (error) {
    console.error('Login error:', error)
    return false
  }
}


  const logout = () => {
    setUser(null)
    localStorage.removeItem('currentUser')
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, login,setUser, signup, updateProfile, changePassword, deleteAccount, deleteStaff, resetPassword, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
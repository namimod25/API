import { AuthState } from '@/types/auth'
import {create} from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const useAuthStore = create<AuthState>((set)=>({
    user: null,
    token: null,
    isLoading: false,

    setToken: async (user, token) => {
        const authData = {
            user: user,
            token: token
        }
        await AsyncStorage.setItem('auth', JSON.stringify(authData))
        set({ user, token })
    },
    loadToken: async () => {
        set({ isLoading: true })
        try {
            const authData = await AsyncStorage.getItem('auth')
            
            if (authData) {
                const { user, token } = JSON.parse(authData)
                set({ user, token })
            }
        } catch (error) {
            console.error('Failed to load token', error)
        } finally {
            set({ isLoading: false })
        }
    },
    removeToken: async() => {
        await AsyncStorage.removeItem('auth')
        set({ user: null, token: null })
    }
}) )

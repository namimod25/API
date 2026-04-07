import { SafeAreaView } from 'react-native-safe-area-context'
import {ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View} from 'react-native'
import { Link, useRouter } from 'expo-router'
import { useState } from 'react'
import API from '@/config/koneksi'
import { useAuthStore } from '@/store/authStore'

const RegisterScreen = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [fullname, setFullname] = useState("")
    const [username, setUsername] = useState("")
    const [loading, setLoading] = useState(false)

    const setTokenData = useAuthStore((state) => state.setToken)
    const router = useRouter()

    const handleRegister =async () => {
        setLoading(true)

        try {
            const {data} = await API.post('/auth/register' ,{
                email: email,
                password: password,
                username: username,
                fullname: fullname
            });
            

            await setTokenData(data.data, data.token);
            Alert.alert("Success","berhasil Register", [
                {
                    
                    onPress: () => router.replace('/(tabs)')
                }
            ]);
        } catch (error: any) {
            console.log("Full error object:", error);
            let message = "Terjadi kesalahan koneksi ke server";
            
            if (error.response) {
                const errorMsg = error.response.data.message;
                message = Array.isArray(errorMsg) ? errorMsg[0] : errorMsg;
            } else if (error.request) {
                message = "Tidak ada respon dari server. Pastikan IP API benar dan server sudah jalan.";
            } else {
                message = error.message;
            }
            
            Alert.alert("Error", message);
        } finally {
            setLoading(false)
        }
    }

  return (
    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === 'ios'?"padding": 'height'}>
    <SafeAreaView className="flex-1 justify-center px-8 bg-bacground">
            {/* Logo */}
            <View className='items-center'>
                <Text className='text-4xl font-semibold text-black'>Create New Account</Text>
                <Text className='text-gray-500'>Bergabung dan mulai berbagi momen Anda 😊</Text>
            </View>
            {/* form */}
            <View className='mt-5'>
                <TextInput placeholder='fullname' className='bg-gray-200 rounded-xl mb-4 text-base ' autoCapitalize='none' value={fullname} onChangeText={setFullname}/>
            </View>
            <View className='mt-5'>
                <TextInput placeholder='username' className='bg-gray-200 rounded-xl mb-4 text-base 'autoCapitalize='none' value={username} onChangeText={setUsername}/>
            </View>
            <View className='mt-5'>
                <TextInput placeholder='email' className='bg-gray-200 rounded-xl mb-4 text-base ' value={email} onChangeText={setEmail} keyboardType='email-address' autoCapitalize='none'/>
            </View>
            <View className='mt-5'>
                <TextInput placeholder='password' secureTextEntry={true} className='bg-gray-200 rounded-xl mb-4 text-base 'value={password}onChangeText={setPassword}/>
    
                <TouchableOpacity className='bg-active p-4 rounded-xl items-center mb-6' onPress={handleRegister}
                
                >
                   {loading ? (
                    <ActivityIndicator color="#fff"/>
                   ): (
                    <Text className='text-white font-semibold text-base'>Register</Text>
                   )}
                    
                </TouchableOpacity>
            </View>
            {/* Footer */}
            <View className='items-center mt-8 mb-10 flex-row justify-center'>
                <Text className='text-gray-500'>Sudah punya akun? </Text>
                <Link href='/(auth)' className='text-active font-semibold'>Login</Link>
            </View>
        </SafeAreaView>
        </KeyboardAvoidingView>
  )
}

export default RegisterScreen
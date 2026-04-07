import API from '@/config/koneksi'
import { useAuthStore } from '@/store/authStore'
import { useRouter, Link } from 'expo-router'
import { useState } from 'react'
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const LoginScreen = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const setTokenData = useAuthStore((state) => state.setToken)
    const router = useRouter()

    const handleLogin =async () => {
        setLoading(true)

        try {
            const {data} = await API.post('/auth/login' ,{
                email: email,
                password: password
            });
            

            await setTokenData(data.data, data.token);
            Alert.alert("Success","berhasil Login", [
                {
                    text: 'OK',
                    onPress: () => router.replace('/(tabs)')
                }
            ]);
        } catch (error) {
           console.log(error);
           
        } finally {
            setLoading(false)
        }
    }


  return (
    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === 'ios'?"padding": 'height'}>
    <SafeAreaView className="flex-1 justify-center px-8 bg-bacground">
        {/* Logo */}
        <View className='items-center'>
            <Text className='text-4xl font-title text-black'>Vibe</Text>
            <Text className='text-gray-500 mt-2'>Selamat Datang kembali😊</Text>
        </View>
        {/* form */}
        <View className='mt-5'>
            <TextInput placeholder='email' className='bg-gray-200 rounded-xl mb-4 text-base ' value={email} onChangeText={setEmail} keyboardType='email-address' autoCapitalize='none'/>
        </View>
        <View className='mt-5'>
            <TextInput placeholder='password' className='bg-gray-200 rounded-xl mb-4 text-base ' value={password} onChangeText={setPassword} secureTextEntry/>

            <TouchableOpacity className='bg-active p-4 rounded-xl items-center mb-6' onPress={handleLogin} disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="#fff"/>
                ): (
                     <Text className='text-white font-semibold text-base'>Login</Text>
                )}
            </TouchableOpacity>
        </View>
        {/* Footer */}
        <View className='items-center mt-8 mb-10 flex-row justify-center'>
            <Text className='text-gray-500'>Belum punya akun? </Text>
            <Link href='/(auth)/register' className='text-active font-semibold'>SignUp</Link>
        </View>
    </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen

//flex-1 bg-[#F8F9FE] px-8 justify-center items-center
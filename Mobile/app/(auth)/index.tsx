import { Link } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const LoginScreen = () => {
  return (
    <SafeAreaView className="flex-1 justify-center px-8 bg-bacground">
        {/* Logo */}
        <View className='items-center'>
            <Text className='text-4xl font-title text-black'>Vibe</Text>
            <Text className='text-gray-500 mt-2'>Selamat Datang kembali😊</Text>
        </View>
        {/* form */}
        <View className='mt-5'>
            <TextInput placeholder='email' className='bg-gray-200 rounded-xl mb-4 text-base '/>
        </View>
        <View className='mt-5'>
            <TextInput placeholder='password' className='bg-gray-200 rounded-xl mb-4 text-base '/>

            <TouchableOpacity className='bg-active p-4 rounded-xl items-center mb-6'>
                <Text className='text-white font-semibold text-base'>Login</Text>
            </TouchableOpacity>
        </View>
        {/* Footer */}
        <View className='items-center mt-8 mb-10 flex-row justify-center'>
            <Text className='text-gray-500'>Belum punya akun? </Text>
            <Link href='/(auth)/register' className='text-active font-semibold'>SignUp</Link>
        </View>
    </SafeAreaView>
  )
}

export default LoginScreen
//flex-1 bg-[#F8F9FE] px-8 justify-center items-center
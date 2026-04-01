import { SafeAreaView } from 'react-native-safe-area-context'
import {Text, TextInput, TouchableOpacity, View} from 'react-native'
import { Link } from 'expo-router'

const RegisterScreen = () => {

  return (
    <SafeAreaView className="flex-1 justify-center px-8 bg-bacground">
            {/* Logo */}
            <View className='items-center'>
                <Text className='text-4xl font-semibold text-black'>Create New Account</Text>
                <Text className='text-gray-500'>Bergabung dan mulai berbagi momen Anda 😊</Text>
            </View>
            {/* form */}
            <View className='mt-5'>
                <TextInput placeholder='fullname' className='bg-gray-200 rounded-xl mb-4 text-base '/>
            </View>
            <View className='mt-5'>
                <TextInput placeholder='username' className='bg-gray-200 rounded-xl mb-4 text-base '/>
            </View>
            <View className='mt-5'>
                <TextInput placeholder='email' className='bg-gray-200 rounded-xl mb-4 text-base '/>
            </View>
            <View className='mt-5'>
                <TextInput placeholder='password' className='bg-gray-200 rounded-xl mb-4 text-base '/>
    
                <TouchableOpacity className='bg-active p-4 rounded-xl items-center mb-6'>
                    <Text className='text-white font-semibold text-base'>Register</Text>
                </TouchableOpacity>
            </View>
            {/* Footer */}
            <View className='items-center mt-8 mb-10 flex-row justify-center'>
                <Text className='text-gray-500'>Sudah punya akun? </Text>
                <Link href='/(auth)' className='text-active font-semibold'>Login</Link>
            </View>
        </SafeAreaView>
  )
}

export default RegisterScreen
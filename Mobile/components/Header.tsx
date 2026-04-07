import { Feather } from '@expo/vector-icons'
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'expo-router'


const Header = () => {
    const {removeToken} = useAuthStore()
    const router = useRouter()

  const handleLogout = async() => {
    try {
        await removeToken();
        Alert.alert("logout", "Berhasil logout", [
          {
            
            onPress: () => router.replace("/(auth)")
          }
        ])
    } catch (error) {
        console.log(error);
        
    }
  }

  return (
    <View className='justify-between flex-row items-center bg-bacground px-2 py-5'>
      <Text className='text-black text-3xl font-title'>VibeGram</Text>
      <TouchableOpacity onPress={handleLogout}>
        <Feather name='log-out' color={'red'} size={26}/>
      </TouchableOpacity>
    </View>
  )
}

export default Header
import { Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const createScreen = () => {
  return (
   <SafeAreaView>
             <Text className='text-red-500 text-center'>tambah profile</Text>
    </SafeAreaView>
  )
}

export default createScreen
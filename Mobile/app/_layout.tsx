import { Stack } from "expo-router";
import {useFonts} from 'expo-font'
import { ActivityIndicator, View } from "react-native";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export default function RootLayout() {
  const [fonts] = useFonts({
    MonteCarloRegular: require('../assets/font/MonteCarlo/MonteCarlo-Regular.ttf'),
    MonsieurLaDoulaiseRegular: require('../assets/font/Monsieur_La_Doulaise/MonsieurLaDoulaise-Regular.ttf'),
    PinyonScriptRegular: require("../assets/font/Pinyon_Script/PinyonScript-Regular.ttf"),
  });

  const {token, isLoading, loadToken, user} = useAuthStore()


  useEffect(() => {
    loadToken();
  }, [loadToken]);

  if(!fonts || isLoading){
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size={"large"}/>
      </View>
    );
  }

  return (
    <Stack screenOptions={{headerShown: false}}>
      {!token || !user ? (
       
        <Stack.Screen name="(auth)"/>
      ): (
          <Stack.Screen name="(tabs)"/>
      )}
    </Stack>
  );
}
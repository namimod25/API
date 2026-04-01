import { Stack } from "expo-router";
import {useFonts} from 'expo-font'
import { View } from "react-native";

export default function RootLayout() {
  const [fonts] = useFonts({
    MonteCarloRegular: require('../assets/font/MonteCarlo/MonteCarlo-Regular.ttf'),
    MonsieurLaDoulaiseRegular: require('../assets/font/Monsieur_La_Doulaise/MonsieurLaDoulaise-Regular.ttf'),
    PinyonScriptRegular: require("../assets/font/Pinyon_Script/PinyonScript-Regular.ttf"),
  })

  if(!fonts) return <View></View>;

  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="(tabs)"/>
      {/* <Stack.Screen name="(auth)"/> */}
    </Stack>
  )
}
import { Text } from "react-native";
import "../global.css";
import  { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center align-bottom bg-white">
    <Text className="text-xl font-bold text-red-400">expo-native</Text>
    </SafeAreaView>
  );
}

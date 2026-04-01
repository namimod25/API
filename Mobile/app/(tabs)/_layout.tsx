import { colors } from '@/utils/color';
import {Feather} from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Dimensions, View } from 'react-native';


 const  TabsLayout = () => {
    
    const {width, height} = Dimensions.get('window')

    const buttonSize = width * 0.19

    return(
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: colors.active,
                tabBarInactiveTintColor: "gray",

                tabBarStyle: {
                    backgroundColor: colors.bacground,
                    paddingTop: height * 0.02,
                    marginHorizontal: width * 0.05,
                    bottom: height * 0.04,
                    borderRadius: buttonSize / 4,
                },

                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "",
                    tabBarIcon: ({color, size}) => (
                        <Feather name='home' size={size} color={color}/>
                    )
                }}
            />
             <Tabs.Screen
                name="search"
                options={{
                    title: "",
                    tabBarIcon: ({color, size}) => (
                        <Feather name='search' size={size} color={color}/>
                    )
                }}
            />
             <Tabs.Screen
                name="create"
                options={{
                    title: "",
                    tabBarIcon: ({focused}) => (
                        <View style={{
                            width: width * 0.17,
                            height: width * 0.17,
                            borderRadius: buttonSize / 2,
                            backgroundColor: colors.active,
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <Feather name='plus' size={30} color='black'/>
                        </View>
                    )
                }}
            />
             <Tabs.Screen
                name="update"
                options={{
                    title: "",
                    tabBarIcon: ({color, size}) => (
                        <Feather name='settings' size={size} color={color}/>
                    )
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "",
                    tabBarIcon: ({color, size}) => (
                        <Feather name='user' size={size} color={color}/>
                    )
                }}
            />

        </Tabs>
    );
};

export default TabsLayout;
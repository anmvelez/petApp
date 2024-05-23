import React, { useEffect, useState } from 'react'
import { Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { theme } from './src/core/theme'
import {
  StartScreen,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  Dashboard,
  MapScreen,
  ProfileScreen,
  DogWalkersScreen,
} from './src/screens'
import { LoginProvider } from './src/context/LoginContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ActivityIndicator, Colors } from 'react-native-paper'
import NetInfo from '@react-native-community/netinfo'
import { updateUserStatus } from './src/services/api'
import { AppState } from 'react-native'
import EditProfileScreen from './src/screens/EditProfileScreen'
import WalkerDetailsPage from './src/screens/WalkerDetailScreen '

const MyComponent = () => (
  <ActivityIndicator animating={true} color={Colors.red800} />
)

const Stack = createStackNavigator()

export default function App() {
  const [user, setUser] = useState(null)
  const [isOnline, setIsOnline] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active') {
        console.log('La aplicación regresó a primer plano')
        setIsOnline(true)
      } else {
        console.log('La aplicación se puso en segundo plano')
        setIsOnline(false)
      }
    }

    AppState.addEventListener('change', handleAppStateChange)

    return () => {
      if (user) {
        AppState.removeEventListener('change', handleAppStateChange)
      }
    }
  }, [])

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    // Simulando una carga asíncrona para obtener el usuario desde AsyncStorage
    AsyncStorage.getItem('user').then((storedUser) => {
      setUser(JSON.parse(storedUser))
      setIsLoading(false) // Cuando se obtiene el usuario, isLoading se establece en false
    })
  }, [])

  useEffect(() => {
    if (user !== null) {
      setIsLoading(true)
      updateUserStatus(user.id, isOnline)
        .then((response) => {
          console.log('Estado actualizado:', response)
        })
        .catch((error) => {
          console.error('Error al actualizar el estado:', error)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [user, isOnline])

  if (isLoading) {
    return <MyComponent />
  }

  return (
    <Provider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={user ? 'Dashboard' : 'StartScreen'}
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="StartScreen" component={StartScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
          <Stack.Screen name="MapScreen" component={MapScreen} />
          <Stack.Screen
            name="EditProfileScreen"
            component={EditProfileScreen}
          />
          <Stack.Screen name="DogWalkersScreen" component={DogWalkersScreen} />
          <Stack.Screen
            name="ResetPasswordScreen"
            component={ResetPasswordScreen}
          />
          <Stack.Screen
            name="WalkerDetailsPage"
            component={WalkerDetailsPage}
            options={{ title: 'Detalles del paseador' }} // Opcional: puedes establecer un título para la pantalla
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}

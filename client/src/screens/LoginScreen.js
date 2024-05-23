import React, { useState, useContext, useEffect } from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { ActivityIndicator, Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import { LoginContext } from '../context/LoginContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Location from 'expo-location'
import { loginUser, updateLocation } from '../services/api'

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        console.log('Por favor activar permisos')
        return
      }
      let currentLocation = await Location.getCurrentPositionAsync({})
      setLocation(currentLocation)
      setLoading(false)
      console.log(currentLocation)
    }
    getPermissions()
  }, [])

  const onLoginPressed = async () => {
    console.log("hola")
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }

    try {
      const response = await loginUser(email.value, password.value); 
      console.log("response: " + response)
      if (response) {
        const user = await response
        await storeData(user)
        await updateLocation(
          user.id,
          location?.coords.latitude,
          location?.coords.longitude
        )
        navigation.navigate('Dashboard')
      } else {
        console.log('Error:', response.status, response.statusText)
        throw new Error(
          `Server returned status ${response.status}: ${response.statusText}`
        )
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  }

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('user', jsonValue)
    } catch (e) {
      // saving error
    }
  }

  return (
    <Background>
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <>
          <BackButton goBack={navigation.goBack} />
          <Logo />
          <Header>Bienvenido de vuelta.</Header>
          <TextInput
            label="correo@email.com"
            returnKeyType="next"
            value={email.value}
            onChangeText={(text) => setEmail({ value: text, error: '' })}
            error={!!email.error}
            errorText={email.error}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
          />
          <TextInput
            label="Constraseña"
            returnKeyType="done"
            value={password.value}
            onChangeText={(text) => setPassword({ value: text, error: '' })}
            error={!!password.error}
            errorText={password.error}
            secureTextEntry
          />
          <View style={styles.forgotPassword}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ResetPasswordScreen')}
            >
              <Text style={styles.forgot}>Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          </View>
          <Button mode="contained" onPress={onLoginPressed}>
            Iniciar sesión
          </Button>
          <View style={styles.row}>
            <Text>No tienes una cuenta? </Text>
            <TouchableOpacity
              onPress={() => navigation.replace('RegisterScreen')}
            >
              <Text style={styles.link}>Regístrate</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </Background>
  )
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})

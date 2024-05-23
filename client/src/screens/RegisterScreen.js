import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import { nameValidator } from '../helpers/nameValidator'
import { numberValidator } from '../helpers/numberValidator'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Location from 'expo-location'
import { registerUser } from '../services/api'

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState({ value: '', error: '' })
  const [email, setEmail] = useState({ value: '', error: '' })
  const [number, setNumber] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [userType, setUserType] = useState('user')

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('user', jsonValue)
    } catch (e) {
      // saving error
    }
  }

  const onSignUpPressed = async () => {
    const nameError = nameValidator(name.value)
    const emailError = emailValidator(email.value)
    const numberError = numberValidator(number.value)
    const passwordError = passwordValidator(password.value)

    if (emailError || passwordError || nameError || numberError) {
      setName({ ...name, error: nameError })
      setEmail({ ...email, error: emailError })
      setNumber({ ...number, error: numberError })
      setPassword({ ...password, error: passwordError })
      return
    }

    try {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        console.log('Por favor activar permisos de ubicación')
        return
      }

      let currentLocation = await Location.getCurrentPositionAsync({})
      const latitude = currentLocation.coords.latitude
      const longitude = currentLocation.coords.longitude

      console.log(latitude + longitude)
      const response = await registerUser(
        name.value,
        email.value,
        number.value,
        password.value,
        userType,
        latitude,
        longitude
      )

      console.log(response)

      if (response.error === 'El correo electrónico ya está en uso.') {
        setEmail({
          ...email,
          error: 'Correo electrónico ya vinculado a una cuenta',
        })
      } else if (response.error === 'El numero ya está en uso.') {
        setNumber({ ...number, error: 'El número ya vinculado a una cuenta' })
      } else {
        const user = response
        await storeData(user)
        navigation.reset({
          index: 0,
          routes: [{ name: 'Dashboard' }],
        })
      }
    } catch (error) {
      setEmail({ ...email, error: 'Inténtelo más tarde' })
      console.log(error.message)
      setPassword({ ...password, error: 'Inténtelo más tarde' })
    }
  }

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Crea una cuenta</Header>
      <View style={styles.userTypeContainer}>
        <TouchableOpacity
          onPress={() => setUserType('user')}
          style={[
            styles.userTypeButton,
            userType === 'user' && styles.selectedUserType,
          ]}
        >
          <Text style={styles.userTypeButtonText}>Usuario</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setUserType('walker')}
          style={[
            styles.userTypeButton,
            userType === 'walker' && styles.selectedUserType,
          ]}
        >
          <Text style={styles.userTypeButtonText}>Paseador</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        label="Nombre Completo"
        returnKeyType="next"
        value={name.value}
        onChangeText={(text) => setName({ value: text, error: '' })}
        error={!!name.error}
        errorText={name.error}
      />
      <TextInput
        label="Email"
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
        label="Número"
        returnKeyType="next"
        value={number.value}
        onChangeText={(text) => setNumber({ value: text, error: '' })}
        error={!!number.error}
        errorText={number.error}
        maxLength={10}
        keyboardType="numeric"
      />
      <TextInput
        label="Contraseña"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <Button
        mode="contained"
        onPress={onSignUpPressed}
        style={{ marginTop: 24 }}
      >
        Registro
      </Button>
      <View style={styles.row}>
        <Text>¿Ya tienes una cuenta? </Text>
        <TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
          <Text style={styles.link}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  userTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  userTypeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  selectedUserType: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.text,
  },
  userTypeButtonText: {
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})

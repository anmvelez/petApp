import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native' // Añade Alert aquí
import {
  Avatar,
  Title,
  Button as PaperButton,
  Card,
  Dialog,
  Portal,
} from 'react-native-paper'
import { theme } from '../core/theme'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  updateUserStatus,
  fetchReservations,
  updateReservationStatus,
  fetchWalkerReservations,
  addRatingAndReview,
  getUserbyId,
  updateWalkerScore,
} from '../services/api'
import DropdownPicker from 'react-native-dropdown-picker'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null)
  const [reservations, setReservations] = useState([])
  const [ratingDialogVisible, setRatingDialogVisible] = useState(false)
  const [currentReservation, setCurrentReservation] = useState(null)
  const [rating, setRating] = useState(5) // Valor por defecto de 5
  const [review, setReview] = useState(0)

  const fetchData = async () => {
    try {
      const userData = await getData()
      setUser(userData)
      if (userData) {
        const userReservations = await fetchUserReservations(
          userData.id,
          userData.type
        )
        setReservations(userReservations)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, []) // Se ejecutará solo en el primer renderizado

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Cada vez que la pantalla obtenga el enfoque, recarga los datos
      fetchData()
    })

    return unsubscribe
  }, [navigation])

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('user')
      return jsonValue != null ? JSON.parse(jsonValue) : null
    } catch (e) {
      console.error('Error reading value:', e)
    }
  }

  const removeValue = async () => {
    try {
      await actualizarEstado(user.id, false)
      await AsyncStorage.removeItem('user')
      console.log('Done.')
    } catch (e) {
      console.error('Error removing value:', e)
    }
  }

  const actualizarEstado = (userId, onlineStatus) => {
    if (userId) {
      updateUserStatus(userId, onlineStatus)
        .then((response) => {
          console.log('Estado actualizado:', response)
        })
        .catch((error) => {
          console.error('Error al actualizar el estado:', error)
        })
    } else {
      console.log('ID de usuario no disponible')
    }
  }

  const fetchUserReservations = async (userId, userType) => {
    try {
      const userReservations = await (userType === 'user'
        ? fetchReservations(userId)
        : fetchWalkerReservations(userId))

      const reservationsWithUserNames = await Promise.all(
        userReservations.map(async (reservation) => {
          const userData = await getUserbyId(reservation.userId)
          const walkerData = await getUserbyId(reservation.walkerId)
          return {
            ...reservation,
            userName: userData.name,
            walkerName: walkerData.name,
          }
        })
      )

      return reservationsWithUserNames
    } catch (error) {
      console.error('Error fetching reservations:', error)
      return []
    }
  }

  const handleReservationAction = async (reservationId, action) => {
    try {
      await updateReservationStatus(reservationId, action)
      const updatedReservations = await fetchUserReservations(
        user.id,
        user.type
      )
      setReservations(updatedReservations)
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la reserva.')
    }
  }

  const handleRatingSubmit = async () => {
    if (rating < 1 || rating > 5) {
      Alert.alert('Error', 'La calificación debe estar entre 1 y 5.')
      return
    }

    try {
      // Agregar la nueva calificación y comentario
      await addRatingAndReview(currentReservation.id, parseInt(rating), review)

      // Obtener la información del paseador
      
      // Actualizar el puntaje del paseador
      await updateWalkerScore(currentReservation.walkerId, rating)

      setRatingDialogVisible(false)
      const updatedReservations = await fetchUserReservations(
        user.id,
        user.type
      )
      setReservations(updatedReservations)
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar la reseña.')
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.userInfoSection}>
          <View style={styles.userInfoHeader}>
            <Avatar.Image
              source={{
                uri:
                  user?.type === 'user'
                    ? 'https://img.freepik.com/foto-gratis/perro-shiba-inu-dando-paseo_23-2149478730.jpg?w=360&t=st=1712615654~exp=1712616254~hmac=448dfe959cb7b79bd54667e35d460b05f2e0c370fc5303202748096cc33e16bc'
                    : 'https://img.freepik.com/foto-gratis/mujer-jugando-su-lindo-perro_23-2148351239.jpg?w=996',
              }}
              size={80}
            />
            <View style={styles.userName}>
              <Title style={styles.title}>{user?.name}</Title>
            </View>
          </View>
        </View>

        <View style={styles.userInfoDetails}>
          <Text style={styles.userDetail}>
            <Text style={styles.userInfo}>Nombre: </Text>
            <Text>{user?.name}</Text>
          </Text>
          <Text style={styles.userDetail}>
            <Text style={styles.userInfo}>Email: </Text>
            <Text>{user?.email}</Text>
          </Text>
          <Text style={styles.userDetail}>
            <Text style={styles.userInfo}>Número: </Text>
            <Text>{user?.number}</Text>
          </Text>
          <Text style={styles.userDetail}>
            <Text style={styles.userInfo}>Tipo: </Text>
            <Text>{user?.type}</Text>
          </Text>

          <View style={styles.buttonsContainer}>
            <Button
              mode="outlined"
              onPress={() => {
                removeValue()
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'StartScreen' }],
                })
              }}
            >
              Cerrar sesión
            </Button>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('EditProfileScreen')}
            >
              Modificar
            </Button>
          </View>
        </View>

        <View style={styles.reservationsSection}>
          <Title style={styles.reservationsTitle}>Mis Reservas</Title>
          {reservations.length === 0 ? (
            <Text>No hay reservas disponibles.</Text>
          ) : (
            reservations.map((reservation) => (
              <Card key={reservation.id} style={styles.reservationCard}>
                <Card.Content>
                  <Text>Usuario: {reservation.userName}</Text>
                  <Text>Paseador: {reservation.walkerName}</Text>
                  <Text>
                    Fecha: {new Date(reservation.date).toLocaleDateString()}
                  </Text>
                  <Text>Hora: {reservation.time}</Text>
                  <Text>Duración: {reservation.duration} minutos</Text>
                  <Text>Estado: {reservation.status}</Text>
                  {user?.type === 'walker' &&
                    reservation.status === 'completed' &&
                    reservation.review && (
                      <View style={styles.reviewContainer}>
                        <Text>Calificación: {reservation.rating}</Text>
                        <Text>Comentario: {reservation.review}</Text>
                      </View>
                    )}
                  {reservation.status === 'pending' && (
                    <View style={styles.actionsContainer}>
                      <PaperButton
                        mode="contained"
                        onPress={() =>
                          handleReservationAction(reservation.id, 'cancelled')
                        }
                        style={styles.actionButton}
                      >
                        Cancelar Reserva
                      </PaperButton>
                      {user?.type === 'walker' && (
                        <PaperButton
                          mode="contained"
                          onPress={() =>
                            handleReservationAction(reservation.id, 'confirmed')
                          }
                          style={styles.actionButton}
                        >
                          Aceptar Reserva
                        </PaperButton>
                      )}
                    </View>
                  )}
                  {reservation.status === 'confirmed' && (
                    <View style={styles.actionsContainer}>
                      {user?.type === 'walker' && (
                        <PaperButton
                          mode="contained"
                          onPress={() =>
                            handleReservationAction(reservation.id, 'completed')
                          }
                          style={styles.actionButton}
                        >
                          Completar Reserva
                        </PaperButton>
                      )}
                    </View>
                  )}
                  {reservation.status === 'completed' &&
                    !reservation.review && (
                      <View style={styles.actionsContainer}>
                        {user?.type === 'user' && (
                          <PaperButton
                            mode="contained"
                            onPress={() => {
                              setCurrentReservation(reservation)
                              setRatingDialogVisible(true)
                            }}
                            style={styles.actionButton}
                          >
                            Calificar y Comentar
                          </PaperButton>
                        )}
                      </View>
                    )}
                </Card.Content>
              </Card>
            ))
          )}
        </View>

        <Portal>
          <Dialog
            visible={ratingDialogVisible}
            onDismiss={() => setRatingDialogVisible(false)}
          >
            <Dialog.Title>Calificar Paseador</Dialog.Title>
            <Dialog.Content>
              {/* Usa DropdownPicker en lugar de Picker */}
              <View>
                <Text style={styles.ratingLabel}>Calificación:</Text>
                <View style={styles.ratingButtonsContainer}>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <PaperButton
                      key={value}
                      mode="contained"
                      style={styles.ratingButton}
                      onPress={() => setRating(value.toString())}
                      // Agrega un color diferente al botón si está seleccionado
                      color={
                        rating === value.toString()
                          ? theme.colors.primary
                          : '#FFFFFF'
                      }
                    >
                      {value}
                    </PaperButton>
                  ))}
                </View>
                <TextInput
                  label="Comentario"
                  value={review}
                  onChangeText={(text) => setReview(text)}
                  style={styles.commentInput} // Agrega este estilo para ajustar el campo de comentario
                  multiline // Permite que el campo de comentario tenga múltiples líneas
                  numberOfLines={4} // Establece el número de líneas predeterminado
                />
              </View>
            </Dialog.Content>
            <Dialog.Actions>
              <PaperButton onPress={handleRatingSubmit}>Enviar</PaperButton>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView>
      {/* Bottom navigation */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate('MapScreen')}
        >
          <Text style={styles.tabText}>Mapa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate('ProfileScreen')}
        >
          <Text style={styles.tabText}>Mi Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate('DogWalkersScreen')}
        >
          <Text style={styles.tabText}>Paseadores</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Text style={styles.tabText}>Inicio</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 70,
  },
  userInfoSection: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  userInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    marginLeft: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfoDetails: {
    marginBottom: 20,
  },
  userDetail: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  userInfo: {
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  reservationsSection: {
    marginTop: 20,
  },
  reservationsTitle: {
    fontSize: 24,
    marginBottom: 10,
  },
  reservationCard: {
    marginBottom: 10,
  },
  actionsContainer: {
    marginTop: 10,
    flexDirection: 'column',
  },
  actionButton: {
    marginBottom: 5,
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: theme.colors.primary,
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  ratingLabel: {
    marginBottom: 10,
  },
  ratingButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingButton: {
    width: 50,
    marginBottom: 10,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    maxHeight: 150,
  },
})

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserbyId } from '../services/api'; // Importar función para obtener información del usuario
import { theme } from '../core/theme';
import ReservationModal from '../components/ReservationModal';

const walkerImage = require('../assets/walker.png');
const userImage = require('../assets/user.png');
const starFilled = require('../assets/star.png');
const starEmpty = require('../assets/star2.png');

const WalkerDetailsPage = ({ route, navigation }) => {
  const { walkerId } = route.params;
  const [walker, setWalker] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userData = await getData();
      setUserId(userData?.id);
    };

    fetchData();
  }, []);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('user');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };

  useEffect(() => {
    const fetchWalker = async () => {
      try {
        const response = await getUserbyId(walkerId);
        setWalker(response);
      } catch (error) {
        console.error('Error fetching walker details:', error);
      }
    };

    fetchWalker();
  }, [walkerId]);

  if (!walker) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  // Función para renderizar las estrellas
  const renderStars = () => {
    const rating = walker?.score || 0;
    const totalStars = 5;
    const filledStars = rating ? Math.floor(rating) : 0;
    const emptyStars = totalStars - filledStars;
    const stars = [];

    for (let i = 0; i < filledStars; i++) {
      stars.push(
        <Image
          key={`star-filled-${i}`}
          source={starFilled}
          style={styles.star}
        />
      );
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Image key={`star-empty-${i}`} source={starEmpty} style={styles.star} />
      );
    }

    return stars;
  };

  const handleReservationSubmit = (formData, userId, walkerId) => {
    // Validar que todos los campos estén completos
    if (!formData.date || !formData.time || !formData.duration) {
      alert('Por favor completa todos los campos del formulario');
      return;
    }
    console.log('Reserva enviada:', formData);
    console.log('UserId:', userId);
    console.log('WalkerId:', walkerId);
    setShowModal(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <TouchableOpacity
        style={styles.reserveButton}
        onPress={() => setShowModal(true)}
      >
        <Text style={styles.reserveButtonText}>Reservar Paseo</Text>
      </TouchableOpacity>
      <View style={styles.container}>
        <Image
          source={walker?.type === 'walker' ? walkerImage : userImage}
          style={styles.avatar}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.title}>Nombre:</Text>
          <Text style={styles.subtitle}>{walker?.name}</Text>

          <Text style={styles.title}>Puntuación:</Text>
          <View style={styles.starContainer}>{renderStars()}</View>

          <Text style={styles.title}>Email:</Text>
          <Text style={styles.subtitle}>{walker?.email}</Text>

          <Text style={styles.title}>Precio por paseo:</Text>
          <Text style={styles.subtitle}>{`$${walker?.pricePerWalk || 0}`}</Text>
        </View>
      </View>
      <View style={styles.bottomNavigation}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate('MapScreen')}
        >
          <Text>Mapa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate('ProfileScreen')}
        >
          <Text>Mi Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate('DogWalkersScreen')}
        >
          <Text>Paseadores</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Text>Home</Text>
        </TouchableOpacity>
      </View>
      <ReservationModal
        showModal={showModal}
        setShowModal={setShowModal}
        onSubmit={handleReservationSubmit}
        userId={userId}
        walkerId={walkerId}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20, // Espacio alrededor del contenido
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20, // Espacio inferior para separar el avatar del nombre
  },
  infoContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: theme.colors.secondary,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'justify',
  },
  starContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10, // Espacio inferior para separar las estrellas del siguiente elemento
  },
  star: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: theme.colors.secondary,
    paddingTop: 10, // Espacio superior para separar el menú de la parte inferior
    paddingBottom: 10, // Espacio inferior para separar el menú del borde superior
    backgroundColor: theme.colors.primary,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,// Ajuste para espaciar uniformemente los elementos del menú
  },
  reserveButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
    alignSelf: 'center',
  },
  reserveButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default WalkerDetailsPage;

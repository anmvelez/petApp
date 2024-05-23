import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { TouchableOpacity } from 'react-native-gesture-handler';
import { theme } from '../core/theme';
import UserModal from '../components/UserModal';
import { getUsers } from '../services/api';
const userImage = require('../assets/user.png');
const personImage = require('../assets/persona.png');
const walkerImage = require('../assets/walker.png');

export default function MapScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Por favor activar permisos');
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setLoading(false);
      console.log(currentLocation);
    };
    const fetchData = async () => {
      const user = await getData();
      setCurrentUser(user);
    };

    fetchData();
    getUsuarios();
    getPermissions();
  }, []);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('user');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error('Error al leer los datos:', e);
    }
  };

  async function getUsuarios() {
    try {
      const response = await getUsers();

      const usersData = await response;
      const usersWithCoordinates = usersData.filter(
        (user) => user.latitude !== null && user.longitude !== null
      );
      setUsers(usersWithCoordinates);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const toggleModal = (user) => {
    setSelectedUser(user);
    setModalVisible(!modalVisible);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.mapContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location?.coords.latitude,
              longitude: location?.coords.longitude,
              latitudeDelta: 0.09,
              longitudeDelta: 0.04,
            }}
          >
            <Marker
              coordinate={{
                latitude: location?.coords.latitude,
                longitude: location?.coords.longitude,
              }}
              image={personImage}
            />
            {users.map((user) => {
              // Filtrar los usuarios en base al tipo contrario al tipo del usuario actual
              if (currentUser && currentUser.type !== user.type) {
                return (
                  <Marker
                    key={user.id}
                    coordinate={{
                      latitude: parseFloat(user.latitude),
                      longitude: parseFloat(user.longitude),
                    }}
                    image={user.type === 'walker' ? walkerImage : userImage}
                    onPress={() => toggleModal(user)}
                    anchor={{ x: 0.5, y: 0.5 }} // Ajusta el punto de anclaje del icono
                  />
                );
              }
              return null;
            })}
          </MapView>
        )}
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

      <UserModal
        visible={modalVisible}
        user={selectedUser}
        onClose={() => setModalVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignContent: 'center',
    width: '100%',
    height: '5%',
    borderTopWidth: 1,
    borderTopColor: theme.colors.secondary,
    paddingBottom: 15,
    backgroundColor: theme.colors.primary,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.colors.secondary,
    paddingTop: 10,
  },
});

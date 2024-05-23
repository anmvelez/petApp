import React, { useEffect, useState } from 'react'
import {
  ScrollView,
  StyleSheet,
  View,
  Image,
  TextInput,
  Platform,
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Text, Checkbox } from 'react-native-paper'
import Background from '../components/Background'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getUsers } from '../services/api'
import { theme } from '../core/theme'

const DogWalkersScreen = ({ navigation }) => {
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    online: false,
    sortByScore: false,
    sortByPrice: false,
    sortByDistance: true,
    userType: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getData()
        setCurrentUser(userData)
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchData()

    const fetchUsers = async () => {
      try {
        const response = await getUsers()
        setUsers(response)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchUsers()
  }, [])

  useEffect(() => {
    if (currentUser) {
      let filtered = users.filter((user) => {
        let isValid = true

        // Filter out users of the same type as the current user
        if (currentUser.type === 'user' && user.type !== 'walker') {
          isValid = false
        } else if (currentUser.type === 'walker' && user.type !== 'user') {
          isValid = false
        }

        // Apply online status filter
        if (filters.online && user.online_status !== 1) {
          isValid = false
        }

        // Apply user type filter
        if (filters.userType && user.type !== filters.userType) {
          isValid = false
        }

        return isValid
      })

      if (filters.sortByDistance) {
        filtered.sort((a, b) => {
          const distanceA = calculateDistance(
            currentUser.latitude,
            currentUser.longitude,
            a.latitude,
            a.longitude
          )
          const distanceB = calculateDistance(
            currentUser.latitude,
            currentUser.longitude,
            b.latitude,
            b.longitude
          )
          return distanceA - distanceB
        })
      }

      if (filters.sortByScore) {
        filtered.sort((a, b) => b.score - a.score)
      }

      if (filters.sortByPrice) {
        filtered.sort((a, b) => a.pricePerWalk - b.pricePerWalk)
      }

      setFilteredUsers(filtered)
    }
  }, [users, currentUser, filters])

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('user')
      return jsonValue != null ? JSON.parse(jsonValue) : null
    } catch (error) {
      console.error('Error getting user data:', error)
    }
  }

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c
    return distance
  }

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180)
  }

  const renderUserCard = (user) => {
    const {
      name,
      score,
      latitude,
      longitude,
      online_status,
      pricePerWalk,
      type,
    } = user
    const distance = calculateDistance(
      currentUser.latitude,
      currentUser.longitude,
      latitude,
      longitude
    )
    const handleWalkerClick = () => {
      if (currentUser.type === 'user') {
        navigation.navigate('WalkerDetailsPage', { walkerId: user.id }); // Pasar el ID del walker a la página de detalles
      }
    };

    return (
      <TouchableOpacity key={user.id} style={styles.userCard} onPress={handleWalkerClick}>
        <View
          style={[
            styles.statusBar,
            { backgroundColor: online_status === 1 ? 'green' : 'red' },
          ]}
        />
        <Text style={styles.userName}>{name}</Text>
        <Text style={styles.userType}>
          {type === 'user' ? 'Usuario' : 'Paseador'}
        </Text>
        <View style={styles.userInfoContainer}>
          <View style={styles.starContainer}>
            {[...Array(score)].map((_, index) => (
              <Image
                key={index}
                source={require('../assets/star.png')}
                style={styles.star}
              />
            ))}
          </View>
          <Text style={styles.userInfoText}>
            Distancia: {distance.toFixed(2)} km
          </Text>
          <Text style={styles.userInfoText}>
            Precio por paseo: ${pricePerWalk}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  const handleSearch = () => {
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredUsers(filtered)
  }

  const handleFilterChange = (filter) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...filter,
    }))
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Buscar..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          onSubmitEditing={handleSearch}
        />
      </View>
      <Background>
        <ScrollView style={styles.scrollView}>
          <View style={styles.filterContainer}>
            <View style={styles.filterColumn}>
              <Checkbox
                status={filters.online ? 'checked' : 'unchecked'}
                onPress={() => handleFilterChange({ online: !filters.online })}
              />
              <Text>En línea</Text>
            </View>
            <View style={styles.filterColumn}>
              <Checkbox
                status={filters.sortByScore ? 'checked' : 'unchecked'}
                onPress={() =>
                  handleFilterChange({ sortByScore: !filters.sortByScore })
                }
              />
              <Text>Puntuación</Text>
            </View>
            <View style={styles.filterColumn}>
              <Checkbox
                status={filters.sortByPrice ? 'checked' : 'unchecked'}
                onPress={() =>
                  handleFilterChange({ sortByPrice: !filters.sortByPrice })
                }
              />
              <Text>Precio</Text>
            </View>
            <View style={styles.filterColumn}>
              <Checkbox
                status={filters.sortByDistance ? 'checked' : 'unchecked'}
                onPress={() =>
                  handleFilterChange({
                    sortByDistance: !filters.sortByDistance,
                  })
                }
              />
              <Text>Distancia</Text>
            </View>
            <View style={styles.filterColumn}>
              <Checkbox
                status={filters.userType === 'walker' ? 'checked' : 'unchecked'}
                onPress={() =>
                  handleFilterChange({
                    userType: filters.userType === 'walker' ? '' : 'walker',
                  })
                }
              />
              <Text>Tipo</Text>
            </View>
          </View>
          <View style={styles.userList}>
            {filteredUsers.map((user) => renderUserCard(user))}
          </View>
        </ScrollView>
      </Background>
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
          <Text>Inicio</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    marginTop: Platform.OS === 'ios' ? 40 : 20,
    padding: 10,
    backgroundColor: 'white',
    zIndex: 1,
  },
  searchBar: {
    backgroundColor: 'lightgray',
    padding: 10,
    borderRadius: 5,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    flexWrap: 'wrap',
  },
  filterColumn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  scrollView: {
    flex: 1,
    zIndex: 0,
  },
  userList: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    marginBottom: 60,
  },
  userCard: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  statusBar: {
    height: 12,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
  },
  userType: {
    fontSize: 14,
    color: 'gray',
  },
  userInfoContainer: {
    marginTop: 10,
    borderColor: theme.colors.secondary
  },
  userInfoText: {
    fontSize: 14,
  },
  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignContent: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.secondary,
    paddingBottom: 15,
    backgroundColor: theme.colors.primary,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
  starContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  star: {
    width: 20,
    height: 20,
    marginRight: 2,
  },
})

export default DogWalkersScreen

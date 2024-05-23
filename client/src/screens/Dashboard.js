import React from 'react';
import { ScrollView, StyleSheet, View, ImageBackground, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';
import Background from '../components/Background';
import Header from '../components/Header';
import Paragraph from '../components/Paragraph';
import Button from '../components/Button';
import { theme } from '../core/theme';

export default function Dashboard({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ImageBackground
        source={require('../assets/background_image.jpg')}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          
          <Header style={styles.header}>Bienvenido a tu de paseso canino</Header>
          <Paragraph style={styles.paragraph}>
            ¡Caminatas diarias para mantener a tu perro feliz y saludable!
          </Paragraph>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('MapScreen')}
            style={styles.button}
          >
            ¡Encuentra un Paseo!
          </Button>
        </View>
      </ImageBackground>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Overlay to darken the background image
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  header: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    width: '80%',
    marginTop: 10,
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: theme.colors.primary,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  tabText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

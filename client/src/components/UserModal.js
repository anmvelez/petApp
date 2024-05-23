import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { Modal, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const starFilled = require('../assets/star.png');
const starEmpty = require('../assets/star2.png');
const walker = require('../assets/walker.png');
const userImage = require('../assets/user.png'); 

const UserModal = ({ visible, user, onClose }) => {
  const navigation = useNavigation();

  const rating = user?.score || 0;
  const totalStars = 5;

  const renderStars = () => {
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
        <Image
          key={`star-empty-${i}`}
          source={starEmpty}
          style={styles.star}
        />
      );
    }

    return stars;
  };

  const handleWalkerClick = () => {
    if (user.type === 'walker') {
      navigation.navigate('WalkerDetailsPage', { walkerId: user.id }); // Pasar el ID del walker a la página de detalles
    }
  };

  return (
    <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.modalContainer}>
      <View style={styles.content}>
        <TouchableOpacity onPress={handleWalkerClick}>
          <Image source={user?.type === 'walker' ? walker : userImage} style={styles.avatar} />
        </TouchableOpacity>
        <Text style={styles.name}>{user?.name}</Text>
        <View style={styles.starContainer}>{renderStars()}</View>
        {user?.type === 'walker' ? (
          <Text style={styles.price}>{`Precio por paseo: $${user?.pricePerWalk || 0} `}</Text>
        ) : (
          <Text style={styles.price}>{`Feliz con su mascota 💖`}</Text>
        )}
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeButton}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  starContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  star: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  price: {
    marginTop: 10,
  },
  closeButton: {
    marginTop: 20,
    color: 'blue',
  },
});

export default UserModal;

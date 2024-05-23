// ReservationPage.js

import React, { useState } from 'react';
import { View, Button, TextInput } from 'react-native';
import { createReservation } from './api';

const ReservationPage = ({ walkerId }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('');

  const handleReservation = async () => {
    try {
      // Crear la reserva
      await createReservation(userId, walkerId, date, time, duration);
      // Lógica adicional después de hacer la reserva
      // Por ejemplo, redirigir a otra página
    } catch (error) {
      console.error('Error creating reservation:', error);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Fecha"
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        placeholder="Hora"
        value={time}
        onChangeText={setTime}
      />
      <TextInput
        placeholder="Duración"
        value={duration}
        onChangeText={setDuration}
      />
      <Button title="Reservar" onPress={handleReservation} />
    </View>
  );
};

export default ReservationPage;

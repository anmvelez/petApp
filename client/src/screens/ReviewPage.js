// ReviewPage.js

import React, { useState } from 'react';
import { View, Button, TextInput } from 'react-native';
import { addRatingAndReview } from './api';

const ReviewPage = ({ reservationId }) => {
  const [rating, setRating] = useState('');
  const [review, setReview] = useState('');

  const handleReview = async () => {
    try {
      // Agregar la calificación y la reseña a la reserva
      await addRatingAndReview(reservationId, rating, review);
      // Lógica adicional después de dejar la reseña
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Calificación"
        value={rating}
        onChangeText={setRating}
      />
      <TextInput
        placeholder="Reseña"
        value={review}
        onChangeText={setReview}
      />
      <Button title="Enviar reseña" onPress={handleReview} />
    </View>
  );
};

export default ReviewPage;

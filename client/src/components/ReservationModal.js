import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, TextInput, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createReservation } from '../services/api'; // Importa la función createReservation
import { theme } from '../core/theme';

const ReservationModal = ({ showModal, setShowModal, onSubmit, walkerId, userId }) => {
  const [formData, setFormData] = useState({
    date: new Date(),
    time: new Date(),
    duration: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const isValidDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  };

  const isValidDuration = (duration) => {
    const durationNum = Number(duration);
    return durationNum >= 10 && durationNum <= 60 && !isNaN(durationNum);
  };

  const handleSubmit = async () => {
    const { date, time, duration } = formData;

    if (!isValidDate(date)) {
      alert('La fecha no puede ser anterior a la fecha actual');
      return;
    }

    if (!isValidDuration(duration)) {
      alert('La duración debe estar entre 10 y 60 minutos');
      return;
    }

    // Validar que todos los campos estén completos
    if (!date || !time || !duration) {
      alert('Por favor completa todos los campos del formulario');
      return;
    }

    // Enviar la reserva
    try {
      const dateString = date.toISOString().split('T')[0];
      const timeString = `${time.getHours()}:${time.getMinutes()}`;
      await createReservation(userId, walkerId, dateString, timeString, duration);
      alert('Reserva creada exitosamente');
      setShowModal(false);
      onSubmit(formData, userId, walkerId);
    } catch (error) {
      console.error('Error al crear la reserva:', error);
      alert('Hubo un error al crear la reserva. Inténtalo de nuevo.');
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={showModal}>
      <TouchableOpacity
        style={styles.modalOverlay}
        onPress={() => setShowModal(false)}
        activeOpacity={1}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reservar Paseo</Text>
            <Text>Fecha:</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <TextInput
                style={styles.input}
                placeholder="Seleccione una fecha"
                value={formData.date.toLocaleDateString()}
                editable={false}
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={formData.date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    handleChange('date', selectedDate);
                  }
                }}
              />
            )}
            <Text>Hora:</Text>
            <TouchableOpacity onPress={() => setShowTimePicker(true)}>
              <TextInput
                style={styles.input}
                placeholder="Seleccione una hora"
                value={formData.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                editable={false}
              />
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={formData.time}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => {
                  setShowTimePicker(false);
                  if (selectedTime) {
                    handleChange('time', selectedTime);
                  }
                }}
              />
            )}
            <Text>Duración (minutos):</Text>
            <TextInput
              style={styles.input}
              placeholder="Duración en minutos"
              keyboardType="numeric"
              value={formData.duration}
              onChangeText={(text) => handleChange('duration', text)}
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Enviar Reserva</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  modalContent: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default ReservationModal;

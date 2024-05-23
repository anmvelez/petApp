// api.js

const API_URL = 'https://725a-181-135-33-107.ngrok-free.app'

export const loginUser = async (email, password) => {
    console.log(email,password)
  try {
    const response = await fetch(`${API_URL}/user/${email}/${password}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    console.log("response:" + response)

    return response.json()
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}
export const fetchReservations = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/user/reservations/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.json()
  } catch (error) {
    console.error('Error fetching reservations:', error);
    throw error;
  }
};
export const fetchWalkerReservations = async (walkerId) => {
  try {
    const response = await fetch(`${API_URL}/user/walker/reservations/${walkerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.json()
  } catch (error) {
    console.error('Error fetching walker reservations:', error);
    throw error;
  }
};
export const getUserbyId = async (id) => {
  console.log(id)
try {
  const response = await fetch(`${API_URL}/user/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  console.log("response:" + response)
  const jr = await response.json()
  console.log(jr)
  return jr
} catch (error) {
  console.error('Error:', error)
  throw error
}
}
export const updateWalkerScore = async (walkerId, newScore) => {
  try {
    const response = await fetch(`${API_URL}/user/walkers/${walkerId}/score`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ score: newScore }),
    })
    if (!response.ok) {
      throw new Error('Error actualizando el puntaje del paseador')
    }
    return await response.json()
  } catch (error) {
    console.error('Error actualizando el puntaje del paseador:', error)
    throw error
  }
}
export const updateUserDetails = async (user) => {
  try {
    const response = await fetch(`${API_URL}/user/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    if (response.status === 200) {
      return await response.json();
    } else {
      throw new Error(`Server returned status ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error updating user details:', error);
    throw error;
  }
};

export const registerUser = async (
    name,
    email,
    number,
    password,
    userType,
    latitude,
    longitude
  ) => {
    try {
      const response = await fetch(`${API_URL}/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          number,
          password,
          type: userType,
          latitude,
          longitude,
          online_status: true,
        }),
      });
  
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

export const updateLocation = async (userId, latitude, longitude) => {
  try {
    const response = await fetch(`${API_URL}/user/${userId}/location`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        latitude,
        longitude,
      }),
    })

    if (response.status !== 200) {
      throw new Error(
        `Server returned status ${response.status}: ${response.statusText}`
      )
    }
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const getUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.status === 200) {
      return await response.json()
    } else {
      throw new Error(
        `Server returned status ${response.status}: ${response.statusText}`
      )
    }
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const updateUserStatus = async (userId, onlineStatus) => {
  try {
    const response = await fetch(`${API_URL}/user/onlineStatus`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        onlineStatus: onlineStatus,
      }),
    })

    if (response.status === 200) {
      return await response.json()
    } else {
      throw new Error(
        `Server returned status ${response.status}: ${response.statusText}`
      )
    }
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}
export const createReservation = async (userId, walkerId, date, time, duration) => {
  try {
    const response = await fetch(`${API_URL}/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        walkerId,
        date,
        time,
        duration,
      }),
    });

    if (response.status === 200) {
      return await response.json();
    } else {
      throw new Error(`Server returned status ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
};

export const updateReservationStatus = async (reservationId, status) => {
  try {
    const response = await fetch(`${API_URL}/reservations/${reservationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status,
      }),
    });

    if (response.status === 200) {
      return await response.json();
    } else {
      throw new Error(`Server returned status ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error updating reservation status:', error);
    throw error;
  }
};

export const addRatingAndReview = async (reservationId, rating, review) => {
  try {
    const response = await fetch(`${API_URL}/reservations/${reservationId}/reviews`, {
      method: 'POST', // Cambiamos el método a POST
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rating,
        review,
      }),
    });

    if (response.status === 200) {
      return await response.json();
    } else {
      throw new Error(`Server returned status ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error adding rating and review:', error);
    throw error;
  }
};
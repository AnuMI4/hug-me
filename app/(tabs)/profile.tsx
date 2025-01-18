import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { getDoc, doc } from 'firebase/firestore';
import { FIRESTORE_DB, FIREBASE_AUTH } from '@/FirebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const ProfileScreen = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const userDocRef = doc(FIRESTORE_DB, 'userDetails', user.uid);
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        } finally {
          setLoading(false);
        }
      }
    };

    onAuthStateChanged(FIREBASE_AUTH, fetchUserData); // Fetch user data on login state change
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // If userData is null, show fallback values
  const profileData = userData || {
    firstName: 'Jane',
    lastName: 'Doe',
    age: 28,
    hugsRequested: 120,
    hugsGiven: 150,
    rating: 4.5,
    profileImage: require('../../assets/profile.jpg'),
  };

  return (
    <View style={styles.container}>
      {/* Profile Photo */}
      <Image
        source={profileData.profileImage}
        style={styles.profileImage}
      />

      {/* Name and Age */}
      <Text style={styles.nameText}>
        {profileData.firstName} {profileData.lastName}
      </Text>
      <Text style={styles.ageText}>{profileData.age} years old</Text>

      {/* Hugs Data */}
      <View style={styles.dataContainer}>
        <Text style={styles.dataText}>Hugs Requested: {profileData.hugsRequested}</Text>
        <Text style={styles.dataText}>Hugs Given: {profileData.hugsGiven}</Text>
      </View>

      {/* Rating */}
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>Rating: </Text>
        <Text style={styles.rating}>
          {'★'.repeat(Math.floor(profileData.rating))}
          {'☆'.repeat(5 - Math.floor(profileData.rating))}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60, // Round the image to make it a circle
    marginBottom: 20,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7912b0', // Use your desired color
    marginBottom: 10,
  },
  ageText: {
    fontSize: 18,
    color: '#555',
    marginBottom: 20,
  },
  dataContainer: {
    marginBottom: 20,
  },
  dataText: {
    fontSize: 16,
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    color: '#333',
  },
  rating: {
    fontSize: 20,
    color: '#ffd700', // Golden color for stars
    marginLeft: 5,
  },
});

export default ProfileScreen;

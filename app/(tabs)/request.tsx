import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FIRESTORE_DB } from '@/FirebaseConfig';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const RequestScreen = () => {
  const [loading, setLoading] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [user, setUser] = useState(getAuth().currentUser);
  const [hugRequested, setHugRequested] = useState(false);
  const [hugRequestStatus, setHugRequestStatus] = useState('');
  const [requesterName, setRequesterName] = useState('');

  // Fetch user's firstName from Firestore
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user) {
        try {
          const userDetailsRef = doc(FIRESTORE_DB, 'userDetails', user.uid);
          const userDetailsSnap = await getDoc(userDetailsRef);

          if (userDetailsSnap.exists()) {
            const userDetails = userDetailsSnap.data();
            setRequesterName(userDetails.firstName);
          } else {
            setRequesterName('Anonymous'); // Fallback if document doesn't exist
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
          setRequesterName('Anonymous');
        }
      }
    };

    fetchUserDetails();
  }, [user]);

  // Fetch hug request status
  useEffect(() => {
    const checkRequestStatus = async () => {
      if (user) {
        try {
          const requestRef = doc(FIRESTORE_DB, 'hugRequests', user.uid);
          const requestSnap = await getDoc(requestRef);

          if (requestSnap.exists()) {
            const requestData = requestSnap.data();
            setHugRequested(true);
            setHugRequestStatus(requestData.status);
            setRequesterName(requestData.approverName || requestData.username);
          }
        } catch (error) {
          console.error('Error fetching hug request status:', error);
        }
      }
    };

    checkRequestStatus();
  }, [user]);

  // Handle hug request initiation
  const handleRequestHug = async () => {
    setLoading(true);
    setRequestMessage('Requesting hug...');
    setHugRequested(true);

    try {
      const requestRef = doc(FIRESTORE_DB, 'hugRequests', user?.uid || 'unknown');
      await setDoc(requestRef, {
        username: requesterName || 'Anonymous', // Use firstName instead of displayName
        email: user?.email || '',
        status: 'pending',
        timestamp: new Date(),
      });

      setRequestMessage('Hug Requested! 🤗');
    } catch (error) {
      console.error('Error requesting hug:', error);
      setRequestMessage('Failed to request hug');
    } finally {
      setLoading(false);
    }
  };

  // Approve hug
  const handleApproveHug = async () => {
    try {
      const requestRef = doc(FIRESTORE_DB, 'hugRequests', user?.uid || 'unknown');
      await updateDoc(requestRef, {
        status: 'approved',
      });

      setHugRequestStatus('approved');
      setRequestMessage('');
    } catch (error) {
      console.error('Error approving hug:', error);
    }
  };

  // Reject hug
  const handleRejectHug = async () => {
    try {
      const requestRef = doc(FIRESTORE_DB, 'hugRequests', user?.uid || 'unknown');
      await updateDoc(requestRef, {
        status: 'rejected',
      });

      setHugRequestStatus('rejected');
      setRequestMessage('Hug request rejected. 😞');
    } catch (error) {
      console.error('Error rejecting hug:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Initial state: Request a hug */}
      {!hugRequested && (
        <>
          <Text style={styles.headerText}>Request a bear hug now!</Text>
          <TouchableOpacity style={styles.button} onPress={handleRequestHug}>
            <Text style={styles.buttonText}>I need a hug</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Loading spinner */}
      {loading && <ActivityIndicator size="large" color="#7912b0" style={styles.loader} />}

      {/* Approved state */}
      {hugRequestStatus === 'approved' && (
        <View style={styles.requestContainer}>
          <Text style={styles.requestText}>{`${requesterName} wants to hug you!`}</Text>
        </View>
      )}

      {/* Pending state */}
      {hugRequestStatus === 'pending' && (
        <View style={styles.requestContainer}>
          <Text style={styles.requestText}>{`${requesterName} wants to hug you!`}</Text>
          <View style={styles.approveRejectContainer}>
            <TouchableOpacity style={styles.button} onPress={handleApproveHug}>
              <Text style={styles.buttonText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleRejectHug}>
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Rejected state */}
      {hugRequestStatus === 'rejected' && (
        <Text style={styles.requestMessage}>Your hug request was rejected. 😞</Text>
      )}

      {/* Generic message */}
      {requestMessage && <Text style={styles.requestMessage}>{requestMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7912b0',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#7912b0',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loader: {
    marginTop: 20,
  },
  requestMessage: {
    fontSize: 18,
    color: '#7912b0',
    marginTop: 20,
  },
  requestContainer: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  requestText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7912b0',
  },
  approveRejectContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
});

export default RequestScreen;

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { FIRESTORE_DB, FIREBASE_AUTH } from '@/FirebaseConfig';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const AllRequestsScreen = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Get the logged-in user's ID
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        setCurrentUserId(user.uid); // Fetch user ID
      } else {
        setCurrentUserId(null); // Handle unauthenticated state
      }
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []);

  // Fetch all hug requests from Firestore
  const fetchRequests = async () => {
    try {
      const querySnapshot = await getDocs(collection(FIRESTORE_DB, 'hugRequests'));
      const fetchedRequests = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRequests(fetchedRequests);
    } catch (error) {
      console.error('Error fetching hug requests:', error);
    }
  };

  // Refresh the requests list when the user drags down
  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchRequests();
    setIsRefreshing(false);
  };

  const handleApprove = async (requestId: string) => {
    if (!currentUserId) return; // Ensure user is authenticated
    try {
      const requestRef = doc(FIRESTORE_DB, 'hugRequests', requestId);
      await updateDoc(requestRef, {
        status: 'approved',
        approvedBy: [...(requests.find((req) => req.id === requestId)?.approvedBy || []), currentUserId],
      });
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === requestId
            ? {
                ...request,
                status: 'approved',
                approvedBy: [...(request.approvedBy || []), currentUserId],
              }
            : request
        )
      );
    } catch (error) {
      console.error('Error approving hug request:', error);
    }
  };

  const handleReject = async (requestId: string) => {
    if (!currentUserId) return; // Ensure user is authenticated
    try {
      const requestRef = doc(FIRESTORE_DB, 'hugRequests', requestId);
      await updateDoc(requestRef, {
        status: 'rejected',
        rejectedBy: [...(requests.find((req) => req.id === requestId)?.rejectedBy || []), currentUserId],
      });

      // Remove the rejected request from the state
      setRequests((prevRequests) => prevRequests.filter((request) => request.id !== requestId));
    } catch (error) {
      console.error('Error rejecting hug request:', error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <View style={styles.container}>
      {!currentUserId ? (
        <Text style={styles.text}>Please log in to view requests.</Text>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.requestCard}>
              <Text style={styles.requestText}>
                {item.username} has requested a hug
              </Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.approveButton]}
                  onPress={() => handleApprove(item.id)}
                >
                  <Text style={styles.buttonText}>Approve</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.rejectButton]}
                  onPress={() => handleReject(item.id)}
                >
                  <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.text}>No requests yet!</Text>
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  text: {
    fontSize: 18,
    color: '#7912b0',
  },
  requestCard: {
    width: '100%',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#f4f4f4',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  requestText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '45%',
  },
  approveButton: {
    backgroundColor: '#4caf50',
  },
  rejectButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
});

export default AllRequestsScreen;

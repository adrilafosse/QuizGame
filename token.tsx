import * as Notifications from 'expo-notifications';

export async function getFCMToken() {
  console.log('getFCMToken called'); // Log ajouté ici

  // Demander la permission
  const { status } = await Notifications.requestPermissionsAsync();
  console.log('Notification permission status:', status); // Log le statut de permission

  if (status !== 'granted') {
    console.error('Permission not granted for notifications');
    return null;
  }

  // Récupérer le token
  const token = await Notifications.getExpoPushTokenAsync({
    projectId: '161080157981' // Remplace par ton projectId Firebase
  });
  console.log('FCM Token obtained:', token.data); // Log ajouté ici
  return token.data;
}

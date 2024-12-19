import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook

interface PaymentMethodProps {
  onPaymentComplete: (isSelected: boolean) => void; // Updated type to pass selection state
}

const paymentMethods = [
  { id: 'zalo', name: 'Zalo Pay', icon: require('../assets/Method/ZaloPay.png') },
  { id: 'momo', name: 'MoMo', icon: require('../assets/Method/MoMo.png') },
  { id: 'shopee', name: 'ShopeePay', icon: require('../assets/Method/ShopeePay.png') },
];

const PaymentMethod: React.FC<PaymentMethodProps> = ({ onPaymentComplete }) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const navigation = useNavigation(); // Access navigation object

  const handleSelectMethod = (methodId: string) => {
    const isSelected = selectedMethod === methodId;
    setSelectedMethod(isSelected ? null : methodId);
    if (!isSelected) {
      setTimeLeft(5 * 60); // Set timer for 5 minutes
      onPaymentComplete(true); // Notify Payment component of selection
    } else {
      setTimeLeft(null); // Reset timer if method is deselected
      onPaymentComplete(false); // Notify Payment component about deselection
    }
  }

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (timeLeft !== null) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => (prevTime ? prevTime - 1 : null));
      }, 1000);
    }

    return () => {
      clearInterval(timer); // Cleanup timer on unmount
    };
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      onPaymentComplete(false); // Call the completion function if time runs out
      navigation.goBack(); // Go back to the previous screen
    }
  }, [timeLeft, onPaymentComplete, navigation]);

  const formatTimeLeft = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  return (
    <View style={styles.container}>
      {paymentMethods.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.methodItem,
            selectedMethod === method.id && styles.selectedMethod,
          ]}
          onPress={() => handleSelectMethod(method.id)}
        >
          <View style={styles.methodContent}>
            <Image source={method.icon} style={styles.methodIcon} />
            <Text style={styles.methodText}>{method.name}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={"#fff"} />
        </TouchableOpacity>
      ))}
      {selectedMethod && timeLeft !== null && (
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>Complete in: {formatTimeLeft(timeLeft)}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
  },
  methodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedMethod: {
    backgroundColor: '#261D08',
    borderColor: 'gold',
    borderWidth: 2,
  },
  methodContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodIcon: {
    width: 70,
    height: 30,
    marginRight: 10,
  },
  methodText: {
    color: '#fff',
    fontSize: 16,
  },
  timerContainer: {
    marginTop: 5,
    padding: 10,
    backgroundColor: '#261D08',
    borderRadius: 8,
  },
  timerText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default PaymentMethod;

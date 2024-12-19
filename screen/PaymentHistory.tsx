import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import { StackNavigationProp } from '@react-navigation/stack';

type PaymentHistoryProps = {
    navigation: StackNavigationProp<any>;
};

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ navigation }) => {
    const [user, setUser] = useState<any>(null);
    const [chartData, setChartData] = useState<{ labels: string[], data: number[] }>({ labels: [], data: [] });
    const [totalSpent, setTotalSpent] = useState<number>(0);
    const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [totalRevenue, setTotalRevenue] = useState<number>(0);
    const [hoveredData, setHoveredData] = useState<{ label: string, value: number, position: { x: number, y: number } } | null>(null);
    const [loading, setLoading] = useState<boolean>(true); // Thêm trạng thái loading
    const chartRef = useRef(null);

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        if (user) {
            fetchOrderData(selectedMonth, selectedYear);
        }
    }, [user, selectedMonth, selectedYear]);

    const fetchUser = async () => {
        try {
            const storedUser = await AsyncStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', parsedUser.id)
                    .single();

                if (error) {
                    console.error('Error fetching user:', error.message);
                    throw error;
                }
                if (data) {
                    setUser(data);
                    await AsyncStorage.setItem('user', JSON.stringify(data));
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchOrderData = async (month: string, year: number) => {
        if (!user) return;

        try {
            setLoading(true); // Bắt đầu loading
            const { data: orders, error } = await supabase
                .from('Order')
                .select('totalprice, paymentdate')
                .eq('id', user.id);

            if (error) {
                console.error('Error fetching orders:', error.message);
                throw error;
            }

            const dailyRevenue: { [key: string]: number } = {};
            let total = 0;
            let totalForSelectedMonth = 0;

            orders.forEach(order => {
                const dateStr = order.paymentdate.split('T')[0];
                const [yearOfOrder, monthOfOrder] = dateStr.split('-');
                const priceStr = order.totalprice.replace(/[$,]/g, '');
                const price = parseFloat(priceStr);

                total += !isNaN(price) ? price : 0;

                if (monthOfOrder === month.split('-')[1] && yearOfOrder === year.toString() && !isNaN(price)) {
                    totalForSelectedMonth += price;

                    if (!dailyRevenue[dateStr]) {
                        dailyRevenue[dateStr] = 0;
                    }
                    dailyRevenue[dateStr] += price;
                }
            });

            setTotalRevenue(total);
            setTotalSpent(totalForSelectedMonth);

            if (totalForSelectedMonth === 0) {
                const daysInMonth = new Date(year, parseInt(month.split('-')[1]), 0).getDate();
                const labels = Array.from({ length: daysInMonth }, (_, i) => `${year}-${String(i + 1).padStart(2, '0')}`);
                setChartData({ labels, data: Array(daysInMonth).fill(0) });
            } else {
                const sortedEntries = Object.entries(dailyRevenue).sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime());
                const labels = sortedEntries.map(entry => entry[0]);
                const data = sortedEntries.map(entry => entry[1]);

                if (labels.length > 0 && data.every(value => !isNaN(value))) {
                    setChartData({ labels, data });
                } else {
                    setChartData({ labels: [], data: [] });
                }
            }
        } catch (error) {
            console.error('Error fetching order data:', error);
        } finally {
            setLoading(false); // Kết thúc loading
        }
    };

    const screenWidth = Dimensions.get('window').width;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="#FCC434" />
                </TouchableOpacity>
                <Text style={styles.chartTitle}>Doanh Thu</Text>
            </View>

            <View style={styles.pickerContainer}>
                <Text style={styles.label}>Chọn Năm:</Text>
                <Picker
                    selectedValue={selectedYear}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSelectedYear(itemValue)}
                >
                    {Array.from({ length: 6 }, (_, i) => {
                        const yearValue = new Date().getFullYear() - i;
                        return (
                            <Picker.Item key={i} label={`${yearValue}`} value={yearValue} />
                        );
                    })}
                </Picker>
            </View>

            <View style={styles.pickerContainer}>
                <Text style={styles.label}>Chọn Tháng:</Text>
                <Picker
                    selectedValue={selectedMonth}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSelectedMonth(itemValue)}
                >
                    {Array.from({ length: 12 }, (_, i) => {
                        const monthValue = `${selectedYear}-${String(i + 1).padStart(2, '0')}`;
                        return (
                            <Picker.Item key={i} label={`Tháng ${i + 1}`} value={monthValue} />
                        );
                    })}
                </Picker>
            </View>

            <Text style={styles.totalSpent}>Tổng chi tháng {selectedMonth.split('-')[1]} năm {selectedYear}: {totalSpent.toLocaleString()} VND</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#FCC434" />
            ) : (
                <>
                    {totalSpent > 0 ? (
                        <View>
                            <LineChart
                                ref={chartRef}
                                data={{
                                    labels: chartData.labels,
                                    datasets: [
                                        {
                                            data: chartData.data,
                                            strokeWidth: 2,
                                        },
                                    ],
                                }}
                                width={screenWidth - 20}
                                height={280}
                                yAxisLabel=""
                                yAxisSuffix=" VND"
                                yAxisInterval={1}
                                chartConfig={{
                                    backgroundColor: '#000000',
                                    backgroundGradientFrom: '#1C1C1C',
                                    backgroundGradientTo: '#000000',
                                    decimalPlaces: 0,
                                    color: (opacity = 1) => `rgba(252, 196, 52, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    style: {
                                        borderRadius: 16,
                                    },
                                    propsForDots: {
                                        r: "6",
                                        strokeWidth: "2",
                                        stroke: "#FCC434",
                                    },
                                }}
                                bezier
                                horizontalLabelRotation={-45}
                                onDataPointClick={({ value, index, x, y }) => {
                                    const newLabel = chartData.labels[index];
                                    if (hoveredData && hoveredData.label === newLabel) {
                                        setHoveredData(null); // Clear if the same point is clicked
                                    } else {
                                        setHoveredData({ label: newLabel, value, position: { x, y } }); // Set new hovered data with position
                                    }
                                }}
                                style={{
                                    marginVertical: 8,
                                    borderRadius: 16,
                                    paddingRight: 50,
                                    marginLeft: 10,
                                }}
                            />
                            {hoveredData && (
                                <View style={[styles.hoverInfo, { left: hoveredData.position.x, top: hoveredData.position.y + 20 }]}>
                                    <Text style={styles.hoverText}>Ngày: {hoveredData.label}</Text>
                                    <Text style={styles.hoverText}>Số tiền: {hoveredData.value.toLocaleString()} VND</Text>
                                </View>
                            )}
                        </View>
                    ) : (
                        <View style={styles.emptyChart}>
                            <Text style={styles.noDataText}>Không có dữ liệu</Text>
                        </View>
                    )}
                </>
            )}

            <Text style={styles.totalSpent}>Tổng doanh thu: {totalRevenue.toLocaleString()} VND</Text>
        </View>
    );
};

export default PaymentHistory;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    backButton: {
        padding: 10,
    },
    chartTitle: {
        color: "#FCC434",
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1,
    },
    pickerContainer: {
        marginBottom: 18,
        borderWidth: 1,
        borderColor: '#FCC434',
        borderRadius: 8,
        padding: 10,
    },
    label: {
        color: "#FCC434",
        fontSize: 18,
        marginBottom: 8,
    },
    picker: {
        height: 30,
        width: '100%',
        color: '#FCC434',
    },
    totalSpent: {
        color: "#fff",
        fontSize: 18,
        marginBottom: 16,
        marginTop: 15,
    },
    noDataText: {
        color: "#fff",
        fontSize: 16,
        textAlign: 'center',
        marginTop: 50,
    },
    emptyChart: {
        height: 280,
        justifyContent: 'center',
        alignItems: 'center',
    },
    hoverInfo: {
        position: 'absolute',
        backgroundColor: '#FCC434',
        padding: 10,
        borderRadius: 8,
        zIndex: 100,
    },
    hoverText: {
        color: '#000',
        fontSize: 14,
    },
});
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { LineChart } from 'react-native-chart-kit';

export default function DashboardAluno({ route, navigation }) {
  const { usuario } = route.params;
  const [turmas, setTurmas] = useState([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState('');
  const [loading, setLoading] = useState(true);
  const [notas, setNotas] = useState([]);
  const [atividades, setAtividades] = useState([]);
  const [mostrarNotas, setMostrarNotas] = useState(false);
  const [mostrarAtividades, setMostrarAtividades] = useState(false);

  const screenWidth = Dimensions.get('window').width;

  // Animações
  const animNotas = useRef(new Animated.Value(0)).current;
  const animAtividades = useRef(new Animated.Value(0)).current;

  const rotacionar = (animatedValue, mostrar) => {
    Animated.timing(animatedValue, {
      toValue: mostrar ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    async function carregarTurmas() {
      try {
        const response = await axios.get(`http://192.168.248.97:8080/aluno-turma/turmas/${usuario.id}`);
        setTurmas(response.data);
      } catch (error) {
        console.error(error);
        Alert.alert('Erro', 'Falha ao carregar as turmas.');
      } finally {
        setLoading(false);
      }
    }

    carregarTurmas();
  }, []);

  const handleVerNotas = async () => {
    try {
      let url;
      if (turmaSelecionada) {
        url = `http://192.168.248.97:8080/entregas/notas/aluno/${usuario.id}/turma/${turmaSelecionada}`;
      } else {
        url = `http://192.168.248.97:8080/entregas/notas/aluno/${usuario.id}`;
      }

      const response = await axios.get(url);
      setNotas(response.data);
      setMostrarNotas(!mostrarNotas);
      rotacionar(animNotas, !mostrarNotas);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar as notas.');
    }
  };

  const handleVerAtividades = async () => {
    if (!turmaSelecionada) {
      Alert.alert("Atenção", "Selecione uma turma para ver as atividades.");
      return;
    }

    try {
      const response = await axios.get(
        `http://192.168.248.97:8080/entregas/status/aluno/${usuario.id}/turma/${turmaSelecionada}`
      );
      setAtividades(response.data);
      const novoEstado = !mostrarAtividades;
      setMostrarAtividades(novoEstado);
      rotacionar(animAtividades, novoEstado);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar as atividades.");
    }
  };

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  const rotateSeta = (animatedValue) =>
    animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logout}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="exit-outline" size={28} color="#DE3232" />
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <Text style={styles.titulo}>Olá, {usuario.nome}</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#001f3f" />
      ) : (
        <>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={String(turmaSelecionada)}
              onValueChange={(itemValue) => setTurmaSelecionada(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="SELECIONE A TURMA" value="" />
              {turmas.map((turma) => (
                <Picker.Item
                  key={turma.id}
                  label={turma.nomeMateria}
                  value={turma.id}
                />
              ))}
            </Picker>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.botao} onPress={handleVerNotas}>
              <Text style={styles.textoBotao}>VER NOTAS</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botao} onPress={handleVerAtividades}>
              <Text style={styles.textoBotao}>VER ATIVIDADES</Text>
            </TouchableOpacity>
          </View>

          {mostrarNotas && notas.length > 0 && (
            <View style={styles.notasContainer}>
              <View style={styles.labelComSeta}>
                <Text style={styles.label}>NOTAS:</Text>
                <TouchableOpacity onPress={() => {
                  setMostrarNotas(false);
                  rotacionar(animNotas, false);
                }}>
                  <Animated.View style={{ transform: [{ rotate: rotateSeta(animNotas) }] }}>
                    <Ionicons name="chevron-up" size={20} color="#253D81" />
                  </Animated.View>
                </TouchableOpacity>
              </View>

              {notas.map((n, index) => (
                <Text key={index} style={styles.notaLinha}>
                  {n.materia}: {n.nota}
                </Text>
              ))}

              <LineChart
                data={{
                  labels: notas.map((n) => n.materia),
                  datasets: [{ data: notas.map((n) => n.nota) }],
                }}
                width={screenWidth - 40}
                height={260}
                fromZero
                segments={5}
                yAxisInterval={1}
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 1,
                  color: (opacity = 1) => `rgba(0, 31, 63, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  propsForDots: {
                    r: '6',
                    strokeWidth: '2',
                    stroke: '#ffc300',
                  },
                  propsForBackgroundLines: {
                    stroke: '#eee',
                  },
                }}
                bezier
                yAxisMin={0}
                yAxisMax={10}
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
            </View>
          )}

          {mostrarAtividades && (
            <View style={styles.notasContainer}>
              <View style={styles.labelComSeta}>
                <Text style={styles.label}>ATIVIDADES:</Text>
                <TouchableOpacity onPress={() => {
                  setMostrarAtividades(false);
                  rotacionar(animAtividades, false);
                }}>
                  <Animated.View style={{ transform: [{ rotate: rotateSeta(animAtividades) }] }}>
                    <Ionicons name="chevron-up" size={20} color="#253D81" />
                  </Animated.View>
                </TouchableOpacity>
              </View>

              {atividades.length === 0 ? (
                <Text style={styles.notaLinha}>Nenhuma atividade encontrada.</Text>
              ) : (
                atividades.map((atividade, index) => (
                  <Text
                    key={index}
                    style={[
                      styles.notaLinha,
                      {
                        borderColor: atividade.status === "Entregue" ? "#32CD32" : "#DE3232",
                      },
                    ]}
                  >
                    {atividade.titulo} - {atividade.status}
                  </Text>
                ))
              )}
            </View>
          )}
        </>
      )}

      <TouchableOpacity
      style={{
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#253D81',
        padding: 16,
        borderRadius: 50,
        elevation: 5
      }}
      onPress={() => navigation.navigate('NotificacoesAluno', { usuario })}
    >
      <Ionicons name="chatbox-ellipses" size={28} color="#FFD118" />
    </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titulo: {
    fontSize: 35,
    color: '#253D81',
    fontFamily: 'Rajdhani_700Bold',
  },
  logout: {
    alignItems: 'flex-end',
    marginTop: 10,
  },
  logoutButton: {
    padding: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  labelComSeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  picker: {
    height: 50,
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 2,
    borderColor: '#253D81',
    borderRadius: 10,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 20,
    gap: 10,
  },
  botao: {
    backgroundColor: '#253D81',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#FFD118',
    fontWeight: 'bold',
    fontSize: 16,
  },
  notasContainer: {
    marginTop: 20,
  },
  notaLinha: {
    fontSize: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#253D81',
    borderRadius: 10,
    padding: 10,
  },
});

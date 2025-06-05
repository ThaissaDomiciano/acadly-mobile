import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, Button, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
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

  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    async function carregarTurmas() {
      try {
        const response = await axios.get(`http://172.16.201.225:8080/aluno-turma/turmas/${usuario.id}`);
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
        url = `http://172.16.201.225:8080/entregas/notas/aluno/${usuario.id}/turma/${turmaSelecionada}`;
      } else {
        url = `http://172.16.201.225:8080/entregas/notas/aluno/${usuario.id}`;
      }

      const response = await axios.get(url);
      setNotas(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar as notas.');
    }
  };

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Bem-vindo(a), {usuario.nome}</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="exit-outline" size={28} color="#DE3232" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#001f3f" />
      ) : (
        <>
          <Text style={styles.label}>Selecione sua turma:</Text>
          <Picker
            selectedValue={String(turmaSelecionada)}
            onValueChange={(itemValue) => setTurmaSelecionada(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="-- Selecione --" value="" />
            {turmas.map((turma) => (
              <Picker.Item
                key={turma.id}
                label={turma.nomeMateria}
                value={turma.id}
              />
            ))}
          </Picker>

          <View style={styles.buttonContainer}>
            <Button title="Ver Notas" onPress={handleVerNotas} color="#001f3f" />
          </View>

          {notas.length > 0 && (
            <View style={styles.notasContainer}>
              <Text style={styles.label}>Notas:</Text>
              {notas.map((n, index) => (
                <Text key={index} style={styles.notaLinha}>
                  {n.materia}: {n.nota}
                </Text>
              ))}

              <Text style={[styles.label, { marginTop: 16 }]}>Gráfico de Desempenho:</Text>
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
        </>
      )}
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#001f3f',
  },
  logoutButton: {
    padding: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  picker: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  notasContainer: {
    marginTop: 20,
  },
  notaLinha: {
    fontSize: 16,
    marginBottom: 6,
  },
});

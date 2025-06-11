import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

export default function NotificacoesAluno({ route, navigation }) {
  const { usuario } = route.params;
  const [notificacoes, setNotificacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    axios.get(`http://172.16.201.225:8080/notificacoes/aluno/${usuario.id}`)
      .then(res => setNotificacoes(res.data))
      .catch(err => {
        console.error(err);
        Alert.alert("Erro", "Falha ao carregar notificações.");
      })
      .finally(() => setCarregando(false));
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.voltar}>
        <Ionicons name="arrow-back" size={24} color="#253D81" />
        <Text style={styles.textoVoltar}>Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Notificações</Text>

      {carregando ? (
        <ActivityIndicator size="large" color="#253D81" />
      ) : (
        <FlatList
          data={notificacoes}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.tituloNotif}>{item.titulo}</Text>
              <Text style={styles.texto}>{item.mensagem}</Text>
              <Text style={styles.data}>{new Date(item.dataEnvio).toLocaleString()}</Text>
              <Text style={styles.turma}>{item.nomeTurma}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  voltar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  textoVoltar: {
    marginLeft: 8,
    fontSize: 16,
    color: '#253D81',
    fontWeight: 'bold',
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#253D81',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  tituloNotif: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#253D81',
  },
  texto: {
    fontSize: 14,
    marginTop: 4,
  },
  data: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
  },
  turma: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
});

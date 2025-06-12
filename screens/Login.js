import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import axios from 'axios';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
  try {
    const response = await axios.post('http://172.16.201.225:8080/auth/login', {
      email,
      senha
    });

    const { usuario } = response.data;

    if (usuario.tipo !== 'ALUNO') {
      Alert.alert('Acesso negado', 'Somente alunos podem usar o aplicativo.');
      return;
    }

    navigation.navigate('DashboardAluno', { usuario });

  } catch (error) {
    console.error(error);

    if (error.response && error.response.status === 401) {
      Alert.alert('Erro', 'E-mail ou senha inválidos.');
    } else {
      Alert.alert('Erro', 'Falha ao conectar com o servidor.');
    }
  }
};


  return (
    <View style={styles.container}>
       <View style={styles.logoContainer}>
        <Image source={require('../assets/logo-mobile.png')} style={styles.imagem} />
      </View>
      <View style={styles.formContainer}>
      <Text style={styles.title}>LOGIN</Text>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>ENTRAR</Text>
      </TouchableOpacity>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 24,
  },
  logoContainer: {
    marginTop: 100,
    alignItems: 'center',
  },
  imagem: {
    width: 300,
    height: 200,
    resizeMode: 'contain',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#253D81',
  },
  input: {
    borderWidth: 2,
    borderColor: '#253D81',
    padding: 16,
    marginBottom: 16,
    borderRadius: 10,
    width: '100%',
  },
  button: {
    backgroundColor: '#253D81',
    padding: 18,
    borderRadius: 10,
    width: '100%',
  },
  buttonText: {
    color: '#FFD118',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import axios from 'axios';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.get('http://172.16.201.225:8080/usuarios');
      const usuarios = response.data;

      const usuarioEncontrado = usuarios.find(u => u.email === email && u.senha === senha);

      if (!usuarioEncontrado) {
        Alert.alert('Erro', 'Usuário não encontrado ou senha incorreta.');
        return;
      }

      if (usuarioEncontrado.tipo !== 'ALUNO') {
        Alert.alert('Acesso negado', 'Somente alunos podem usar o aplicativo.');
        return;
      }

      // Navega para a página em branco de teste
      navigation.navigate('DashboardAluno', { usuario: usuarioEncontrado });

    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Falha ao conectar com o servidor.');
    }
  };

  return (
    <View style={styles.container}>
       <Image source={require('../assets/logo-mobile.png')} style={styles.imagem} />
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, alignItems: 'center', backgroundColor: '#FAFAFA'},
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 24, textAlign: 'center', color: '#253D81' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 16, borderRadius: 8, width: '100%' },
  button: { backgroundColor: '#253D81', padding: 16, borderRadius: 10, width: '100%', marginTop: 16 },
  buttonText: { color: '#FFD118', fontWeight: 'bold', textAlign: 'center' },
  imagem: { width: 200, height: 200, alignSelf: 'center',  resizeMode: 'contain', }
});

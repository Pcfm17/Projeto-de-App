import * as React from 'react';
import { TextInput, Text, View, StyleSheet, TouchableHighlight } from 'react-native';
import firebase from '../config/config';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.nome = '';
    this.senha = '';
  }

  async login() {
    const nome = this.nome.trim().toLowerCase();
    const senha = this.senha.trim();

    if (nome === '' || senha === '') {
      alert('Digite nome e senha!');
      return;
    }

    try {
      // ==============================
      // 1️⃣ BUSCAR BARBEIROS (ADM)
      // ==============================
      const snapshotUsuarios = await firebase
        .database()
        .ref('usuarios')
        .once('value');

      if (snapshotUsuarios.exists()) {
        const usuarios = snapshotUsuarios.val();

        for (let key in usuarios) {
          const user = usuarios[key];

          if (
            user.nome.toLowerCase() === nome &&
            user.senha === senha
          ) {
            alert('Login BARBEIRO realizado!');
            this.props.navigation.navigate('Barbeiro');
            return;
          }
        }
      }

      // ==============================
      // 2️⃣ BUSCAR CLIENTES
      // ==============================
      const snapshotClientes = await firebase
        .database()
        .ref('cliente')
        .once('value');

      if (snapshotClientes.exists()) {
        const clientes = snapshotClientes.val();

        for (let key in clientes) {
          const cliente = clientes[key];

          if (
            cliente.nome.toLowerCase() === nome &&
            cliente.senha === senha
          ) {
            alert('Login CLIENTE realizado!');
            this.props.navigation.navigate('Home');
            return;
          }
        }
      }

      // ==============================
      // 3️⃣ NÃO ACHOU NINGUÉM
      // ==============================
      alert('Usuário não encontrado!');
    } catch (error) {
      alert('Erro ao conectar com Firebase');
      console.log(error);
    }
  }

  render() {
    return (
      <View>
        <TextInput
          style={estilos.input}
          placeholder="Nome"
          onChangeText={(t) => (this.nome = t)}
        />
        <TextInput
          style={estilos.input}
          placeholder="Senha"
          secureTextEntry
          onChangeText={(t) => (this.senha = t)}
        />
        <TouchableHighlight
          style={estilos.botao}
          onPress={() => this.login()}
        >
          <Text style={estilos.txtBotao}>Entrar</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const estilos = StyleSheet.create({
  txtBotao: {
    fontSize: 25,
    alignSelf: 'center',
  },
  botao: {
    height: 50,
    borderWidth: 1,
    margin: 10,
    borderRadius: 8,
    padding: 5,
    justifyContent: 'center',
    backgroundColor: '#00FFFF',
  },
  input: {
    height: 50,
    fontSize: 25,
    borderWidth: 1,
    margin: 10,
    borderRadius: 8,
    paddingLeft: 10,
  },
});

export default Login;
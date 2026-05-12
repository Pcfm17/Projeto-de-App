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
      const snapshot = await firebase
        .database()
        .ref('cliente')
        .once('value');

      if (snapshot.exists()) {
        const clientes = snapshot.val();

        for (let key in clientes) {
          const cliente = clientes[key];

          if (
            cliente.nome.toLowerCase() === nome &&
            cliente.senha === senha
          ) {
            if (nome.includes('barbeiro')) {
              alert('Login BARBEIRO realizado!');
              this.props.navigation.navigate('Barbeiro');
            } else {
              alert('Login CLIENTE realizado!');
              this.props.navigation.navigate('Home');
            }
            return;
          }
        }
      }

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
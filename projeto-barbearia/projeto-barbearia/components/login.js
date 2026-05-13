// login.js
import * as React from 'react';
import { TextInput, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import firebase from '../config/config';
import { estilosGlobais, cores } from './Estilos';

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
          if (cliente.ativo === false) continue; // pula clientes inativos
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
      <ScrollView
        contentContainerStyle={estilosGlobais.telaRolavel}
        keyboardShouldPersistTaps="handled"
      >
        {/* Cabeçalho */}
        <Text style={estilosGlobais.titulo}>💈 Entrar</Text>
        <Text style={estilosGlobais.subtitulo}>
          Acesse sua conta para continuar
        </Text>

        {/* Campo Nome */}
        <View style={estilosGlobais.campoGrupo}>
          <Text style={estilosGlobais.label}>Nome</Text>
          <TextInput
            style={estilosGlobais.input}
            placeholder="Digite seu nome"
            placeholderTextColor={cores.textoSuave}
            autoCapitalize="none"
            onChangeText={(t) => (this.nome = t)}
          />
        </View>

        {/* Campo Senha */}
        <View style={estilosGlobais.campoGrupo}>
          <Text style={estilosGlobais.label}>Senha</Text>
          <TextInput
            style={estilosGlobais.input}
            placeholder="Digite sua senha"
            placeholderTextColor={cores.textoSuave}
            secureTextEntry
            onChangeText={(t) => (this.senha = t)}
          />
        </View>

        {/* Botão Entrar */}
        <TouchableOpacity
          style={[estilosGlobais.botaoPrimario, { marginTop: 24 }]}
          onPress={() => this.login()}
        >
          <Text style={estilosGlobais.textoBotao}>Entrar</Text>
        </TouchableOpacity>

        {/* Divisor */}
        <View style={estilosGlobais.divisor} />

        {/* Link para cadastro */}
        <TouchableOpacity
          style={estilosGlobais.botaoOutline}
          onPress={() => this.props.navigation.navigate('Cadastrar')}
        >
          <Text style={estilosGlobais.textoBotaoOutline}>
            Não tem conta? Cadastre-se
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

export default Login;
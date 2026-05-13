// SalvarItens.js
import * as React from 'react';
import { TextInput, Text, View, TouchableOpacity, ScrollView, Vibration } from 'react-native';
import firebase from '../config/config';
import { estilosGlobais, cores } from './Estilos';

class SalvarItens extends React.Component {
  constructor(props) {
    super(props);
    this.nome = '';
    this.telefone = '';
    this.senha = '';
  }

  salvar() {
    if (!this.nome.trim() || !this.telefone.trim() || !this.senha.trim()) {
      Vibration.vibrate(400); // erro
      alert('Preencha todos os campos!');
      return;
    }

    firebase.database().ref('/cliente').push({
      nome: this.nome.trim(),
      telefone: this.telefone.trim(),
      senha: this.senha.trim(),
    });

    Vibration.vibrate([0, 80, 60, 80]); // sucesso
    alert('Cliente cadastrado com sucesso!');
  }

  render() {
    return (
      <ScrollView
        contentContainerStyle={estilosGlobais.telaRolavel}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={estilosGlobais.titulo}>📋 Cadastro</Text>
        <Text style={estilosGlobais.subtitulo}>
          Crie sua conta para agendar serviços
        </Text>

        <View style={estilosGlobais.campoGrupo}>
          <Text style={estilosGlobais.label}>Nome</Text>
          <TextInput
            style={estilosGlobais.input}
            placeholder="Digite seu nome completo"
            placeholderTextColor={cores.textoSuave}
            onChangeText={(t) => (this.nome = t)}
          />
        </View>

        <View style={estilosGlobais.campoGrupo}>
          <Text style={estilosGlobais.label}>Telefone</Text>
          <TextInput
            style={estilosGlobais.input}
            placeholder="(11) 99999-9999"
            placeholderTextColor={cores.textoSuave}
            keyboardType="phone-pad"
            onChangeText={(t) => (this.telefone = t)}
          />
        </View>

        <View style={estilosGlobais.campoGrupo}>
          <Text style={estilosGlobais.label}>Senha</Text>
          <TextInput
            style={estilosGlobais.input}
            placeholder="Crie uma senha"
            placeholderTextColor={cores.textoSuave}
            secureTextEntry
            onChangeText={(t) => (this.senha = t)}
          />
        </View>

        <TouchableOpacity
          style={[estilosGlobais.botaoSucesso, { marginTop: 24 }]}
          onPress={() => this.salvar()}
        >
          <Text style={estilosGlobais.textoBotao}>Cadastrar</Text>
        </TouchableOpacity>

        <View style={estilosGlobais.divisor} />

        <TouchableOpacity
          style={estilosGlobais.botaoOutline}
          onPress={() => this.props.navigation.navigate('Login')}
        >
          <Text style={estilosGlobais.textoBotaoOutline}>
            Já tem conta? Entrar
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

export default SalvarItens;
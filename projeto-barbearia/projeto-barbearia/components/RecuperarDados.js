// RecuperarDados.js
import * as React from 'react';
import { Text, View, TextInput, TouchableOpacity, ScrollView, Vibration } from 'react-native';
import firebase from '../config/config';
import { estilosGlobais, cores } from './Estilos';

class RecuperarDados extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      busca: '',
      clientes: [],
      carregando: false,
      buscado: false,
    };
  }

  // Vibra diferente dependendo do resultado: sucesso ou erro
  vibrarSucesso() {
    Vibration.vibrate([0, 80, 60, 80]); // dois pulsos curtos = sucesso
  }

  vibrarErro() {
    Vibration.vibrate(400); // pulso longo = erro / não encontrado
  }

  async buscar() {
    const termo = this.state.busca.trim().toLowerCase();

    if (termo === '') {
      alert('Digite um nome para buscar!');
      this.vibrarErro();
      return;
    }

    this.setState({ carregando: true, clientes: [], buscado: false });

    try {
      const snapshot = await firebase.database().ref('cliente').once('value');

      if (snapshot.exists()) {
        const dados = snapshot.val();

        const resultados = Object.keys(dados)
          .filter((key) => {
            const cliente = dados[key];
            return cliente.nome && cliente.nome.toLowerCase().includes(termo);
          })
          .map((key) => ({
            id: key,
            ...dados[key],
          }));

        this.setState({ clientes: resultados, buscado: true });

        if (resultados.length === 0) {
          this.vibrarErro();
          alert('Nenhum cliente encontrado.');
        } else {
          this.vibrarSucesso();
        }
      } else {
        this.setState({ buscado: true });
        this.vibrarErro();
        alert('Nenhum cliente cadastrado.');
      }
    } catch (error) {
      this.vibrarErro();
      alert('Erro ao buscar dados: ' + error.message);
      console.log(error);
    } finally {
      this.setState({ carregando: false });
    }
  }

  async buscarTodos() {
    this.setState({ carregando: true, clientes: [], buscado: false, busca: '' });

    try {
      const snapshot = await firebase.database().ref('cliente').once('value');

      if (snapshot.exists()) {
        const dados = snapshot.val();

        const lista = Object.keys(dados).map((key) => ({
          id: key,
          ...dados[key],
        }));

        this.setState({ clientes: lista, buscado: true });
        this.vibrarSucesso();
      } else {
        this.setState({ buscado: true });
        this.vibrarErro();
        alert('Nenhum cliente cadastrado.');
      }
    } catch (error) {
      this.vibrarErro();
      alert('Erro ao buscar dados: ' + error.message);
      console.log(error);
    } finally {
      this.setState({ carregando: false });
    }
  }

  renderCliente(item) {
    return (
      <View style={estilosGlobais.cartao}>
        <Text style={[estilosGlobais.textoNormal, { fontWeight: 'bold', fontSize: 16 }]}>
          👤 {item.nome}
        </Text>

        <View style={estilosGlobais.divisor} />

        <View style={estilosGlobais.linhaDados}>
          <Text style={estilosGlobais.chaveDado}>Telefone</Text>
          <Text style={estilosGlobais.valorDado}>{item.telefone || '—'}</Text>
        </View>

        <View style={estilosGlobais.linhaDados}>
          <Text style={estilosGlobais.chaveDado}>ID</Text>
          <Text style={[estilosGlobais.valorDado, { fontSize: 11, color: cores.textoSuave }]}>
            {item.id}
          </Text>
        </View>
      </View>
    );
  }

  render() {
    const { busca, clientes, carregando, buscado } = this.state;

    return (
      <ScrollView contentContainerStyle={estilosGlobais.telaRolavel}>
        <Text style={estilosGlobais.titulo}>🔍 Recuperar Dados</Text>
        <Text style={estilosGlobais.subtitulo}>Busque clientes pelo nome ou liste todos</Text>

        <View style={estilosGlobais.campoGrupo}>
          <Text style={estilosGlobais.label}>Nome do cliente</Text>
          <TextInput
            style={estilosGlobais.input}
            placeholder="Ex: João Silva"
            placeholderTextColor={cores.textoSuave}
            value={busca}
            onChangeText={(t) => this.setState({ busca: t })}
          />
        </View>

        <TouchableOpacity
          style={estilosGlobais.botaoPrimario}
          onPress={() => this.buscar()}
          disabled={carregando}
        >
          <Text style={estilosGlobais.textoBotao}>
            {carregando ? 'Buscando...' : 'Buscar por nome'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={estilosGlobais.botaoSecundario}
          onPress={() => this.buscarTodos()}
          disabled={carregando}
        >
          <Text style={estilosGlobais.textoBotao}>Ver todos os clientes</Text>
        </TouchableOpacity>

        {buscado && <View style={estilosGlobais.divisor} />}

        {buscado && clientes.length > 0 && (
          <Text style={[estilosGlobais.textoSuave, { marginBottom: 12 }]}>
            {clientes.length} cliente(s) encontrado(s)
          </Text>
        )}

        {clientes.map((item) => (
          <View key={item.id}>{this.renderCliente(item)}</View>
        ))}
      </ScrollView>
    );
  }
}

export default RecuperarDados;
// Removerdados.js
import * as React from 'react';
import { Text, View, TextInput, TouchableOpacity, ScrollView, Alert, Vibration } from 'react-native';
import firebase from '../config/config';
import { estilosGlobais, cores } from './Estilos';

class RemoverDados extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nomeBusca: '',
      clienteEncontrado: null,
      clienteId: null,
      carregando: false,
      etapa: 'busca',
    };
  }

  vibrarSucesso() {
    Vibration.vibrate([0, 80, 60, 80]);
  }

  vibrarErro() {
    Vibration.vibrate(400);
  }

  vibrarConfirmacao() {
    // Três pulsos curtos = ação importante executada
    Vibration.vibrate([0, 100, 80, 100, 80, 100]);
  }

  async buscarCliente() {
    const termo = this.state.nomeBusca.trim().toLowerCase();

    if (termo === '') {
      alert('Digite o nome do cliente!');
      this.vibrarErro();
      return;
    }

    this.setState({ carregando: true });

    try {
      const snapshot = await firebase.database().ref('cliente').once('value');

      if (snapshot.exists()) {
        const dados = snapshot.val();

        for (let key in dados) {
          const cliente = dados[key];

          if (cliente.nome && cliente.nome.toLowerCase() === termo) {
            this.vibrarSucesso();
            this.setState({
              clienteEncontrado: cliente,
              clienteId: key,
              etapa: 'confirmar',
            });
            return;
          }
        }

        this.vibrarErro();
        alert('Cliente não encontrado.');
      } else {
        this.vibrarErro();
        alert('Nenhum cliente cadastrado.');
      }
    } catch (error) {
      this.vibrarErro();
      alert('Erro ao buscar cliente: ' + error.message);
      console.log(error);
    } finally {
      this.setState({ carregando: false });
    }
  }

  removerCliente() {
    const { clienteId, clienteEncontrado } = this.state;

    Alert.alert(
      'Confirmar remoção',
      `Tem certeza que deseja remover "${clienteEncontrado.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            this.setState({ carregando: true });

            try {
              await firebase.database().ref('cliente/' + clienteId).remove();

              this.vibrarConfirmacao();
              alert('Cliente removido com sucesso!');

              this.setState({
                etapa: 'busca',
                nomeBusca: '',
                clienteEncontrado: null,
                clienteId: null,
              });
            } catch (error) {
              this.vibrarErro();
              alert('Erro ao remover cliente: ' + error.message);
              console.log(error);
            } finally {
              this.setState({ carregando: false });
            }
          },
        },
      ]
    );
  }

  render() {
    const { nomeBusca, clienteEncontrado, etapa, carregando } = this.state;

    return (
      <ScrollView contentContainerStyle={estilosGlobais.telaRolavel}>
        <Text style={estilosGlobais.titulo}>🗑️ Remover Cliente</Text>
        <Text style={estilosGlobais.subtitulo}>
          {etapa === 'busca'
            ? 'Busque o cliente pelo nome'
            : `Cliente encontrado: ${clienteEncontrado?.nome}`}
        </Text>

        {etapa === 'busca' && (
          <>
            <View style={estilosGlobais.campoGrupo}>
              <Text style={estilosGlobais.label}>Nome do cliente</Text>
              <TextInput
                style={estilosGlobais.input}
                placeholder="Digite o nome exato"
                placeholderTextColor={cores.textoSuave}
                value={nomeBusca}
                onChangeText={(t) => this.setState({ nomeBusca: t })}
              />
            </View>

            <TouchableOpacity
              style={estilosGlobais.botaoPrimario}
              onPress={() => this.buscarCliente()}
              disabled={carregando}
            >
              <Text style={estilosGlobais.textoBotao}>
                {carregando ? 'Buscando...' : 'Buscar cliente'}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {etapa === 'confirmar' && (
          <>
            <View style={estilosGlobais.cartao}>
              <View style={estilosGlobais.linhaDados}>
                <Text style={estilosGlobais.chaveDado}>Nome</Text>
                <Text style={estilosGlobais.valorDado}>{clienteEncontrado?.nome}</Text>
              </View>

              <View style={estilosGlobais.linhaDados}>
                <Text style={estilosGlobais.chaveDado}>Telefone</Text>
                <Text style={estilosGlobais.valorDado}>{clienteEncontrado?.telefone || '—'}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={estilosGlobais.botaoPerigo}
              onPress={() => this.removerCliente()}
              disabled={carregando}
            >
              <Text style={estilosGlobais.textoBotao}>
                {carregando ? 'Removendo...' : 'Confirmar remoção'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={estilosGlobais.botaoOutline}
              onPress={() =>
                this.setState({
                  etapa: 'busca',
                  nomeBusca: '',
                  clienteEncontrado: null,
                  clienteId: null,
                })
              }
            >
              <Text style={estilosGlobais.textoBotaoOutline}>Cancelar</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    );
  }
}

export default RemoverDados;
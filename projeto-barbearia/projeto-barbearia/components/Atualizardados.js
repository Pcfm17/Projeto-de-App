// Atualizardados.js
import * as React from 'react';
import { Text, View, TextInput, TouchableOpacity, ScrollView, Alert, Vibration } from 'react-native';
import firebase from '../config/config';
import { estilosGlobais, cores } from './Estilos';

class AtualizarDados extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nomeBusca: '',
      clienteEncontrado: null,
      clienteId: null,
      novoNome: '',
      novoTelefone: '',
      novaSenha: '',
      etapa: 'busca',
      carregando: false,
    };
  }

  vibrarSucesso() {
    Vibration.vibrate([0, 80, 60, 80]);
  }

  vibrarErro() {
    Vibration.vibrate(400);
  }

  vibrarConfirmacao() {
    Vibration.vibrate([0, 100, 80, 100, 80, 100]);
  }

  async buscarCliente() {
    const termo = this.state.nomeBusca.trim().toLowerCase();

    if (termo === '') {
      this.vibrarErro();
      alert('Digite o nome do cliente!');
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
              novoNome: cliente.nome,
              novoTelefone: cliente.telefone || '',
              novaSenha: '',
              etapa: 'editar',
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

  salvarAtualizacao() {
    const { clienteId, novoNome, novoTelefone, novaSenha, clienteEncontrado } = this.state;

    if (!novoNome.trim()) {
      this.vibrarErro();
      alert('O nome não pode ficar vazio!');
      return;
    }

    Alert.alert('Confirmar atualização', `Atualizar "${clienteEncontrado.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Atualizar',
        onPress: async () => {
          this.setState({ carregando: true });

          try {
            // Monta o objeto com os dados atualizados
            // Se novaSenha estiver vazio, mantém a senha atual
            const dadosAtualizados = {
              nome: novoNome.trim(),
              telefone: novoTelefone.trim(),
              senha: novaSenha.trim() !== '' ? novaSenha.trim() : clienteEncontrado.senha,
            };

            // update() altera apenas os campos passados, sem apagar outros
            await firebase.database().ref('cliente/' + clienteId).update(dadosAtualizados);

            this.vibrarConfirmacao();
            alert('Dados atualizados com sucesso!');

            this.setState({
              etapa: 'busca',
              nomeBusca: '',
              clienteEncontrado: null,
              clienteId: null,
              novoNome: '',
              novoTelefone: '',
              novaSenha: '',
            });
          } catch (error) {
            this.vibrarErro();
            alert('Erro ao atualizar dados: ' + error.message);
            console.log(error);
          } finally {
            this.setState({ carregando: false });
          }
        },
      },
    ]);
  }

  render() {
    const { nomeBusca, novoNome, novoTelefone, novaSenha, etapa, carregando, clienteEncontrado } = this.state;

    return (
      <ScrollView contentContainerStyle={estilosGlobais.telaRolavel}>
        <Text style={estilosGlobais.titulo}>✏️ Atualizar Dados</Text>
        <Text style={estilosGlobais.subtitulo}>
          {etapa === 'busca' ? 'Busque o cliente pelo nome' : `Editando: ${clienteEncontrado?.nome}`}
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

        {etapa === 'editar' && (
          <>
            <View style={estilosGlobais.campoGrupo}>
              <Text style={estilosGlobais.label}>Novo nome</Text>
              <TextInput
                style={estilosGlobais.input}
                value={novoNome}
                onChangeText={(t) => this.setState({ novoNome: t })}
              />
            </View>

            <View style={estilosGlobais.campoGrupo}>
              <Text style={estilosGlobais.label}>Novo telefone</Text>
              <TextInput
                style={estilosGlobais.input}
                value={novoTelefone}
                onChangeText={(t) => this.setState({ novoTelefone: t })}
                keyboardType="phone-pad"
              />
            </View>

            <View style={estilosGlobais.campoGrupo}>
              <Text style={estilosGlobais.label}>Nova senha (opcional)</Text>
              <TextInput
                style={estilosGlobais.input}
                value={novaSenha}
                placeholder="Deixe em branco para manter a atual"
                placeholderTextColor={cores.textoSuave}
                onChangeText={(t) => this.setState({ novaSenha: t })}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={estilosGlobais.botaoAviso}
              onPress={() => this.salvarAtualizacao()}
              disabled={carregando}
            >
              <Text style={estilosGlobais.textoBotao}>
                {carregando ? 'Salvando...' : 'Salvar alterações'}
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

export default AtualizarDados;
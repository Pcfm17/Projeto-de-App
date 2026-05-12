//App.js:
import React, { useState } from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { db } from './config/config';
import { ref, get, set } from 'firebase/database';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import SalvarItens from './components/SalvarItens';
import Login from './components/login';

const Navegacao = createBottomTabNavigator();

// Criando os navegadores — obrigatório antes de usar dentro das funções
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// FUNÇÃO GLOBAL PARA ESTILIZAR INPUTS COM TEMA
const inputStyle = (tema) => ({
  borderWidth: 1,
  borderColor: tema.texto,
  color: tema.texto,
  padding: 10,
  marginBottom: 15,
  borderRadius: 8,
});

// ─────────────────────────────────────────
// DADOS DOS SERVIÇOS
// Ficam fora das funções para que todas as telas (Geral, Feminina, Masculino)
// possam acessar. Usamos const pois os valores não mudam.
// São arrays de objetos — cada objeto é um serviço com suas informações.
// ─────────────────────────────────────────

const servicosFemininos = [
  {
    id: '1',
    nome: 'Corte de cabelo',
    descricao: 'Manutenção ou mudança de visual com acabamento profissional',
    preco: 'R$ 65,00',
    imagem:
      'https://tse2.mm.bing.net/th/id/OIP.d2EkYMqyxwVHuHZVTfxUAAHaE8?pid=Api&P=0&h=180',
  },
  {
    id: '2',
    nome: 'Escova e modelagem',
    descricao: 'Fios alinhados e modelados do jeito que você quiser',
    preco: 'R$ 55,00',
    imagem:
      'https://tse2.mm.bing.net/th/id/OIP.IP0V4tbeGM4v3w4DatOh7AHaD2?pid=Api&P=0&h=180',
  },
  {
    id: '3',
    nome: 'Pintura e retoque de raiz',
    descricao: 'Cobertura de raiz com produtos de alta qualidade',
    preco: 'R$ 120,00',
    imagem:
      'https://areademulher.r7.com/wp-content/uploads/2021/01/retoque-de-raiz-como-retocar-o-cabelo-em-casa-3-960x640.jpg',
  },
  {
    id: '4',
    nome: 'Luzes, mechas ou balayage',
    descricao: 'Técnicas modernas para iluminar e dar movimento aos fios',
    preco: 'R$ 180,00',
    imagem:
      'https://cursodecabeleireira.com/wp-content/uploads/2020/01/mechas.jpg',
  },
  {
    id: '5',
    nome: 'Hidratação capilar',
    descricao: 'Hidratação, nutrição ou reconstrução para cabelos danificados',
    preco: 'R$ 85,00',
    imagem:
      'https://tse2.mm.bing.net/th/id/OIP.L71Kncg5onDnMqp1CAaLSwHaDY?pid=Api&P=0&h=180',
  },
];

const servicosMasculinos = [
  {
    id: '1',
    nome: 'Corte de cabelo',
    descricao: 'Corte masculino moderno com acabamento na navalha',
    preco: 'R$ 45,00',
    imagem:
      'https://tudoz.com.br/wp-content/uploads/2023/09/cortes-de-cabelo-masculino-1024x683.webp',
  },
  {
    id: '2',
    nome: 'Barba',
    descricao: 'Modelagem e aparação da barba com toalha quente e navalha',
    preco: 'R$ 35,00',
    imagem:
      'https://img.freepik.com/fotos-gratis/barba-de-corte-de-homem-bonito-em-um-salao-de-barbeiro_1303-20970.jpg',
  },
  {
    id: '3',
    nome: 'Cabelo + Barba',
    descricao: 'Combo completo de corte e barba com desconto especial',
    preco: 'R$ 70,00',
    imagem:
      'https://i.pinimg.com/originals/31/8f/23/318f236870cc70168b147c6e06c991a8.jpg',
  },
  {
    id: '4',
    nome: 'Pintura e retoque de raiz',
    descricao: 'Cobertura de cabelos brancos com resultado natural',
    preco: 'R$ 80,00',
    imagem:
      'https://i.pinimg.com/originals/a7/31/0a/a7310a3f3ca89e5bb8e4bb4e397f8ca6.jpg',
  },
];

const temas = {
  escuro: { fundo: '#1a1a2e', texto: '#ffffff', botao: '#e94560' },
  claro: { fundo: '#ffffff', texto: '#1a1a2e', botao: '#1a1a2e' },
};

// ─────────────────────────────────────────
// COMPONENTE REUTILIZÁVEL — CARD DE SERVIÇO
// Criado uma vez e usado nas três telas (Geral, Feminina, Masculino)
// Recebe "item" como prop — que é um objeto do array de serviços
// Evita repetir o mesmo código em cada tela (reusabilidade)
/* Imagem do serviço vinda do link no array */
/* Nome, descrição e preço vêm do objeto do array */
// ─────────────────────────────────────────

function CardServico({ item, tema }) {
  // tema padrão caso esqueça de passar no futuro
  const temaSeguro = tema || {
    fundo: '#fff',
    texto: '#000',
    botao: '#2e7d32',
  };

  return (
    <View style={[styles.card, { backgroundColor: temaSeguro.fundo }]}>
      <Image source={{ uri: item.imagem }} style={styles.imagem} />

      <View style={styles.info}>
        <Text style={[styles.nome, { color: temaSeguro.texto }]}>
          {item.nome}
        </Text>

        <Text style={{ color: temaSeguro.texto }}>{item.descricao}</Text>

        <Text style={{ color: temaSeguro.botao }}>{item.preco}</Text>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────
// TELA PRINCIPAL — HOME
// Mostra imagem, texto de apresentação e botão para Tipos de serviço
// navigation é injetado automaticamente pelo Drawer Navigator
// tema vem do App.js via prop para controle de tema claro/escuro
//Por que o navigation está disponível dentro dessa função sem precisar importar nada? Esse { navigation } que está nos parâmetros da função é a prop que o Drawer Navigator injeta automaticamente em toda tela registrada nele. Você não precisa importar nem criar nada, ele já chega pronto.
//Por que o tema também aparece como prop nas funções, tipo { navigation, tema }? De onde ele vem e por que foi feito assim? "é para a configuracao pois penso que o tema vai servir para isso. como assim ? é mais para mudar o layt para o tema escuro ou para um tem mais claro como esta agora"
// ─────────────────────────────────────────

function TelaPrincipal({ navigation, tema }) {
  const goToDetails = () => {
    navigation.navigate('Tipos de serviço');
  };

  return (
    <View style={{ flex: 1, backgroundColor: tema.fundo, padding: 15 }}>
      <Image
        source={{
          uri: 'https://img.freepik.com/fotos-premium/uma-vista-interior-de-uma-barbearia-elegante-e-de-luxo-um-salao-de-beleza-um-salon-de-beleza_1025753-189608.jpg',
        }}
        style={{ width: '100%', height: 200, borderRadius: 10 }}
      />

      <Text
        style={{
          color: tema.texto,
          marginTop: 15,
          fontSize: 18,
          fontWeight: 'bold',
        }}>
        Mais do que cortar cabelo, aqui a gente cuida da sua autoestima.
      </Text>

      <Text style={{ color: tema.texto, marginTop: 10 }}>
        Nossa barbearia nasceu com uma ideia simples: resgatar a experiência de
        sentar na cadeira, relaxar e sair se sentindo melhor do que entrou.
      </Text>

      <Text style={{ color: tema.texto, marginTop: 10 }}>
        Aqui você não é só mais um cliente. É parte da casa.
      </Text>

      <Text style={{ color: tema.texto, marginTop: 10 }}>
        Ambiente acolhedor, profissionais apaixonados e clima de barbearia raiz
        com toque moderno.
      </Text>

      <TouchableOpacity
        onPress={goToDetails}
        style={{
          backgroundColor: tema.botao,
          padding: 12,
          borderRadius: 8,
          marginTop: 20,
        }}>
        <Text
          style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
          Tipos de serviço
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ─────────────────────────────────────────
// TELAS DE TIPOS DE SERVIÇO
// Cada tela usa FlatList para mostrar os cards
// FlatList é melhor que ScrollView para listas longas pois
// só renderiza os itens visíveis na tela, deixando o app mais leve
// ─────────────────────────────────────────

// Mostra todos os serviços (femininos + masculinos) juntos
// O spread operator (...) "espalha" os dois arrays em um só
function TelaGeral({ navigation, tema }) {
  const goToDetails = () => {
    navigation.navigate('Agendamento');
  };
  //O que você acha que o ... faz aqui? O ... se chama spread operator. Ele "espalha" os itens de um array dentro de outro
  return (
    <FlatList
      data={[...servicosFemininos, ...servicosMasculinos]}
      // index.toString() pois os ids de femininos e masculinos se repetem (1,2,3...)
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => <CardServico item={item} />}
      // ListFooterComponent aparece depois do último item da lista
      ListFooterComponent={
        <TouchableOpacity onPress={goToDetails} style={styles.botaoAgendar}>
          <Text style={styles.botaoAgendarTexto}>Agendar agora</Text>
        </TouchableOpacity>
      }
    />
  );
}

// Mostra apenas os serviços femininos
function TelaFeminina({ navigation, tema }) {
  return (
    <FlatList
      data={servicosFemininos} //é a lista de dados que a FlatList vai usar
      // keyExtractor dá uma identidade única para cada item
      // o React usa isso para saber qual item atualizar sem re-renderizar a lista toda
      keyExtractor={(item) => item.id} //Ele serve pra dar uma identidade única pra cada item da lista. O React precisa disso pra saber qual item atualizar quando algo mudar, sem precisar re-renderizar a lista inteira. É como um CPF de cada card.
      renderItem={({ item }) => <CardServico item={item} />} //Ele é responsável por desenhar cada item da lista. Pra cada objeto dentro do data, o renderItem chama o CardServico passando aquele objeto como prop item. O id não filtra nada aqui — a FlatList já sabe quais são os itens femininos porque o data recebe servicosFemininos.
    />
  );
}

// Mostra apenas os serviços masculinos
function TelaMasculino({ navigation, tema }) {
  return (
    <FlatList
      data={servicosMasculinos} //é a lista de dados que a FlatList vai usar
      keyExtractor={(item) => item.id} //Ele serve pra dar uma identidade única pra cada item da lista. O React precisa disso pra saber qual item atualizar quando algo mudar, sem precisar re-renderizar a lista inteira. É como um CPF de cada card.
      renderItem={({ item }) => <CardServico item={item} />} //Ele é responsável por desenhar cada item da lista. Pra cada objeto dentro do data, o renderItem chama o CardServico passando aquele objeto como prop item. O id não filtra nada aqui — a FlatList já sabe quais são os itens femininos porque o data recebe servicosFemininos.
    />
  );
}

// ─────────────────────────────────────────
// TELA TIPOS — TAB NAVIGATOR DE SERVIÇOS
// Tab Navigator interno com 3 abas: Geral, Mulheres, Homens
// screenOptions recebe uma função com "route" para saber qual aba está ativa
// e retornar o ícone correto para cada uma
// "color" e "size" são injetados automaticamente pelo Tab Navigator
// "color" muda conforme a aba está ativa ou inativa
// ─────────────────────────────────────────

function TelaTipos({ navigation, tema }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: tema.botao,
        tabBarInactiveTintColor: tema.texto,
        tabBarStyle: { backgroundColor: tema.fundo },

        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Geral') iconName = 'cut-outline';
          else if (route.name === 'Mulheres') iconName = 'woman-outline';
          else if (route.name === 'Homens') iconName = 'man-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen name="Geral">
        {(props) => <TelaGeral {...props} tema={tema} />}
      </Tab.Screen>

      <Tab.Screen name="Mulheres">
        {(props) => <TelaFeminina {...props} tema={tema} />}
      </Tab.Screen>

      <Tab.Screen name="Homens">
        {(props) => <TelaMasculino {...props} tema={tema} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// ─────────────────────────────────────────
// TELA AVALIAÇÃO — vazia por enquanto
// ─────────────────────────────────────────

function TelaAvaliacao({ navigation, tema }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: tema.fundo,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{ color: tema.texto, fontSize: 18 }}>
        Em breve você poderá avaliar nossos serviços ⭐
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────
// SUBTELAS DO AGENDAMENTO
// TelaDia → TelaHorario → TelaResultado
// Navegação feita pelo Tab Navigator dentro de TelaAgendamento
// useState para guardar o dia selecionado pelo usuário
// ─────────────────────────────────────────

function TelaDia({ navigation, tema }) {
  const dias = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

  return (
    <View style={{ flex: 1, backgroundColor: tema.fundo }}>
      <Text style={[agendaStyles.titulo, { color: tema.texto }]}>Escolha o dia</Text>
      <FlatList
        data={dias}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[agendaStyles.card, { backgroundColor: tema.botao }]}
            // Passa o dia selecionado como parâmetro para a aba Hora
            onPress={() => navigation.navigate('Hora', { diaSelecionado: item })}
          >
            <Text style={[agendaStyles.textoCard, { color: '#fff' }]}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

function TelaHorario({ navigation, route, tema }) {
  const horarios = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  // Recebe o dia que foi selecionado na TelaDia
  const diaSelecionado = route.params?.diaSelecionado;

  return (
    <View style={{ flex: 1, backgroundColor: tema.fundo }}>
      <Text style={[agendaStyles.titulo, { color: tema.texto }]}>Escolha o horário</Text>
      <FlatList
        data={horarios}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[agendaStyles.card, { backgroundColor: tema.botao }]}
            // Passa o dia e o horário selecionado para TelaResultado
            onPress={() => navigation.navigate('Resultado', { diaSelecionado, horarioSelecionado: item })}
          >
            <Text style={[agendaStyles.textoCard, { color: '#fff' }]}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

function TelaResultado({ navigation, route, tema }) {
  // Recebe o dia e o horário selecionados nas telas anteriores
  const diaSelecionado = route.params?.diaSelecionado;
  const horarioSelecionado = route.params?.horarioSelecionado;

  return (
    <View style={{ flex: 1, backgroundColor: tema.fundo, padding: 20 }}>
      <Text style={{ color: tema.texto, fontSize: 22, fontWeight: 'bold', marginBottom: 20 }}>
        🎉 Resumo do agendamento
      </Text>

      {/* Mostra o dia e horário selecionados */}
      <Text style={{ color: tema.texto, fontSize: 16, marginBottom: 8 }}>
        📅 Dia: {diaSelecionado || 'Não selecionado'}
      </Text>
      <Text style={{ color: tema.texto, fontSize: 16, marginBottom: 30 }}>
        🕐 Horário: {horarioSelecionado || 'Não selecionado'}
      </Text>

      {/* Se já tiver cadastro, mostra campos de login para confirmar */}
      <Text style={{ color: tema.texto, fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
        Já tem cadastro? Entre para confirmar:
      </Text>
      <TextInput
        placeholder="Nome"
        placeholderTextColor={tema.texto}
        style={{ borderWidth: 1, borderColor: tema.texto, color: tema.texto, padding: 10, borderRadius: 8, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Senha"
        placeholderTextColor={tema.texto}
        secureTextEntry
        style={{ borderWidth: 1, borderColor: tema.texto, color: tema.texto, padding: 10, borderRadius: 8, marginBottom: 15 }}
      />
      <TouchableOpacity
        style={{ backgroundColor: tema.botao, padding: 12, borderRadius: 8, marginBottom: 20 }}
        onPress={() => alert('Agendamento confirmado!')}
      >
        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Confirmar agendamento</Text>
      </TouchableOpacity>

      {/* Se não tiver cadastro, botão para cadastrar */}
      <Text style={{ color: tema.texto, textAlign: 'center', marginBottom: 10 }}>Não tem cadastro?</Text>
      <TouchableOpacity
        style={{ backgroundColor: '#9b59b6', padding: 12, borderRadius: 8 }}
        onPress={() => navigation.navigate('Cadastrar')}
      >
        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Fazer cadastro</Text>
      </TouchableOpacity>
    </View>
  );
}

const agendaStyles = StyleSheet.create({
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    margin: 20,
  },

  card: {
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 15,
    alignItems: 'center',
  },

  textoCard: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

// ─────────────────────────────────────────
// TELA AGENDAMENTO — TAB NAVIGATOR
// Tab Navigator com 3 etapas: Dia → Hora → Resultado
// ─────────────────────────────────────────
//Por que o Ionicons precisa ser importado do @expo/vector-icons e não vem junto com o React Native automaticamente? Só complementa com mais detalhes: o React Native é enxuto por padrão e não vem com ícones porque isso aumentaria o tamanho do app. O @expo/vector-icons é uma biblioteca separada que traz vários pacotes de ícones (Ionicons, MaterialIcons, FontAwesome...) e você instala só quando precisar.
////screenOptions={({ route }) => ({ pq usar? pq as abas estao com diferentes nomes.
// tabBarIcon: ({ color, size }) => { De onde vêm esse color e size? Quem manda esses valores? o color e size vem do tab Navegation e os valores tambem, ele ja sabe o tamanho e a color padrao.
// let iconName; Por que o iconName foi declarado com let e não com const? pq o valor de let pode ser mudado nos if/else e const nao poderia ter essa mudança de valor.
function TelaAgendamento({ navigation, tema }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: tema.botao,
        tabBarInactiveTintColor: tema.texto,
        tabBarStyle: { backgroundColor: tema.fundo },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Dia') iconName = 'calendar-outline';
          else if (route.name === 'Hora') iconName = 'time-outline';
          else if (route.name === 'Resultado') iconName = 'checkmark-circle-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dia">{(props) => <TelaDia {...props} tema={tema} />}</Tab.Screen>
      <Tab.Screen name="Hora">{(props) => <TelaHorario {...props} tema={tema} />}</Tab.Screen>
      <Tab.Screen name="Resultado">{(props) => <TelaResultado {...props} tema={tema} />}</Tab.Screen>
    </Tab.Navigator>
  );
}

// Tela do barbeiro — onde chegam os agendamentos feitos pelos clientes
function TelaAdm({ navigation, tema }) {
  return (
    <View style={{ flex: 1, backgroundColor: tema.fundo, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: tema.texto, fontSize: 22, fontWeight: 'bold' }}>
        Área do Barbeiro 💈
      </Text>
      <Text style={{ color: tema.texto, marginTop: 10 }}>
        Aqui aparecerão os agendamentos dos clientes.
      </Text>
    </View>
  );
}

// Tela de configuração — onde o usuário escolhe tema claro ou escuro
function TelaConfiguracao({ navigation, tema, setTema }) {
  return (
    <View style={[styles.container, { backgroundColor: tema.fundo }]}>
      <Text style={[styles.tituloTema, { color: tema.texto }]}>Configurações</Text>
      <Text style={[styles.infoTema, { color: tema.texto, marginBottom: 10 }]}>Escolha um tema:</Text>
      {Object.keys(temas).map((nomeTema) => (
        <TouchableOpacity
          key={nomeTema}
          style={[styles.btn, { backgroundColor: temas[nomeTema].botao, marginVertical: 5 }]}
          onPress={() => setTema(temas[nomeTema])}
        >
          <Text style={styles.btnTxt}>{nomeTema.toUpperCase()}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: '#9b59b6', marginTop: 20 }]}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.btnTxt}>Voltar ao Início</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─────────────────────────────────────────
// APP PRINCIPAL
// NavigationContainer envolve tudo — obrigatório para a navegação funcionar
// Drawer Navigator é a navegação principal (menu lateral com 3 riscas)
// tema fica aqui pois é o estado central que controla todas as telas
// quando tema muda, todas as telas recebem o novo valor via prop
// ─────────────────────────────────────────
//Por que o tema precisa ser criado no App.js e passado como prop pra cada tela, em vez de cada tela ter seu próprio useState de tema? "pois ele precisa ser criado no app.js para que ele fique como se fosse o centro, quando ele muda ele manda para todas as funções poe isso ele esta no app.js para quando ele for mudado ele mande para todas funções e nessas funções esta chamando ela."
//Qual seria o problema disso comparado com ter um único tema no App.js passado pra todas as telas? "do jeito que  colocou o codigo ele nao estaria recebendo as mudancas no layt, ele só foi criado mas nao esta passando para as paginas as informações das mudanças"
export default function App() {
  const [tema, setTema] = useState(temas.claro);

  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Home"
        screenOptions={{
          drawerStyle: { backgroundColor: tema.fundo },
          drawerLabelStyle: { color: tema.texto },
          headerStyle: { backgroundColor: tema.fundo },
          headerTintColor: tema.texto,
        }}
      >
        <Drawer.Screen name="Home">{(props) => <TelaPrincipal {...props} tema={tema} />}</Drawer.Screen>
        <Drawer.Screen name="Tipos de serviço">{(props) => <TelaTipos {...props} tema={tema} />}</Drawer.Screen>
        <Drawer.Screen name="Avaliação">{(props) => <TelaAvaliacao {...props} tema={tema} />}</Drawer.Screen>
        <Drawer.Screen name="Agendamento">{(props) => <TelaAgendamento {...props} tema={tema} />}</Drawer.Screen>
        <Drawer.Screen name="Login" component={Login} />
        <Drawer.Screen name="Cadastrar" component={SalvarItens} />
        <Drawer.Screen name="Configuração">
          {(props) => <TelaConfiguracao {...props} tema={tema} setTema={setTema} />}
        </Drawer.Screen>

        {/* Tela do barbeiro — escondida do menu, acessível só após login */}
        <Drawer.Screen
          name="Barbeiro"
          options={{ drawerItemStyle: { display: 'none' } }}
        >
          {(props) => <TelaAdm {...props} tema={tema} />}
        </Drawer.Screen>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

// ─────────────────────────────────────────
// ESTILOS CENTRALIZADOS
// StyleSheet.create organiza todos os estilos em um só lugar
// Equivalente ao CSS no desenvolvimento web
// ─────────────────────────────────────────

const styles = StyleSheet.create({
  // Campos de input de texto
  texto_input: {},
  // Títulos
  titulo: {},
  // Card de serviço
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3,
    overflow: 'hidden',
  },
  // Imagem dentro do card
  imagem: { width: '100%', height: 150 },
  // Container das informações abaixo da imagem
  info: { padding: 12 },
  // Nome do serviço
  nome: { fontSize: 16, fontWeight: 'bold' },
  // Descrição do serviço
  descricao: { fontSize: 13, color: '#666', marginTop: 4 },
  // Preço do serviço
  preco: { fontSize: 15, fontWeight: 'bold', color: '#2e7d32', marginTop: 8 },
  // Botão de agendar na tela Geral
  botaoAgendar: {
    margin: 16,
    padding: 12,
    backgroundColor: '#2e7d32',
    borderRadius: 8,
  },
  // Texto do botão de agendar
  botaoAgendarTexto: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 20,
  },
  tituloTema: { fontSize: 26, fontWeight: 'bold' },
  info: { fontSize: 16 },
  btn: { padding: 12, borderRadius: 8, width: '80%', alignItems: 'center' },
  btnTxt: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
//OBS:
//O [] no final significa "roda só uma vez, quando o componente montar". Se deixasse uma variável dentro do [], rodaria toda vez que aquela variável mudasse.
//useEffect(() => {
// código que roda quando a tela abre
//}, []);
//

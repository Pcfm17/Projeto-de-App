## 👨‍💻 Autor
Paulo César Fachetti Motta
RA: 24.224.012-5
# 💈 BarberApp — Aplicativo de Barbearia com React Native com Firebase

> Projeto desenvolvido para a disciplina **CCP150 – Desenvolvimento de Aplicativos Móveis** do Centro Universitário FEI.  
> Professor: Isaac Jesus

---

## 📋 Visão Geral e Requisitos

O **BarberApp** é um aplicativo móvel completo para gerenciamento de uma barbearia/salão de beleza. A ideia surgiu da necessidade de digitalizar a experiência do cliente, permitindo que ele visualize os serviços disponíveis, realize agendamentos, deixe avaliações e gerencie sua conta — tudo pelo celular.

### Motivação

Muitas barbearias ainda dependem de ligações ou aplicativos de mensagem para marcar horários. O BarberApp resolve isso com uma interface moderna, intuitiva e diretamente integrada ao Firebase, centralizando o cadastro de clientes, agendamentos e avaliações em tempo real.

### Objetivo

Desenvolver uma aplicação React Native funcional que abranja:
- Apresentação visual dos serviços oferecidos (masculinos e femininos)
- Sistema de agendamento em etapas (dia → horário → confirmação)
- Autenticação de clientes e barbeiros via Firebase
- CRUD completo de clientes no Firebase Realtime Database
- Uso de sensor físico do dispositivo (acelerômetro) com feedback por vibração
- Tema claro/escuro configurável pelo usuário

### Requisitos atendidos

| Requisito | Status |
|-----------|--------|
| Mínimo de 6 telas distintas | ✅ 10+ telas |
| Navegação (Drawer + Tab Navigator) | ✅ |
| Imagens no app | ✅ |
| Interface e UX estilizada | ✅ |
| Banco de dados Firebase (CRUD completo) | ✅ |
| Sensor ou atuador (Acelerômetro + Vibração) | ✅ |

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Uso |
|-----------|-----|
| **React Native** | Framework principal do app |
| **Expo** | Ambiente de desenvolvimento e acesso a sensores nativos |
| **Firebase Realtime Database** | Banco de dados em nuvem (CRUD de clientes, agendamentos, avaliações) |
| **React Navigation** | Navegação entre telas (Drawer Navigator + Bottom Tab Navigator) |
| **expo-sensors (Accelerometer)** | Leitura do acelerômetro do dispositivo |
| **Vibration API (React Native)** | Atuador de vibração para feedback ao usuário |
| **Ionicons (@expo/vector-icons)** | Ícones nas abas de navegação |
| **StyleSheet (React Native)** | Estilização centralizada via `Estilos.js` |

---

## 🗂️ Estrutura do Projeto

```
/
├── App.js                   # Ponto de entrada, navegação principal, telas principais
├── config/
│   └── config.js            # Configuração do Firebase
└── components/
    ├── Estilos.js            # Estilos e paleta de cores globais
    ├── login.js              # Tela de login
    ├── SalvarItens.js        # Tela de cadastro de cliente
    ├── RecuperarDados.js     # Tela de busca de clientes (READ)
    ├── Atualizardados.js     # Tela de atualização de dados (UPDATE)
    ├── Removerdados.js       # Tela de remoção de cliente (DELETE)
    └── Sensormovimento.js    # Tela do sensor de movimento (acelerômetro)
```

---

## 📱 Funcionalidades

### 🏠 Tela Home
Tela inicial do app com imagem de destaque da barbearia, texto de apresentação institucional e botão de acesso rápido para a seção de serviços. Suporta tema claro/escuro via prop passada do `App.js`.

---

### ✂️ Tipos de Serviço (Tab Navigator interno)
Tela com **Bottom Tab Navigator** com 3 abas:

- **Geral**: Exibe todos os serviços (femininos + masculinos) usando o spread operator `[...servicosFemininos, ...servicosMasculinos]`. Ao final da lista, exibe botão "Agendar agora".
- **Mulheres**: Lista apenas os serviços femininos (corte, escova, pintura, luzes, hidratação).
- **Homens**: Lista apenas os serviços masculinos (corte, barba, combo, pintura).

Cada serviço é renderizado pelo componente reutilizável `CardServico`, que exibe imagem (via URL), nome, descrição e preço. A `FlatList` foi usada em vez de `ScrollView` por ser mais eficiente em listas longas — renderiza apenas os itens visíveis na tela.

---

### 📅 Agendamento (Tab Navigator em 3 etapas)
Fluxo de agendamento dividido em 3 abas sequenciais:

1. **Dia**: O cliente seleciona o dia da semana (Segunda a Sábado). O dia selecionado é passado via `navigation.navigate('Hora', { diaSelecionado: item })`.
2. **Hora**: Exibe os horários disponíveis (09:00 às 17:00). O horário e o dia são passados juntos para a próxima aba via `route.params`.
3. **Resultado**: Exibe o resumo do agendamento (dia + horário). O cliente digita nome e senha para confirmar. O app valida as credenciais no Firebase e, se corretas, salva o agendamento na coleção `agendamentos`.

---

### ⭐ Avaliação
Formulário simples onde o cliente informa nome, nota (1 a 5) e comentário. Os dados são salvos diretamente no Firebase na coleção `avaliacoes`. Inclui validação de campos vazios e de nota fora do intervalo.

---

### 🔐 Login
Tela de autenticação. Busca todos os clientes no Firebase e compara nome + senha. Clientes com `ativo: false` são ignorados. Se o nome contiver "barbeiro", redireciona para a tela administrativa (`Barbeiro`); caso contrário, redireciona para `Home`.

---

### 📋 Cadastro de Cliente
Formulário com campos de nome, telefone e senha. Dados salvos no Firebase via `push()` na coleção `cliente`. Vibra em padrão de sucesso `[0, 80, 60, 80]` quando cadastrado, ou pulso longo (400ms) em caso de erro.

---

### 🔍 Recuperar Dados (READ)
Permite buscar clientes pelo nome (busca parcial com `.includes()`) ou listar todos os clientes cadastrados. Resultados exibidos em cards com nome, telefone e ID do Firebase. Feedback de vibração diferenciado para sucesso e erro.

---

### ✏️ Atualizar Dados (UPDATE)
Fluxo em duas etapas:
1. **Busca**: Localiza o cliente pelo nome exato.
2. **Edição**: Permite alterar nome, telefone e senha. Se o campo de nova senha for deixado em branco, mantém a senha atual. Usa `firebase.database().ref('cliente/' + clienteId).update(dadosAtualizados)` para alterar apenas os campos desejados sem sobrescrever outros dados.

---

### 🗑️ Remover Cliente (DELETE)
Fluxo em duas etapas:
1. **Busca**: Localiza o cliente pelo nome exato.
2. **Confirmação**: Exibe card com os dados do cliente e botão destrutivo. Após confirmação via `Alert.alert`, executa `firebase.database().ref('cliente/' + clienteId).remove()`.

---

### 💈 Painel do Barbeiro (Tela Administrativa)
Tela acessível apenas após login com conta de barbeiro. Exibe em tempo real todos os agendamentos registrados no Firebase, usando `ref.on('value', ...)` para escuta contínua de mudanças no banco. Cada agendamento mostra nome do cliente, dia e horário.

---

### ⚙️ Configurações
Tela centralizada que permite:
- Alternar entre **tema claro** e **tema escuro** (afeta todas as telas do app simultaneamente, pois o estado `tema` fica no `App.js` e é passado como prop para todos os componentes).
- Acessar as telas de gerenciamento de clientes (Recuperar, Atualizar, Remover).

---

### 📱 Sensor de Movimento
Tela que usa o **Acelerômetro** do dispositivo (via `expo-sensors`) combinado com a **Vibração** como atuador:

- O sensor atualiza a cada 200ms e exibe os valores dos eixos X, Y e Z em tempo real.
- Calcula a força total do movimento pela magnitude do vetor 3D: `√(x² + y² + z²)`.
- Quando a força ultrapassa **2,5g** e passaram mais de 1 segundo desde o último shake detectado, o app:
  - Aciona um padrão de vibração de celebração `[0, 100, 80, 100, 80, 200]`
  - Incrementa o contador de "agitadas"
  - Executa uma animação de pulso no contador via `Animated.sequence`
  - Registra o horário do último shake

**Feedback visual por cor:**
- 🟢 Verde (< 1.2g): Parado
- 🟡 Amarelo (1.2g – 2.0g): Em movimento
- 🔴 Vermelho (> 2.0g): Agitando forte

---

## 🗄️ Banco de Dados — Firebase (CRUD Completo)

O app usa **Firebase Realtime Database** com as seguintes coleções:

### `cliente`
```json
{
  "-NxABC123": {
      "nome": "João Silva",
      "telefone": "(11) 99999-9999",
      "senha": "minhasenha",
      "ativo": true
  }
}
```

### `agendamentos`
```json
{
  "-NxDEF456": {
    "clienteId": "-NxABC123",
      "nomeCliente": "João Silva",
      "dia": "Sexta-feira",
      "horario": "14:00"
  }
}
```

### `avaliacoes`
```json
{
  "-NxGHI789": {
      "nome": "Maria",
      "nota": "5",
      "comentario": "Ótimo atendimento!"
  }
}
```

| Operação | Tela | Método Firebase |
|----------|------|----------------|
| **Create** | Cadastro / Agendamento / Avaliação | `.push()` |
| **Read** | Recuperar Dados / Login / Painel Barbeiro | `.once('value')` / `.on('value')` |
| **Update** | Atualizar Dados | `.update()` |
| **Delete** | Remover Cliente | `.remove()` |

---

## 🧭 Navegação

O app usa **dois tipos de navegação combinados**:

### Drawer Navigator (menu lateral — principal)
Acessado pelo ícone de "3 riscas" no topo. Contém:
- Home
- Tipos de serviço
- Avaliação
- Agendamento
- Login
- Cadastrar
- Sensor de Movimento
- Configuração

As telas de gerenciamento CRUD (RecuperarDados, AtualizarDados, RemoverDados) e a tela do Barbeiro ficam registradas no Drawer mas **ocultas do menu** (`drawerItemStyle: { display: 'none' }`), acessíveis apenas por navegação programática.

### Bottom Tab Navigator (interno em 2 telas)
- **Tipos de serviço**: abas Geral / Mulheres / Homens
- **Agendamento**: abas Dia / Hora / Resultado

---

## 🎨 Interface e UX

### Sistema de Temas
O estado `tema` é centralizado no `App.js` com `useState`. Quando o usuário muda o tema em Configurações, o novo valor é propagado via props para todas as telas simultaneamente — garantindo consistência visual em todo o app sem necessidade de Context API.

```javascript
const temas = {
  escuro: { fundo: '#1a1a2e', texto: '#ffffff', botao: '#e94560' },
  claro:  { fundo: '#ffffff', texto: '#1a1a2e', botao: '#1a1a2e' },
};
```

### Estilos Globais (`Estilos.js`)
Todos os componentes importam `estilosGlobais` e `cores` de um arquivo centralizado, garantindo consistência visual: bordas arredondadas (10px), altura padrão de inputs (52px), paleta de cores unificada para botões de ação (primário, perigo, aviso, sucesso, outline).

### Feedback ao Usuário
- **Vibração**: padrão duplo pulso curto `[0, 80, 60, 80]` para sucesso, pulso longo 400ms para erro, triplo pulso `[0, 100, 80, 100, 80, 100]` para confirmações importantes.
- **Animações**: pulso de escala no contador de shakes (`Animated.sequence`).
- **Indicadores de carregamento**: botões exibem texto "Buscando..." / "Salvando..." durante operações assíncronas e ficam desabilitados (`disabled={carregando}`).
- **Alertas**: `Alert.alert` com botões de confirmação antes de operações destrutivas (remover/atualizar).

---

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js instalado
- Expo CLI instalado (`npm install -g expo-cli`)
- Conta no [Firebase](https://firebase.google.com/)
- App **Expo Go** no celular (iOS ou Android)

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/barberapp.git
cd barberapp

# 2. Instale as dependências
npm install

# 3. Instale as bibliotecas de navegação
npm install @react-navigation/native @react-navigation/drawer @react-navigation/bottom-tabs
npm install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context

# 4. Instale as dependências do Expo
npx expo install expo-sensors @expo/vector-icons

# 5. Configure o Firebase
# Crie o arquivo config/config.js com suas credenciais:
```

```javascript
// config/config.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  databaseURL: "SUA_DATABASE_URL",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
```

```bash
# 6. Inicie o app
npx expo start

# 7. Escaneie o QR Code com o app Expo Go no celular
```

### Para funcionar no celular
É necessário instalar o aplicativo **Expo Go** pela Play Store ou App Store. Depois, faça login/cadastro no Expo e escaneie o QR Code gerado pelo comando `npx expo start`.


### Conta de acesso
- **Cliente**: cadastre uma conta pelo app (tela Cadastrar)
- **Barbeiro**: cadastre uma conta com "barbeiro" no nome (ex: `barbeiro1`) — ao fazer login, será redirecionado para o painel administrativo

---

## 📚 Aprendizados e Próximos Passos

### O que aprendi

- **Composição de navegadores**: combinar Drawer Navigator com Tab Navigators aninhados, passando props de tema por toda a árvore de componentes sem Context API.
- **Firebase Realtime Database**: diferença entre `.once()` (leitura única) e `.on()` (escuta em tempo real), além dos métodos `.push()`, `.update()` e `.remove()`.
- **Sensores nativos com Expo**: uso do `Accelerometer` para leitura contínua do acelerômetro, cálculo de magnitude vetorial e detecção de gestos físicos (shake).
- **Componentes reutilizáveis**: criar o `CardServico` uma única vez e reutilizá-lo nas três telas de serviços, recebendo dados via props.
- **FlatList vs ScrollView**: entender que a `FlatList` é mais eficiente para listas porque renderiza apenas os itens visíveis (virtualização), enquanto o `ScrollView` renderiza tudo de uma vez.
- **Gerenciamento de estado centralizado**: manter o estado `tema` no `App.js` e propagá-lo para todas as telas, garantindo que a mudança de tema afete o app inteiro de forma sincronizada.
- **Vibração como atuador**: usar a API `Vibration` do React Native com padrões distintos para comunicar diferentes tipos de feedback (sucesso, erro, confirmação).

### Próximos passos

- [ ] Implementar autenticação com Firebase Authentication (e-mail/senha)
- [ ] Adicionar tela de visualização e exclusão de agendamentos pelo cliente
- [ ] Implementar notificações push para lembrar o cliente do agendamento
- [ ] Adicionar galeria de fotos dos trabalhos realizados
- [ ] Criar sistema de avaliação com exibição pública das avaliações na tela Home
- [ ] Implementar busca por disponibilidade de horário (evitar conflitos de agendamento)
- [ ] Adicionar suporte a múltiplos barbeiros/profissionais

---

## 📸 Demonstração

part1 = https://youtu.be/0KQ_RmLUQ-A
part2 = https://youtu.be/DtM5XhiHi7I

import { StyleSheet } from 'react-native';

export const cores = {
  primaria: '#f4f6f9',
  secundaria: '#ffffff',
  destaque: '#e94560',
  destaqueSecundario: '#16213e',
  texto: '#1a1a2e',
  textoSuave: '#555555',
  borda: '#dcdde1',
  sucesso: '#38a169',
  perigo: '#e53e3e',
  aviso: '#d69e2e',
  fundo: '#f4f6f9',
  fundoInput: '#ffffff',
};

export const estilosGlobais = StyleSheet.create({
  telaRolavel: {
    flexGrow: 1,
    backgroundColor: cores.fundo,
    padding: 20,
  },

  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
    padding: 20,
  },

  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: cores.texto,
    marginBottom: 6,
  },

  subtitulo: {
    fontSize: 14,
    color: cores.textoSuave,
    marginBottom: 24,
  },

  campoGrupo: {
    marginBottom: 16,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: cores.textoSuave,
    marginBottom: 6,
    textTransform: 'uppercase',
  },

  input: {
    height: 52,
    backgroundColor: cores.fundoInput,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: cores.texto,
  },

  botaoPrimario: {
    height: 52,
    backgroundColor: cores.destaque,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },

  botaoOutline: {
    height: 52,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: cores.destaque,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },

  textoBotao: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  textoBotaoOutline: {
    color: cores.destaque,
    fontSize: 16,
    fontWeight: 'bold',
  },

  divisor: {
    height: 1,
    backgroundColor: cores.borda,
    marginVertical: 20,
  },

  botaoSecundario: {
    height: 52,
    backgroundColor: cores.destaqueSecundario,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },

  botaoPerigo: {
    height: 52,
    backgroundColor: cores.perigo,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },

  botaoAviso: {
    height: 52,
    backgroundColor: cores.aviso,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },

  // ── ADICIONADOS: faltavam e causavam crash no RecuperarDados e RemoverDados ──
  botaoSucesso: {
    height: 52,
    backgroundColor: cores.sucesso,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },

  cartao: {
    backgroundColor: cores.secundaria,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: cores.borda,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },

  textoNormal: {
    fontSize: 15,
    color: cores.texto,
  },

  textoSuave: {
    fontSize: 13,
    color: cores.textoSuave,
  },

  linhaDados: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },

  chaveDado: {
    fontSize: 13,
    fontWeight: '600',
    color: cores.textoSuave,
    textTransform: 'uppercase',
    flex: 1,
  },

  valorDado: {
    fontSize: 15,
    color: cores.texto,
    flex: 2,
    textAlign: 'right',
  },
});
// SensorMovimento.js
// Requisito: leitura de sensor (Acelerômetro) + atuador (Vibração)
// O acelerômetro detecta se o celular está sendo agitado (shake).
// Quando agita forte → vibra e mostra mensagem animada.

import * as React from 'react';
import {
  Text,
  View,
  ScrollView,
  Vibration,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { estilosGlobais, cores } from './Estilos';

class SensorMovimento extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
      z: 0,
      shakeCount: 0,
      ultimoShake: '',
      monitorando: false,
    };
    this._subscription = null;
    this._escala = new Animated.Value(1); // para animação de pulso
    this._ultimoTimestamp = 0;
  }

  componentWillUnmount() {
    this.pararMonitoramento();
  }

  iniciarMonitoramento() {
    // Define a taxa de atualização do sensor: 200ms entre leituras
    Accelerometer.setUpdateInterval(200);

    this._subscription = Accelerometer.addListener((dados) => {
      const { x, y, z } = dados;
      this.setState({ x, y, z });

      // Calcula a força total do movimento (magnitude do vetor)
      const forca = Math.sqrt(x * x + y * y + z * z);

      // Se a força for maior que 2.5g e passaram pelo menos 1s desde o último shake
      const agora = Date.now();
      if (forca > 2.5 && agora - this._ultimoTimestamp > 1000) {
        this._ultimoTimestamp = agora;
        this.detectouShake();
      }
    });

    this.setState({ monitorando: true });
  }

  pararMonitoramento() {
    if (this._subscription) {
      this._subscription.remove();
      this._subscription = null;
    }
    this.setState({ monitorando: false });
  }

  detectouShake() {
    const hora = new Date().toLocaleTimeString('pt-BR');

    // Vibra em padrão de celebração
    Vibration.vibrate([0, 100, 80, 100, 80, 200]);

    // Animação de pulso no número de shakes
    Animated.sequence([
      Animated.timing(this._escala, { toValue: 1.6, duration: 150, useNativeDriver: true }),
      Animated.timing(this._escala, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();

    this.setState((prev) => ({
      shakeCount: prev.shakeCount + 1,
      ultimoShake: hora,
    }));
  }

  // Retorna cor baseada na força do movimento para feedback visual em tempo real
  corDaForca(forca) {
    if (forca < 1.2) return cores.sucesso;   // parado/calmo = verde
    if (forca < 2.0) return cores.aviso;     // movimento moderado = amarelo
    return cores.perigo;                      // agitando forte = vermelho
  }

  labelDaForca(forca) {
    if (forca < 1.2) return '😴 Parado';
    if (forca < 2.0) return '🚶 Em movimento';
    return '🏃 Agitando!';
  }

  render() {
    const { x, y, z, shakeCount, ultimoShake, monitorando } = this.state;
    const forca = Math.sqrt(x * x + y * y + z * z);

    return (
      <ScrollView contentContainerStyle={estilosGlobais.telaRolavel}>
        <Text style={estilosGlobais.titulo}>📱 Sensor de Movimento</Text>
        <Text style={estilosGlobais.subtitulo}>
          Agite o celular para testar vibração e detecção de movimento
        </Text>

        {/* Botão ligar/desligar monitoramento */}
        <TouchableOpacity
          style={monitorando ? estilosGlobais.botaoPerigo : estilosGlobais.botaoSucesso}
          onPress={() =>
            monitorando ? this.pararMonitoramento() : this.iniciarMonitoramento()
          }
        >
          <Text style={estilosGlobais.textoBotao}>
            {monitorando ? '⏹ Parar monitoramento' : '▶️ Iniciar monitoramento'}
          </Text>
        </TouchableOpacity>

        <View style={estilosGlobais.divisor} />

        {/* Dados ao vivo do acelerômetro */}
        <View style={estilosGlobais.cartao}>
          <Text style={[estilosGlobais.textoNormal, { fontWeight: 'bold', marginBottom: 10 }]}>
            📡 Leitura do Acelerômetro
          </Text>

          <View style={estilosGlobais.linhaDados}>
            <Text style={estilosGlobais.chaveDado}>Eixo X</Text>
            <Text style={estilosGlobais.valorDado}>{x.toFixed(3)} g</Text>
          </View>

          <View style={estilosGlobais.linhaDados}>
            <Text style={estilosGlobais.chaveDado}>Eixo Y</Text>
            <Text style={estilosGlobais.valorDado}>{y.toFixed(3)} g</Text>
          </View>

          <View style={estilosGlobais.linhaDados}>
            <Text style={estilosGlobais.chaveDado}>Eixo Z</Text>
            <Text style={estilosGlobais.valorDado}>{z.toFixed(3)} g</Text>
          </View>

          <View style={[estilosGlobais.divisor, { marginVertical: 10 }]} />

          <View style={estilosGlobais.linhaDados}>
            <Text style={estilosGlobais.chaveDado}>Força total</Text>
            <Text style={[estilosGlobais.valorDado, { color: this.corDaForca(forca), fontWeight: 'bold' }]}>
              {forca.toFixed(3)} g
            </Text>
          </View>

          <View style={estilosGlobais.linhaDados}>
            <Text style={estilosGlobais.chaveDado}>Status</Text>
            <Text style={[estilosGlobais.valorDado, { color: this.corDaForca(forca), fontWeight: 'bold' }]}>
              {monitorando ? this.labelDaForca(forca) : '— Inativo —'}
            </Text>
          </View>
        </View>

        {/* Contador de shakes com animação */}
        <View style={[estilosGlobais.cartao, { alignItems: 'center', paddingVertical: 24 }]}>
          <Text style={[estilosGlobais.textoNormal, { marginBottom: 8 }]}>
            Número de agitadas detectadas
          </Text>

          <Animated.Text
            style={{
              fontSize: 64,
              fontWeight: 'bold',
              color: cores.destaque,
              transform: [{ scale: this._escala }],
            }}
          >
            {shakeCount}
          </Animated.Text>

          {ultimoShake !== '' && (
            <Text style={[estilosGlobais.textoSuave, { marginTop: 8 }]}>
              Último shake às {ultimoShake}
            </Text>
          )}
        </View>

        {/* Como funciona */}
        <View style={estilosGlobais.cartao}>
          <Text style={[estilosGlobais.textoNormal, { fontWeight: 'bold', marginBottom: 8 }]}>
            ℹ️ Como funciona
          </Text>
          <Text style={estilosGlobais.textoSuave}>
            • O acelerômetro mede a força nos 3 eixos (X, Y, Z) em unidades de gravidade (g).{'\n\n'}
            • A força total é calculada pela magnitude do vetor 3D.{'\n\n'}
            • Quando a força ultrapassa 2.5g, o app detecta uma agitada e aciona a vibração do celular como resposta (atuador).{'\n\n'}
            • Verde = parado, Amarelo = em movimento, Vermelho = agitando forte.
          </Text>
        </View>
      </ScrollView>
    );
  }
}

export default SensorMovimento;
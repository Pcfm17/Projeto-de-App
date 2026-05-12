import * as React from 'react';
import { TextInput, Text, View, Button, StyleSheet, TouchableHighlight } from 'react-native';
import firebase from '../config/config'

class SalvarItens extends React.Component{
  constructor(props) {
    super(props);
    this.nome = "";
    this.telefone = "";
    this.senha = "";
  }

  salvar(){
    firebase.database().ref('/cliente').push({
      nome: this.nome,
      telefone: this.telefone,
      senha: this.senha,
    })
    alert("Cliente cadastrado!")
  }

  render(){
    return(
      <View> 
        <TextInput style={estilos.input} 
          placeholder="nome"
          onChangeText={(texto)=>{this.nome = texto}}
        />
        <TextInput style={estilos.input} 
          placeholder="telefone"
          onChangeText={(texto)=>{this.telefone = texto}}
        />
        <TextInput style={estilos.input} 
          placeholder="senha"
          onChangeText={(texto)=>{this.senha = texto}}
        />
        <TouchableHighlight style={estilos.botao} onPress={()=>this.salvar()}>
          <Text  style={estilos.txtBotao} >{"Adicionar"}</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

const estilos = StyleSheet.create({
  txtBotao: {
    color: "black",
    fontSize: 25,
    alignSelf: "center"
  },
  botao: {
    height: 50,
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: "cyan",
    margin: 10,
    borderRadius: 8,
    padding: 5,
  },
  input: {
    height: 50,
    padding: 5,
    fontSize: 25,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    borderRadius: 8
  }
});


export default SalvarItens;
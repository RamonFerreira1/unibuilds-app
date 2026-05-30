import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEstadoAutenticacao } from '../estado/useEstadoAutenticacao';
import { cores } from '../tema/cores';
import ModalAlerta from '../componentes/ModalAlerta';

export default function TelaCadastro() {
  const navegacao = useNavigation();
  
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [modalVisivel, setModalVisivel] = useState(false);
  const [mensagemModal, setMensagemModal] = useState('');
  const [tipoAlerta, setTipoAlerta] = useState('aviso');
  
  const cadastrarConta = useEstadoAutenticacao(estado => estado.cadastrarConta);
  const realizarLogin = useEstadoAutenticacao(estado => estado.login);

  const lidarComCadastro = () => {
    if (!nome.trim() || !senha.trim() || !confirmarSenha.trim()) {
      setTipoAlerta('aviso');
      setMensagemModal("Por favor, preencha todos os campos para forjar sua conta.");
      setModalVisivel(true);
      return;
    }

    if (senha !== confirmarSenha) {
      setTipoAlerta('aviso');
      setMensagemModal("As senhas não coincidem. Digite novamente.");
      setModalVisivel(true);
      return;
    }

    const resultado = cadastrarConta(nome.trim(), senha);
    if (resultado.sucesso) {
      setTipoAlerta('sucesso');
      setMensagemModal(`Invocador "${nome}" cadastrado com sucesso! Prepare-se para a batalha.`);
      setModalVisivel(true);
    } else {
      setTipoAlerta('aviso');
      setMensagemModal(resultado.mensagem);
      setModalVisivel(true);
    }
  };

  const aoFecharSucesso = () => {
    setModalVisivel(false);
    if (tipoAlerta === 'sucesso') {
      realizarLogin(nome.trim(), senha);
      navegacao.replace('Principal');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: cores.fundoPrincipal }}>
      <KeyboardAvoidingView 
        style={estilos.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={estilos.cabecalho}>
          <Text style={estilos.titulo}>CADASTRAR</Text>
        </View>
        
        <View style={estilos.formulario}>
          <Text style={estilos.rotulo}>Nome do Jogador</Text>
          <TextInput 
            style={estilos.campoTexto} 
            placeholder="Escolha seu Nome"
            placeholderTextColor={cores.textoSecundario}
            value={nome}
            onChangeText={setNome}
          />

          <Text style={estilos.rotulo}>Senha</Text>
          <TextInput 
            style={estilos.campoTexto} 
            placeholder="Digite uma Senha"
            placeholderTextColor={cores.textoSecundario}
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />

          <Text style={estilos.rotulo}>Confirmar Senha</Text>
          <TextInput 
            style={estilos.campoTexto} 
            placeholder="Repita sua Senha"
            placeholderTextColor={cores.textoSecundario}
            secureTextEntry
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
          />

          <TouchableOpacity style={estilos.botaoLogin} onPress={lidarComCadastro}>
            <Text style={estilos.textoBotaoLogin}>CRIAR CONTA</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={estilos.botaoNavegarLogin} 
            onPress={() => navegacao.navigate('Login')}
          >
            <Text style={estilos.textoNavegarLogin}>Já tem uma conta? Conectar-se</Text>
          </TouchableOpacity>
        </View>

        <ModalAlerta 
          visivel={modalVisivel}
          titulo="SISTEMA"
          tipo={tipoAlerta}
          mensagem={mensagemModal}
          aoFechar={aoFecharSucesso}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundoPrincipal,
    padding: 24,
    justifyContent: 'center',
  },
  cabecalho: {
    alignItems: 'center',
    marginBottom: 30,
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: cores.primaria,
    letterSpacing: 2,
    fontFamily: 'serif',
  },
  formulario: {
    backgroundColor: cores.fundoSecundario,
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: cores.primaria,
  },
  rotulo: {
    color: cores.textoClaro,
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '600',
  },
  campoTexto: {
    backgroundColor: cores.fundoPrincipal,
    borderWidth: 1,
    borderColor: cores.primariaEscura,
    borderRadius: 8,
    padding: 12,
    color: cores.textoPrincipal,
    marginBottom: 16,
    fontSize: 16,
  },
  botaoLogin: {
    backgroundColor: cores.primaria,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotaoLogin: {
    color: cores.fundoPrincipal,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  botaoNavegarLogin: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 5,
  },
  textoNavegarLogin: {
    color: cores.primaria,
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  }
});

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEstadoAutenticacao } from '../estado/useEstadoAutenticacao';
import { cores } from '../tema/cores';
import ModalAlerta from '../componentes/ModalAlerta';

// Componente responsável pela tela de Login do aplicativo
export default function TelaLogin() {
  const navegacao = useNavigation();
  
  // Criamos os estados locais para armazenar o que o usuário digita nos campos
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [modalVisivel, setModalVisivel] = useState(false);
  const [mensagemModal, setMensagemModal] = useState('');
  
  // Pegamos a função de login da nossa loja global (Zustand)
  const realizarLogin = useEstadoAutenticacao(estado => estado.login);

  // O que acontece quando aperta o botão de login:
  const lidarComLogin = () => {
    // Validamos se o usuário digitou alguma coisa
    if (nome.trim() && senha.trim()) {
      realizarLogin(nome); // Salva o nome dele no Zustand
      navegacao.replace('Principal'); // Vai para a navegação das abas (Tab)
    } else {
      setMensagemModal("Por favor, preencha seu nome e senha para continuar sua jornada.");
      setModalVisivel(true);
    }
  };

  return (
    // SafeAreaView evita que o conteúdo fique atrás do entalhe/câmera em celulares mais novos
    <SafeAreaView style={{ flex: 1, backgroundColor: cores.fundoPrincipal }}>
      <KeyboardAvoidingView 
        style={estilos.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={estilos.cabecalho}>
          <Text style={estilos.titulo}>LOGIN</Text>
        </View>
        
        <View style={estilos.formulario}>
          <Text style={estilos.rotulo}>Nome do Jogador</Text>
          <TextInput 
            style={estilos.campoTexto} 
            placeholder="Digite seu Nome"
            placeholderTextColor={cores.textoSecundario}
            value={nome}
            onChangeText={setNome} // Atualiza a variável nome conforme ele digita
          />

          <Text style={estilos.rotulo}>Senha</Text>
          <TextInput 
            style={estilos.campoTexto} 
            placeholder="Digite sua Senha"
            placeholderTextColor={cores.textoSecundario}
            secureTextEntry // Transforma o texto em bolinhas (****)
            value={senha}
            onChangeText={setSenha}
          />

          <TouchableOpacity style={estilos.botaoLogin} onPress={lidarComLogin}>
            <Text style={estilos.textoBotaoLogin}>ENTRAR</Text>
          </TouchableOpacity>
        </View>

        <ModalAlerta 
          visivel={modalVisivel}
          titulo="Aviso"
          mensagem={mensagemModal}
          aoFechar={() => setModalVisivel(false)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Configurações visuais (CSS no JS)
const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundoPrincipal,
    padding: 24,
    justifyContent: 'center', // Alinha o formulário no meio da tela
  },
  cabecalho: {
    alignItems: 'center',
    marginBottom: 40,
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
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  campoTexto: {
    backgroundColor: cores.fundoPrincipal,
    borderWidth: 1,
    borderColor: cores.primariaEscura,
    borderRadius: 8,
    padding: 14,
    color: cores.textoPrincipal,
    marginBottom: 20,
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
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEstadoAutenticacao } from '../estado/useEstadoAutenticacao';
import { cores } from '../tema/cores';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

// Tela principal que funciona como um HUB de atalhos para as outras áreas do app.
export default function TelaPainel() {
  const navegacao = useNavigation();
  
  // Pega o nome do usuário que foi salvo no Zustand durante o login
  const { nomeUsuario, logout } = useEstadoAutenticacao();
  
  // Estado local para abrir ou fechar o menu flutuante (dropdown)
  const [menuAberto, setMenuAberto] = useState(false);

  // Função que lida com o botão "Sair" do menu
  const lidarComSaida = () => {
    logout(); // Limpa o estado global
    navegacao.replace('Login'); // Redireciona o usuário para a tela de login
  };

  return (
    <SafeAreaView style={estilos.areaSegura}>
      <ScrollView contentContainerStyle={estilos.container}>
        {/* Cabeçalho com as informações do perfil */}
        <View style={estilos.cabecalho}>
          <View style={estilos.secaoPerfil}>
            {/* Mostramos o nome ou 'Usuário' caso não tenha nome */}
            <Text style={estilos.nomeUsuario}>{nomeUsuario || 'Usuário'}</Text>
            <Text style={estilos.textoStatus}>Online</Text>
          </View>
          
          {/* Botão de 3 pontinhos para abrir o menu dropdown */}
          <TouchableOpacity onPress={() => setMenuAberto(!menuAberto)}>
            <Ionicons name="ellipsis-vertical" size={24} color={cores.primaria} />
          </TouchableOpacity>
        </View>

        {/* Menu Dropdown que só aparece se a variável 'menuAberto' for verdadeira */}
        {menuAberto && (
          <View style={estilos.menuDropdown}>
            <TouchableOpacity style={estilos.itemMenu} onPress={() => { setMenuAberto(false); navegacao.navigate('ListaBuilds'); }}>
              <Ionicons name="star-outline" size={20} color={cores.primaria} />
              <Text style={estilos.textoMenu}>Favoritos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={estilos.itemMenu} onPress={lidarComSaida}>
              <Ionicons name="log-out-outline" size={20} color="#e74c3c" />
              <Text style={estilos.textoMenu}>Sair</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Logo centralizada do App */}
        <View style={estilos.secaoLogo}>
          <View style={estilos.emblemaLogo}>
            <Text style={estilos.textoEmblema}>UB</Text>
          </View>
          <Text style={estilos.tituloCentral}>UNIBUILDS</Text>
        </View>

        {/* Grade com os 4 botões magnos (Atalhos grandes) */}
        <View style={estilos.grade}>
          {/* Botão Campeões */}
          <TouchableOpacity style={[estilos.cartao, estilos.cartaoDourado]} onPress={() => navegacao.navigate('Campeões')}>
            <FontAwesome5 name="khanda" size={40} color={cores.primaria} />
            <Text style={estilos.textoDourado}>CAMPEÕES</Text>
          </TouchableOpacity>

          {/* Botão Itens */}
          <TouchableOpacity style={[estilos.cartao, estilos.cartaoCiano]} onPress={() => navegacao.navigate('Itens')}>
            <FontAwesome5 name="briefcase" size={40} color={cores.destaque} />
            <Text style={estilos.textoCiano}>ITENS</Text>
          </TouchableOpacity>

          {/* Botão Criar Build */}
          <TouchableOpacity style={[estilos.cartao, estilos.cartaoDourado]} onPress={() => navegacao.navigate('Builds')}>
            <FontAwesome5 name="scroll" size={40} color={cores.primaria} />
            <Text style={estilos.textoDourado}>BUILDS</Text>
          </TouchableOpacity>

          {/* Botão Runas */}
          <TouchableOpacity style={[estilos.cartao, estilos.cartaoCiano]} onPress={() => navegacao.navigate('Runas')}>
            <Ionicons name="sparkles" size={40} color={cores.destaque} />
            <Text style={estilos.textoCiano}>RUNAS</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Estilização 
const estilos = StyleSheet.create({
  areaSegura: {
    flex: 1,
    backgroundColor: cores.fundoPrincipal,
  },
  container: {
    flexGrow: 1, // Faz o conteúdo crescer e rolar corretamente
    padding: 20,
    paddingBottom: 40, // Espaço extra no final
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    zIndex: 10, // Garante que o menu de contexto não fique escondido atrás dos cards
  },
  secaoPerfil: {},
  nomeUsuario: {
    color: cores.textoPrincipal,
    fontSize: 20,
    fontWeight: 'bold',
  },
  textoStatus: {
    color: cores.textoSecundario,
    fontSize: 14,
  },
  menuDropdown: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: cores.fundoSecundario,
    borderWidth: 1,
    borderColor: cores.primariaEscura,
    borderRadius: 8,
    padding: 10,
    zIndex: 100, // Tem que ser bem alto para sobrepor todo o resto da UI
  },
  itemMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  textoMenu: {
    color: cores.textoClaro,
    marginLeft: 10,
    fontSize: 16,
  },
  secaoLogo: {
    alignItems: 'center',
    marginBottom: 40,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  emblemaLogo: {
    backgroundColor: cores.fundoSecundario,
    padding: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: cores.textoSecundario,
    marginRight: 10,
  },
  textoEmblema: {
    color: cores.destaque,
    fontWeight: 'bold',
    fontSize: 18,
  },
  tituloCentral: {
    color: cores.primaria,
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'serif',
    letterSpacing: 2,
  },
  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cartao: {
    width: '47%',
    aspectRatio: 1, // Faz com que os cartões sejam sempre quadrados
    backgroundColor: cores.fundoSecundario,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1.5,
  },
  cartaoDourado: {
    borderColor: cores.primaria,
  },
  cartaoCiano: {
    borderColor: cores.destaque,
  },
  textoDourado: {
    color: cores.primaria,
    marginTop: 15,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  textoCiano: {
    color: cores.destaque,
    marginTop: 15,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { dadosCampeoes } from '../dados/dadosCampeoes';
import { cores } from '../tema/cores';

// Tela que exibe a galeria de todos os campeões em uma grade.
export default function TelaListaCampeoes() {
  const navegacao = useNavigation();
  const [textoBusca, setTextoBusca] = useState('');

  // Filtra a lista de campeões pelo nome
  const campeoesFiltrados = dadosCampeoes.filter(campeao => 
    campeao.nome.toLowerCase().includes(textoBusca.toLowerCase())
  );

  return (
    <SafeAreaView style={estilos.areaSegura}>
      <View style={estilos.container}>
        {/* Cabeçalho Customizado com Botão Voltar */}
        <View style={estilos.cabecalho}>
          <TouchableOpacity onPress={() => navegacao.goBack()} style={estilos.botaoVoltar}>
            <Ionicons name="arrow-back" size={24} color={cores.primaria} />
          </TouchableOpacity>
          <Text style={estilos.tituloCabecalho}>CAMPEÕES</Text>
          <View style={{ width: 24 }} /> {/* View vazia para ajudar a centralizar o título */}
        </View>

        {/* Barra de Pesquisa */}
        <View style={estilos.containerBusca}>
          <Ionicons name="search" size={20} color={cores.primaria} style={estilos.iconeBusca} />
          <TextInput
            style={estilos.inputBusca}
            placeholder="Pesquisar Campeão..."
            placeholderTextColor={cores.textoSecundario}
            value={textoBusca}
            onChangeText={setTextoBusca}
          />
        </View>

        {/* FlatList é muito mais rápido e eficiente que ScrollView para listas grandes */}
        <FlatList
          data={campeoesFiltrados} // Usa o array filtrado
          keyExtractor={item => item.id} // Define uma chave única para cada elemento (exigência do React)
          numColumns={3} // Exibir 3 colunas de cards
          columnWrapperStyle={estilos.linhaGrelha} // Estilo aplicado em cada linha da grade
          contentContainerStyle={estilos.conteudoLista}
          // renderItem diz como cada elemento da lista vai ser desenhado na tela
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={estilos.cartaoCampeao} 
              onPress={() => navegacao.navigate('DetalheCampeao', { championId: item.id })}
            >
              <Image source={{ uri: item.imagem }} style={estilos.imagemCampeao} />
              <Text style={estilos.nomeCampeao} numberOfLines={1}>{item.nome}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={estilos.textoVazio}>Nenhum campeão encontrado.</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

// Estilos 
const estilos = StyleSheet.create({
  areaSegura: {
    flex: 1,
    backgroundColor: cores.fundoPrincipal,
  },
  container: {
    flex: 1,
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: cores.primariaEscura,
  },
  botaoVoltar: {
    padding: 5,
  },
  tituloCabecalho: {
    fontSize: 24,
    fontWeight: 'bold',
    color: cores.primaria,
    fontFamily: 'serif',
    letterSpacing: 2,
  },
  containerBusca: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.fundoSecundario,
    borderWidth: 1,
    borderColor: cores.primariaEscura,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 5,
  },
  iconeBusca: {
    marginRight: 10,
  },
  inputBusca: {
    flex: 1,
    color: cores.textoPrincipal,
    paddingVertical: 10,
    fontSize: 16,
  },
  conteudoLista: {
    padding: 10,
  },
  linhaGrelha: {
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  cartaoCampeao: {
    width: '30%',
    alignItems: 'center',
  },
  imagemCampeao: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: cores.primaria,
    marginBottom: 8,
  },
  nomeCampeao: {
    color: cores.textoSecundario,
    fontSize: 12,
    textAlign: 'center',
  },
  textoVazio: {
    color: cores.textoSecundario,
    textAlign: 'center',
    marginTop: 40,
    fontStyle: 'italic',
  }
});

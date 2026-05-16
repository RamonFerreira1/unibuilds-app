import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, FlatList, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cores } from '../tema/cores';

// Um Modal genérico para abrir uma gaveta de seleção com sistema de busca
export default function ModalSeletor({ visivel, fecharModal, titulo, dados, aoSelecionar }) {
  // Estado local para guardar o que o usuário está digitando na barra de pesquisa
  const [textoBusca, setTextoBusca] = useState('');

  // Filtra os dados: Só retorna os itens que tem o texto digitado no nome
  const dadosFiltrados = dados?.filter(item => 
    item.nome.toLowerCase().includes(textoBusca.toLowerCase())
  ) || [];

  // Função auxiliar para limpar a pesquisa toda vez que o modal for fechado
  const fecharELimpar = () => {
    setTextoBusca('');
    fecharModal();
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visivel}
      onRequestClose={fecharELimpar}
    >
      <View style={estilos.fundoEscuro}>
        <View style={estilos.caixaModal}>
          
          {/* Cabecalho da gaveta de seleção */}
          <View style={estilos.cabecalhoModal}>
            <Text style={estilos.titulo}>{titulo}</Text>
            <TouchableOpacity onPress={fecharELimpar}>
              <Ionicons name="close" size={28} color={cores.primaria} />
            </TouchableOpacity>
          </View>

          {/* Barra de Pesquisa */}
          <View style={estilos.containerBusca}>
            <Ionicons name="search" size={20} color={cores.primaria} style={estilos.iconeBusca} />
            <TextInput
              style={estilos.inputBusca}
              placeholder="Pesquisar..."
              placeholderTextColor={cores.textoSecundario}
              value={textoBusca}
              onChangeText={setTextoBusca}
            />
          </View>

          {/* Lista Filtrada */}
          <FlatList
            data={dadosFiltrados}
            keyExtractor={(item) => item.id}
            numColumns={3}
            columnWrapperStyle={estilos.linhaGrelha}
            contentContainerStyle={estilos.conteudoLista}
            // O que renderizar se a pesquisa não achar nada
            ListEmptyComponent={
              <Text style={estilos.textoVazio}>Nenhum resultado encontrado.</Text>
            }
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={estilos.cartaoItem}
                onPress={() => {
                  aoSelecionar(item);
                  fecharELimpar(); // Fecha a gaveta e limpa a pesquisa
                }}
              >
                <Image source={{ uri: item.imagem || item.skins?.[0]?.imagem }} style={estilos.imagemItem} />
                <Text style={estilos.nomeItem} numberOfLines={1}>{item.nome}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  fundoEscuro: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  caixaModal: {
    backgroundColor: cores.fundoPrincipal,
    borderTopWidth: 2,
    borderTopColor: cores.primaria,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '80%', // Aumentei um pouquinho para acomodar a barra de busca
    padding: 20,
  },
  cabecalhoModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: cores.primaria,
    fontFamily: 'serif',
  },
  containerBusca: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.fundoSecundario,
    borderWidth: 1,
    borderColor: cores.primariaEscura,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
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
    paddingBottom: 20,
  },
  linhaGrelha: {
    justifyContent: 'flex-start',
    gap: 15,
    marginBottom: 20,
  },
  cartaoItem: {
    width: '30%',
    alignItems: 'center',
  },
  imagemItem: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: cores.primaria,
    marginBottom: 8,
  },
  nomeItem: {
    color: cores.textoClaro,
    fontSize: 11,
    textAlign: 'center',
  },
  textoVazio: {
    color: cores.textoSecundario,
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  }
});

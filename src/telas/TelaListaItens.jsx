import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, SafeAreaView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { obterItens } from '../servicos/api';
import { cores } from '../tema/cores';

// Tela responsável por listar os itens que estão armazenados no nosso mock de dados.
export default function TelaListaItens() {
  const navegacao = useNavigation();
  const [textoBusca, setTextoBusca] = useState('');
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    carregarItens();
  }, []);

  const carregarItens = async () => {
    try {
      setCarregando(true);
      setErro(null);
      const dados = await obterItens();
      setItens(dados);
    } catch (err) {
      setErro('Não foi possível carregar os itens. Verifique sua conexão.');
    } finally {
      setCarregando(false);
    }
  };

  const itensFiltrados = itens.filter(item => 
    item.nome.toLowerCase().includes(textoBusca.toLowerCase())
  );

  return (
    <SafeAreaView style={estilos.areaSegura}>
      <View style={estilos.container}>
        <View style={estilos.cabecalho}>
          <TouchableOpacity onPress={() => navegacao.goBack()} style={estilos.botaoVoltar}>
            <Ionicons name="arrow-back" size={24} color={cores.primaria} />
          </TouchableOpacity>
          <Text style={estilos.tituloCabecalho}>ITENS</Text>
          <TouchableOpacity onPress={carregarItens} style={estilos.botaoVoltar}>
            <Ionicons name="refresh" size={24} color={cores.primaria} />
          </TouchableOpacity>
        </View>

        <View style={estilos.containerBusca}>
          <Ionicons name="search" size={20} color={cores.primaria} style={estilos.iconeBusca} />
          <TextInput
            style={estilos.inputBusca}
            placeholder="Pesquisar Item..."
            placeholderTextColor={cores.textoSecundario}
            value={textoBusca}
            onChangeText={setTextoBusca}
          />
        </View>

        {carregando ? (
          <View style={estilos.centro}>
            <ActivityIndicator size="large" color={cores.primaria} />
            <Text style={estilos.textoLoading}>Carregando arsenal...</Text>
          </View>
        ) : erro ? (
          <View style={estilos.centro}>
            <Text style={estilos.textoErro}>{erro}</Text>
            <TouchableOpacity style={estilos.botaoRecarregar} onPress={carregarItens}>
              <Text style={estilos.textoBotaoRecarregar}>Tentar Novamente</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={itensFiltrados} // Carregamos o array filtrado
            keyExtractor={item => String(item.ID_riot)}
            contentContainerStyle={estilos.conteudoLista}
            // Para cada item do banco, a gente constrói esse cartão
            renderItem={({ item }) => (
              <View style={estilos.cartao}>
                <View style={estilos.cartaoCabecalho}>
                  {/* Ícone ou Foto do Item */}
                  <Image source={{ uri: item.imagem_url }} style={estilos.imagem} />
                  
                  <View style={estilos.infoDoCabecalho}>
                    <Text style={estilos.nome}>{item.nome}</Text>
                    <Text style={estilos.preco}>{item.preco} Ouro</Text>
                  </View>
                </View>

                {/* Uma linhazinha dourada divisória, para ficar elegante */}
                <View style={estilos.divisoria} />
                
                {/* Informações detalhadas do item */}
                <Text style={estilos.descricao}>{item.descricao}</Text>
              </View>
            )}
            ListEmptyComponent={
              <Text style={estilos.textoVazio}>Nenhum item encontrado.</Text>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

// Estilização (Vanilla CSS-in-JS do React Native)
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
    padding: 20,
  },
  cartao: {
    backgroundColor: cores.fundoSecundario,
    borderWidth: 1,
    borderColor: cores.primaria,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  cartaoCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  imagem: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: cores.primaria,
    marginRight: 15,
  },
  infoDoCabecalho: {
    flex: 1,
    justifyContent: 'center',
  },
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  textoLoading: {
    color: cores.primaria,
    marginTop: 15,
    fontSize: 16,
    fontFamily: 'serif',
  },
  textoErro: {
    color: '#e74c3c',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  botaoRecarregar: {
    backgroundColor: cores.primaria,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  textoBotaoRecarregar: {
    color: cores.fundoPrincipal,
    fontWeight: 'bold',
    fontSize: 16,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: cores.textoClaro,
    marginBottom: 4,
  },
  preco: {
    fontSize: 16,
    color: cores.primaria,
    fontWeight: 'bold',
  },
  divisoria: {
    height: 1,
    backgroundColor: cores.primariaEscura,
    marginBottom: 10,
  },
  descricao: {
    fontSize: 14,
    color: cores.textoSecundario,
    lineHeight: 20,
  },
  textoVazio: {
    color: cores.textoSecundario,
    textAlign: 'center',
    marginTop: 40,
    fontStyle: 'italic',
  }
});

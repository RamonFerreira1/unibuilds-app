import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { obterCampeoes } from '../servicos/api';
import { cores } from '../tema/cores';

// Tela que exibe a galeria de todos os campeões em uma grade.
export default function TelaListaCampeoes() {
  const navegacao = useNavigation();
  const [textoBusca, setTextoBusca] = useState('');
  const [campeoes, setCampeoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    carregarCampeoes();
  }, []);

  const carregarCampeoes = async () => {
    try {
      setCarregando(true);
      setErro(null);
      const dados = await obterCampeoes();
      setCampeoes(dados);
    } catch (err) {
      setErro('Não foi possível carregar os campeões. Verifique sua conexão.');
    } finally {
      setCarregando(false);
    }
  };

  // Filtra a lista de campeões pelo nome
  const campeoesFiltrados = campeoes.filter(campeao => 
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
          <TouchableOpacity onPress={carregarCampeoes} style={estilos.botaoVoltar}>
            <Ionicons name="refresh" size={24} color={cores.primaria} />
          </TouchableOpacity>
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

        {carregando ? (
          <View style={estilos.centro}>
            <ActivityIndicator size="large" color={cores.primaria} />
            <Text style={estilos.textoLoading}>Carregando invocadores...</Text>
          </View>
        ) : erro ? (
          <View style={estilos.centro}>
            <Text style={estilos.textoErro}>{erro}</Text>
            <TouchableOpacity style={estilos.botaoRecarregar} onPress={carregarCampeoes}>
              <Text style={estilos.textoBotaoRecarregar}>Tentar Novamente</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* FlatList é muito mais rápido e eficiente que ScrollView para listas grandes */
          <FlatList
            data={campeoesFiltrados} // Usa o array filtrado
            keyExtractor={item => String(item.ID)} // Define uma chave única para cada elemento (exigência do React)
            numColumns={3} // Exibir 3 colunas de cards
            columnWrapperStyle={estilos.linhaGrelha} // Estilo aplicado em cada linha da grade
            contentContainerStyle={estilos.conteudoLista}
            // renderItem diz como cada elemento da lista vai ser desenhado na tela
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={estilos.cartaoCampeao} 
                onPress={() => navegacao.navigate('DetalheCampeao', { championId: item.ID })}
              >
                <Image source={{ uri: item.square_url }} style={estilos.imagemCampeao} />
                <Text style={estilos.nomeCampeao} numberOfLines={1}>{item.nome}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={estilos.textoVazio}>Nenhum campeão encontrado.</Text>
            }
          />
        )}
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

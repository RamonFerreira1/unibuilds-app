import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useEstadoAutenticacao } from '../estado/useEstadoAutenticacao';
import { cores } from '../tema/cores';
import { obterBuildsDoUsuario, excluirBuild } from '../servicos/api';
import ModalConfirmacao from '../componentes/ModalConfirmacao';

export default function TelaListaBuilds() {
  const navegacao = useNavigation();
  const { nomeUsuario } = useEstadoAutenticacao();
  
  const [builds, setBuilds] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // Estados para gerenciar o Modal de Confirmação customizado do App
  const [modalConfirmacaoVisivel, setModalConfirmacaoVisivel] = useState(false);
  const [buildParaExcluir, setBuildParaExcluir] = useState(null);
  const [isExcluindo, setIsExcluindo] = useState(false);

  useEffect(() => {
    carregarBuilds();
  }, []);

  const carregarBuilds = async () => {
    try {
      setCarregando(true);
      setErro(null);
      const userId = nomeUsuario || 'invocador_anonimo';
      const dados = await obterBuildsDoUsuario(userId);
      setBuilds(dados);
    } catch (err) {
      console.error('Erro ao carregar builds salvas:', err);
      setErro('Não foi possível carregar as builds favoritadas.');
    } finally {
      setCarregando(false);
    }
  };

  const confirmarExclusao = (build) => {
    setBuildParaExcluir(build);
    setModalConfirmacaoVisivel(true);
  };

  const lidarComConfirmacaoExclusao = async () => {
    if (!buildParaExcluir) return;
    setIsExcluindo(true);
    try {
      await excluirBuild(buildParaExcluir.ID_build);
      setBuilds(prevBuilds => prevBuilds.filter(b => b.ID_build !== buildParaExcluir.ID_build));
    } catch (err) {
      console.error('Erro ao excluir build:', err);
    } finally {
      setIsExcluindo(false);
      setModalConfirmacaoVisivel(false);
      setBuildParaExcluir(null);
    }
  };

  const renderizarBuildItem = ({ item }) => {
    return (
      <View style={estilos.cardBuild}>
        {/* Cabecalho do Card */}
        <View style={estilos.cabecalhoCard}>
          <Text style={estilos.nomeBuild}>{item.nome_build || 'Build Sem Nome'}</Text>
          <View style={estilos.acoesCard}>
            <Ionicons name="star" size={16} color={cores.primaria} style={{ marginRight: 8 }} />
            <TouchableOpacity onPress={() => navegacao.navigate('Principal', { screen: 'Builds', params: { editBuild: item } })} style={estilos.botaoAcao}>
              <Ionicons name="pencil" size={18} color={cores.primaria} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => confirmarExclusao(item)} style={estilos.botaoAcao}>
              <Ionicons name="trash-outline" size={18} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Informações da Build */}
        <View style={estilos.corpoCard}>
          {/* Campeão */}
          <View style={estilos.secaoCampeao}>
            {item.square_url ? (
              <Image source={{ uri: item.square_url }} style={estilos.avatarCampeao} />
            ) : (
              <View style={[estilos.avatarCampeao, estilos.avatarVazio]} />
            )}
            <Text style={estilos.nomeCampeao} numberOfLines={1}>{item.nome_campeao || 'Campeão'}</Text>
          </View>

          {/* Divisor vertical */}
          <View style={estilos.divisorVertical} />

          {/* Itens e Botas */}
          <View style={estilos.secaoEquipamento}>
            <Text style={estilos.tituloMiniSecao}>ITENS & BOTA</Text>
            <View style={estilos.linhaItens}>
              {/* Item 1 */}
              <View style={estilos.itemContainer}>
                {item.item_1_img ? (
                  <Image source={{ uri: item.item_1_img }} style={estilos.imagemItem} />
                ) : (
                  <View style={[estilos.imagemItem, estilos.itemVazio]} />
                )}
              </View>
              {/* Item 2 */}
              <View style={estilos.itemContainer}>
                {item.item_2_img ? (
                  <Image source={{ uri: item.item_2_img }} style={estilos.imagemItem} />
                ) : (
                  <View style={[estilos.imagemItem, estilos.itemVazio]} />
                )}
              </View>
              {/* Item 3 */}
              <View style={estilos.itemContainer}>
                {item.item_3_img ? (
                  <Image source={{ uri: item.item_3_img }} style={estilos.imagemItem} />
                ) : (
                  <View style={[estilos.imagemItem, estilos.itemVazio]} />
                )}
              </View>
              {/* Bota */}
              <View style={estilos.itemContainer}>
                {item.bota_img ? (
                  <Image source={{ uri: item.bota_img }} style={estilos.imagemItem} />
                ) : (
                  <View style={[estilos.imagemItem, estilos.botaVazia]} />
                )}
              </View>
            </View>
          </View>

          {/* Divisor vertical */}
          <View style={estilos.divisorVertical} />

          {/* Runa Principal e Fragmentos */}
          <View style={estilos.secaoRuna}>
            <Text style={estilos.tituloMiniSecao}>KEYSTONE & RUNAS</Text>
            {item.runa_chave_img ? (
              <Image source={{ uri: item.runa_chave_img }} style={estilos.imagemRuna} />
            ) : (
              <View style={[estilos.imagemRuna, estilos.runaVazia]} />
            )}
            <Text style={estilos.nomeRuna} numberOfLines={1}>{item.runa_chave_nome || 'Nenhuma'}</Text>
            
            {/* Fragmentos Menores */}
            <View style={{ flexDirection: 'row', marginTop: 6, gap: 4 }}>
              {item.runa_fenda1_img && <Image source={{ uri: item.runa_fenda1_img }} style={{ width: 18, height: 18, borderRadius: 9 }} />}
              {item.runa_fenda2_img && <Image source={{ uri: item.runa_fenda2_img }} style={{ width: 18, height: 18, borderRadius: 9 }} />}
              {item.runa_fenda3_img && <Image source={{ uri: item.runa_fenda3_img }} style={{ width: 18, height: 18, borderRadius: 9 }} />}
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={estilos.areaSegura}>
      <View style={estilos.container}>
        
        {/* Cabeçalho */}
        <View style={estilos.cabecalho}>
          <TouchableOpacity onPress={() => navegacao.goBack()} style={estilos.botaoVoltar}>
            <Ionicons name="arrow-back" size={24} color={cores.primaria} />
          </TouchableOpacity>
          <Text style={estilos.tituloCabecalho}>FAVORITAS</Text>
          <TouchableOpacity onPress={carregarBuilds} style={estilos.botaoVoltar}>
            <Ionicons name="refresh" size={24} color={cores.primaria} />
          </TouchableOpacity>
        </View>

        {carregando ? (
          <View style={estilos.centro}>
            <ActivityIndicator size="large" color={cores.primaria} />
            <Text style={estilos.textoLoading}>Buscando builds na forja...</Text>
          </View>
        ) : erro ? (
          <View style={estilos.centro}>
            <Text style={estilos.textoErro}>{erro}</Text>
            <TouchableOpacity style={estilos.botaoRecarregar} onPress={carregarBuilds}>
              <Text style={estilos.textoBotaoRecarregar}>Tentar Novamente</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={builds}
            keyExtractor={(item) => String(item.ID_build)}
            renderItem={renderizarBuildItem}
            contentContainerStyle={estilos.listaBuilds}
            ListEmptyComponent={
              <View style={estilos.containerVazio}>
                <Ionicons name="star-outline" size={60} color={cores.primariaEscura} />
                <Text style={estilos.textoVazio}>Nenhuma build favoritada ainda.</Text>
                <Text style={estilos.textoSubVazio}>Abra o menu Builds para criar e favoritar sua primeira build!</Text>
              </View>
            }
          />
        )}

        <ModalConfirmacao
          visivel={modalConfirmacaoVisivel}
          titulo="Excluir Build"
          mensagem={`Tem certeza que deseja excluir a build "${buildParaExcluir?.nome_build || 'Sem Nome'}"?`}
          aoConfirmar={lidarComConfirmacaoExclusao}
          carregando={isExcluindo}
          aoCancelar={() => {
            setModalConfirmacaoVisivel(false);
            setBuildParaExcluir(null);
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  areaSegura: { flex: 1, backgroundColor: cores.fundoPrincipal },
  container: { flex: 1 },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: cores.primariaEscura,
  },
  botaoVoltar: { padding: 5 },
  tituloCabecalho: {
    fontSize: 24,
    fontWeight: 'bold',
    color: cores.primaria,
    fontFamily: 'serif',
    letterSpacing: 2,
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
    fontFamily: 'serif',
  },
  textoErro: {
    color: '#e74c3c',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  botaoRecarregar: {
    borderWidth: 1,
    borderColor: cores.primaria,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  textoBotaoRecarregar: {
    color: cores.primaria,
    fontWeight: 'bold',
  },
  listaBuilds: {
    padding: 20,
    gap: 15,
  },
  cardBuild: {
    backgroundColor: cores.fundoSecundario,
    borderWidth: 1,
    borderColor: cores.primariaEscura,
    borderRadius: 12,
    padding: 15,
  },
  cabecalhoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: cores.fundoPrincipal,
    paddingBottom: 10,
    marginBottom: 10,
  },
  acoesCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  botaoAcao: {
    padding: 4,
  },
  nomeBuild: {
    color: cores.primaria,
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  corpoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  secaoCampeao: {
    width: '25%',
    alignItems: 'center',
  },
  avatarCampeao: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: cores.primaria,
    marginBottom: 5,
  },
  avatarVazio: {
    backgroundColor: cores.fundoPrincipal,
  },
  nomeCampeao: {
    color: cores.textoClaro,
    fontSize: 12,
    textAlign: 'center',
  },
  divisorVertical: {
    width: 1,
    height: 60,
    backgroundColor: cores.fundoPrincipal,
  },
  secaoEquipamento: {
    width: '45%',
    alignItems: 'center',
  },
  tituloMiniSecao: {
    color: cores.textoSecundario,
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 1,
  },
  linhaItens: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
  },
  itemContainer: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: cores.primariaEscura,
    overflow: 'hidden',
  },
  imagemItem: {
    width: '100%',
    height: '100%',
  },
  itemVazio: {
    backgroundColor: cores.fundoPrincipal,
  },
  botaVazia: {
    backgroundColor: cores.fundoPrincipal,
  },
  secaoRuna: {
    width: '25%',
    alignItems: 'center',
  },
  imagemRuna: {
    width: 35,
    height: 35,
    borderRadius: 18,
    marginBottom: 5,
  },
  runaVazia: {
    backgroundColor: cores.fundoPrincipal,
  },
  nomeRuna: {
    color: cores.textoClaro,
    fontSize: 10,
    textAlign: 'center',
  },
  containerVazio: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  textoVazio: {
    color: cores.textoPrincipal,
    fontSize: 18,
    fontFamily: 'serif',
    marginTop: 20,
    textAlign: 'center',
  },
  textoSubVazio: {
    color: cores.textoSecundario,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
});

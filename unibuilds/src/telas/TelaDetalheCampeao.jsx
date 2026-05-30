import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { obterDetalheCampeao } from '../servicos/api';
import { cores } from '../tema/cores';

// Tela rica em detalhes mostrando skins e habilidades de um campeão selecionado
export default function TelaDetalheCampeao() {
  const rota = useRoute(); // useRoute pega as informações que foram enviadas na navegação
  const navegacao = useNavigation();
  
  const idDoCampeaoSelecionado = rota.params.championId; // Pegamos o ID passado pela tela de lista
  const [campeao, setCampeao] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    carregarDetalhes();
  }, [idDoCampeaoSelecionado]);

  const carregarDetalhes = async () => {
    try {
      setCarregando(true);
      setErro(null);
      const dados = await obterDetalheCampeao(idDoCampeaoSelecionado);
      setCampeao(dados);
    } catch (err) {
      setErro('Não foi possível obter os detalhes do campeão.');
    } finally {
      setCarregando(false);
    }
  };

  if (carregando) {
    return (
      <View style={estilos.centro}>
        <ActivityIndicator size="large" color={cores.primaria} />
        <Text style={estilos.textoLoading}>Invocando campeão...</Text>
      </View>
    );
  }

  // Se por acaso tentar abrir e não existir (ex: ID errado), exibimos um erro amigável
  if (erro || !campeao) {
    return (
      <View style={estilos.centro}>
        <Text style={estilos.textoErro}>{erro || 'Campeão não encontrado.'}</Text>
        <TouchableOpacity style={estilos.botaoRecarregar} onPress={carregarDetalhes}>
          <Text style={estilos.textoBotaoRecarregar}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Encontra a passiva ('P') e as habilidades normais ('Q', 'W', 'E', 'R')
  const passiva = campeao.habilidades?.find(h => h.tecla === 'P');
  const habilidadesAtivas = campeao.habilidades?.filter(h => h.tecla !== 'P') || [];
  
  // Utiliza a primeira skin como banner, ou o splash padrão
  const imagemBanner = campeao.skins?.[0]?.splash_url || campeao.splash_url;

  return (
    <SafeAreaView style={estilos.areaSegura}>
      <ScrollView style={estilos.container}>
        {/* Sessão Principal: Imagem enorme no topo desfocada (Blur) para criar uma atmosfera */}
        <View style={estilos.secaoPrincipal}>
          <Image source={{ uri: imagemBanner }} style={estilos.imagemFundo} blurRadius={3} />
          <TouchableOpacity onPress={() => navegacao.goBack()} style={estilos.botaoVoltarAbsoluto}>
            <Ionicons name="arrow-back" size={24} color={cores.primaria} />
          </TouchableOpacity>
          <View style={estilos.camadaEscura}>
            <Text style={estilos.tituloPrincipal}>{campeao.nome.toUpperCase()}</Text>
            <Text style={estilos.subtitulo}>{campeao.titulo ? campeao.titulo.toUpperCase() : ''}</Text>
          </View>
        </View>

        {/* Habilidades do Campeão */}
        <View style={estilos.secaoDados}>
          <Text style={estilos.tituloDaSecao}>HABILIDADES</Text>
          
          {/* Mostra primeiro a passiva dele se existir */}
          {passiva && (
            <View style={estilos.caixaHabilidade}>
              <Image source={{ uri: passiva.imagem_url }} style={estilos.iconeHabilidade} />
              <View style={estilos.textoHabilidadeContainer}>
                <Text style={estilos.nomeDaHabilidade}>{passiva.nome_habilidade} (Passiva)</Text>
                <Text style={estilos.descDaHabilidade}>{passiva.descricao}</Text>
              </View>
            </View>
          )}

          {/* Mapeia e desenha as outras habilidades (Q, W, E, R) */}
          {habilidadesAtivas.map((hab, index) => (
            <View key={index} style={estilos.caixaHabilidade}>
              <Image source={{ uri: hab.imagem_url }} style={estilos.iconeHabilidade} />
              <View style={estilos.textoHabilidadeContainer}>
                <Text style={estilos.nomeDaHabilidade}>{hab.nome_habilidade} ({hab.tecla})</Text>
                <Text style={estilos.descDaHabilidade}>{hab.descricao}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Carrossel de Skins do Campeão */}
        {campeao.skins && campeao.skins.length > 0 && (
          <View style={estilos.secaoDados}>
            <Text style={estilos.tituloDaSecao}>SKINS</Text>
            {/* ScrollView horizontal permite rolar para o lado as imagens */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={estilos.containerDasSkins}>
              {campeao.skins.map((skin, index) => (
                <View key={index} style={estilos.cartaoSkin}>
                  <Image source={{ uri: skin.loading_url }} style={estilos.imagemDaSkin} />
                  <Text style={estilos.nomeDaSkin} numberOfLines={1}>{skin.nome_skin}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Estilos baseados no tema Hextech/Dark
const estilos = StyleSheet.create({
  areaSegura: { flex: 1, backgroundColor: cores.fundoPrincipal },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: cores.fundoPrincipal, padding: 20 },
  textoLoading: { color: cores.primaria, marginTop: 15, fontSize: 16, fontFamily: 'serif' },
  textoErro: { color: '#e74c3c', fontSize: 16, textAlign: 'center', marginBottom: 20 },
  botaoRecarregar: { backgroundColor: cores.primaria, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  textoBotaoRecarregar: { color: cores.fundoPrincipal, fontWeight: 'bold', fontSize: 16 },
  container: { flex: 1 },
  secaoPrincipal: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderBottomWidth: 2,
    borderBottomColor: cores.primaria,
  },
  botaoVoltarAbsoluto: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10, // Garante que a seta fique por cima de todas as imagens
    padding: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },
  imagemFundo: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    opacity: 0.4, // Deixa a imagem mais transparente para podermos ler os textos nela
  },
  camadaEscura: {
    alignItems: 'center',
    padding: 20,
  },
  tituloPrincipal: {
    fontSize: 32,
    fontWeight: 'bold',
    color: cores.primaria,
    fontFamily: 'serif',
    letterSpacing: 2,
  },
  subtitulo: {
    fontSize: 16,
    color: cores.textoClaro,
    letterSpacing: 1,
    marginTop: 8,
  },
  secaoDados: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: cores.primariaEscura,
  },
  tituloDaSecao: {
    fontSize: 18,
    fontWeight: 'bold',
    color: cores.primaria,
    marginBottom: 15,
    fontFamily: 'serif',
  },
  caixaHabilidade: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: cores.fundoSecundario,
    borderWidth: 1,
    borderColor: cores.primariaEscura,
    borderRadius: 8,
    padding: 10,
  },
  iconeHabilidade: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: cores.primaria,
    marginRight: 15,
  },
  textoHabilidadeContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nomeDaHabilidade: {
    color: cores.primaria,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  descDaHabilidade: {
    color: cores.textoSecundario,
    fontSize: 14,
  },
  containerDasSkins: {
    flexDirection: 'row',
  },
  cartaoSkin: {
    marginRight: 15,
    alignItems: 'center',
    width: 120,
  },
  imagemDaSkin: {
    width: 120,
    height: 200,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: cores.primaria,
    marginBottom: 8,
  },
  nomeDaSkin: {
    color: cores.textoSecundario,
    fontSize: 12,
    textAlign: 'center',
    width: 120,
  },
});

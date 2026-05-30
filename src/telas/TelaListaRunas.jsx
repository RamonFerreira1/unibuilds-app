import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, SafeAreaView, TouchableOpacity, TextInput, ActivityIndicator, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { obterRunas } from '../servicos/api';
import { cores } from '../tema/cores';

// Essa tela exibe uma verdadeira enciclopédia das runas, separadas por caminhos (ex: Precisão, Dominação).
export default function TelaListaRunas() {
  const navegacao = useNavigation();
  const [textoBusca, setTextoBusca] = useState('');
  const [runas, setRunas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  
  // Estado para controlar a exibição da descrição da runa clicada no centro
  const [runaSelecionada, setRunaSelecionada] = useState(null);

  useEffect(() => {
    carregarRunas();
  }, []);

  const carregarRunas = async () => {
    try {
      setCarregando(true);
      setErro(null);
      const dados = await obterRunas();
      // Mapeia a resposta da API para o formato esperado pelo layout
      const dadosAdaptados = dados.map(r => ({
        id: r.nome_arvore,
        nome: r.nome_arvore,
        imagem: r.keystones?.[0]?.imagem_url || '',
        runasPrincipais: (r.keystones || []).map(k => ({
          id: k.ID_runa,
          nome: k.nome_runa,
          imagem: k.imagem_url,
          descricao: k.descricao
        })),
        espaco1: (r.slots?.[0] || []).map(s => ({
          id: s.ID_runa,
          nome: s.nome_runa,
          imagem: s.imagem_url,
          descricao: s.descricao
        })),
        espaco2: (r.slots?.[1] || []).map(s => ({
          id: s.ID_runa,
          nome: s.nome_runa,
          imagem: s.imagem_url,
          descricao: s.descricao
        })),
        espaco3: (r.slots?.[2] || []).map(s => ({
          id: s.ID_runa,
          nome: s.nome_runa,
          imagem: s.imagem_url,
          descricao: s.descricao
        }))
      }));
      setRunas(dadosAdaptados);
    } catch (err) {
      setErro('Não foi possível carregar as runas. Verifique sua conexão.');
    } finally {
      setCarregando(false);
    }
  };

  // Filtra as árvores de runas. Se o nome da árvore bater com a pesquisa, ou se o nome
  // de qualquer runa lá dentro bater, nós mostramos essa árvore.
  const runasFiltradas = runas.filter(arvore => {
    const busca = textoBusca.toLowerCase();
    if (arvore.nome.toLowerCase().includes(busca)) return true;
    
    // Procura dentro das runas se tem alguma com esse nome
    const achouPrincipal = arvore.runasPrincipais?.some(r => r.nome.toLowerCase().includes(busca)) || false;
    const achou1 = arvore.espaco1?.some(r => r.nome.toLowerCase().includes(busca)) || false;
    const achou2 = arvore.espaco2?.some(r => r.nome.toLowerCase().includes(busca)) || false;
    const achou3 = arvore.espaco3?.some(r => r.nome.toLowerCase().includes(busca)) || false;
    
    return achouPrincipal || achou1 || achou2 || achou3;
  });

  // Uma função auxiliar que a gente criou para renderizar (desenhar na tela) uma linha de runas.
  // Criamos essa função para não precisar repetir o mesmo código 4 vezes para cada árvore de runas.
  const renderizarLinhaRuna = (titulo, runasLinha) => {
    if (!runasLinha || runasLinha.length === 0) return null;
    return (
      <View style={estilos.containerLinhaRuna}>
        {/* Cabeçalho da linha (ex: "KEYSTONE", "SLOT 1") com as linhazinhas divisórias do lado */}
        <View style={estilos.cabecalhoLinhaRuna}>
          <View style={estilos.divisoriaLinha} />
          <Text style={estilos.tituloLinhaRuna}>{titulo}</Text>
          <View style={estilos.divisoriaLinha} />
        </View>
        
        {/* Os ícones das runas alinhados lado a lado */}
        <View style={estilos.linhaRuna}>
          {runasLinha.map(runa => (
            <TouchableOpacity 
              key={runa.id} 
              style={estilos.itemRuna}
              onPress={() => setRunaSelecionada(runa)}
            >
              <Image source={{ uri: runa.imagem }} style={estilos.imagemRuna} />
              <Text style={estilos.nomeRuna} numberOfLines={1}>{runa.nome}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={estilos.areaSegura}>
      <View style={estilos.container}>
        {/* Cabeçalho Customizado com Botão de Voltar */}
        <View style={estilos.cabecalho}>
          <TouchableOpacity onPress={() => navegacao.goBack()} style={estilos.botaoVoltar}>
            <Ionicons name="arrow-back" size={24} color={cores.primaria} />
          </TouchableOpacity>
          <Text style={estilos.tituloCabecalho}>RUNAS</Text>
          <TouchableOpacity onPress={carregarRunas} style={estilos.botaoVoltar}>
            <Ionicons name="refresh" size={24} color={cores.primaria} />
          </TouchableOpacity>
        </View>

        {/* Barra de Pesquisa */}
        <View style={estilos.containerBusca}>
          <Ionicons name="search" size={20} color={cores.primaria} style={estilos.iconeBusca} />
          <TextInput
            style={estilos.inputBusca}
            placeholder="Pesquisar Árvore ou Runa..."
            placeholderTextColor={cores.textoSecundario}
            value={textoBusca}
            onChangeText={setTextoBusca}
          />
        </View>

        {carregando ? (
          <View style={estilos.centro}>
            <ActivityIndicator size="large" color={cores.primaria} />
            <Text style={estilos.textoLoading}>Carregando runas...</Text>
          </View>
        ) : erro ? (
          <View style={estilos.centro}>
            <Text style={estilos.textoErro}>{erro}</Text>
            <TouchableOpacity style={estilos.botaoRecarregar} onPress={carregarRunas}>
              <Text style={estilos.textoBotaoRecarregar}>Tentar Novamente</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* ScrollView permite rolar a página verticalmente, já que é muito conteúdo */
          <ScrollView contentContainerStyle={estilos.conteudoRolavel}>
            {/* Pegamos nosso banco de dados filtrado e desenhamos uma sessão para cada árvore */}
            {runasFiltradas.length === 0 ? (
              <Text style={estilos.textoVazio}>Nenhuma runa encontrada com esse nome.</Text>
            ) : (
              runasFiltradas.map((arvore) => (
                <View key={arvore.id} style={estilos.containerArvore}>
                  <View style={estilos.cabecalhoArvore}>
                    <Image source={{ uri: arvore.imagem }} style={estilos.imagemArvore} />
                    <Text style={estilos.nomeArvore}>{arvore.nome}</Text>
                  </View>

                  {/* Chamamos a nossa função auxiliar 4 vezes para montar a árvore inteira */}
                  {renderizarLinhaRuna('KEYSTONE', arvore.runasPrincipais)}
                  {renderizarLinhaRuna('SLOT 1', arvore.espaco1)}
                  {renderizarLinhaRuna('SLOT 2', arvore.espaco2)}
                  {renderizarLinhaRuna('SLOT 3', arvore.espaco3)}
                </View>
              ))
            )}
          </ScrollView>
        )}

        <Modal
          transparent={true}
          animationType="fade"
          visible={runaSelecionada !== null}
          onRequestClose={() => setRunaSelecionada(null)}
        >
          <View style={estilos.fundoEscuroModal}>
            <View style={estilos.caixaModalRuna}>
              <TouchableOpacity style={estilos.botaoFecharModalRuna} onPress={() => setRunaSelecionada(null)}>
                <Ionicons name="close" size={24} color={cores.primaria} />
              </TouchableOpacity>
              
              {runaSelecionada?.imagem ? (
                <Image source={{ uri: runaSelecionada.imagem }} style={estilos.imagemRunaModal} />
              ) : null}
              <Text style={estilos.tituloRunaModal}>{runaSelecionada?.nome}</Text>
              <Text style={estilos.descricaoRunaModal}>
                {runaSelecionada?.descricao || 'Esta runa canaliza poder bruto do universo League of Legends.'}
              </Text>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

// Estilos visuais
const estilos = StyleSheet.create({
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
  areaSegura: { flex: 1, backgroundColor: cores.fundoPrincipal },
  container: { flex: 1 },
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
  conteudoRolavel: {
    paddingBottom: 40,
  },
  containerArvore: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: cores.primariaEscura,
  },
  cabecalhoArvore: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imagemArvore: {
    width: 60,
    height: 60,
    borderRadius: 30, // Faz a imagem ficar redonda
    borderWidth: 2,
    borderColor: cores.primaria,
    marginBottom: 10,
  },
  nomeArvore: {
    color: cores.textoClaro,
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  containerLinhaRuna: {
    marginBottom: 20,
  },
  cabecalhoLinhaRuna: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  divisoriaLinha: {
    flex: 1,
    height: 1,
    backgroundColor: cores.primariaEscura,
  },
  tituloLinhaRuna: {
    color: cores.primaria,
    marginHorizontal: 10,
    fontWeight: 'bold',
    fontSize: 12,
  },
  linhaRuna: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Distribui os ícones com espaçamentos iguais
  },
  itemRuna: {
    alignItems: 'center',
    width: '30%',
  },
  imagemRuna: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: cores.primaria,
    marginBottom: 8,
  },
  nomeRuna: {
    color: cores.textoSecundario,
    fontSize: 11,
    textAlign: 'center',
  },
  textoVazio: {
    color: cores.textoSecundario,
    textAlign: 'center',
    marginTop: 40,
    fontStyle: 'italic',
  },
  fundoEscuroModal: {
    flex: 1,
    backgroundColor: 'rgba(6, 16, 30, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  caixaModalRuna: {
    backgroundColor: cores.fundoSecundario,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    borderWidth: 2,
    borderColor: cores.primaria,
    alignItems: 'center',
    position: 'relative',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  botaoFecharModalRuna: {
    position: 'absolute',
    top: 15,
    right: 15,
    padding: 5,
    zIndex: 1,
  },
  imagemRunaModal: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: cores.primaria,
    marginBottom: 15,
  },
  tituloRunaModal: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'serif',
    color: cores.primaria,
    marginBottom: 15,
    letterSpacing: 1,
    textAlign: 'center',
  },
  descricaoRunaModal: {
    fontSize: 15,
    color: cores.textoClaro,
    textAlign: 'center',
    lineHeight: 22,
  }
});

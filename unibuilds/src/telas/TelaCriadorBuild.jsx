import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useEstadoBuild } from '../estado/useEstadoBuild';
import { useEstadoAutenticacao } from '../estado/useEstadoAutenticacao';
import { cores } from '../tema/cores';
import ModalAlerta from '../componentes/ModalAlerta';
import ModalSeletor from '../componentes/ModalSeletor';
import { obterCampeoes, obterItens, obterRunas, criarBuild } from '../servicos/api';

export default function TelaCriadorBuild() {
  const navegacao = useNavigation();
  const { nomeUsuario } = useEstadoAutenticacao();
  
  const { 
    nomeDaBuild, setNomeDaBuild,
    campeaoSelecionado, setCampeao,
    itensSelecionados, setItem,
    arvoreDeRunas, setArvoreDeRunas,
    runaPrincipal, setRunaPrincipal,
    fragmentos, setFragmento,
    resetarBuild,
  } = useEstadoBuild();
  
  const [modalAlertaVisivel, setModalAlertaVisivel] = useState(false);
  const [mensagemModalAlerta, setMensagemModalAlerta] = useState('');
  const [tipoAlerta, setTipoAlerta] = useState('aviso');

  const [modalSeletorVisivel, setModalSeletorVisivel] = useState(false);
  const [configSeletor, setConfigSeletor] = useState({ titulo: '', dados: [], onSelect: () => {} });

  // Listas vindas da API
  const [campeoesApi, setCampeoesApi] = useState([]);
  const [itensApi, setItensApi] = useState([]);
  const [runasApi, setRunasApi] = useState([]);
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [enviandoBuild, setEnviandoBuild] = useState(false);

  useEffect(() => {
    carregarDadosFormulario();
  }, []);

  const carregarDadosFormulario = async () => {
    try {
      setCarregandoDados(true);
      const [dadosChamps, dadosItens, dadosRunas] = await Promise.all([
        obterCampeoes(),
        obterItens(),
        obterRunas()
      ]);
      setCampeoesApi(dadosChamps);
      setItensApi(dadosItens);
      setRunasApi(dadosRunas);
    } catch (erro) {
      console.error('Erro ao carregar dados do formulário:', erro);
    } finally {
      setCarregandoDados(false);
    }
  };

  const lidarComFavoritar = async () => {
    if (!nomeDaBuild.trim()) {
      setTipoAlerta('aviso');
      setMensagemModalAlerta("Sua build precisa de um nome antes de ser favoritada!");
      setModalAlertaVisivel(true);
      return;
    }
    if (!campeaoSelecionado) {
      setTipoAlerta('aviso');
      setMensagemModalAlerta("Selecione um campeão para a build!");
      setModalAlertaVisivel(true);
      return;
    }

    try {
      setEnviandoBuild(true);

      // Separar itens comuns e botas
      // A tabela do banco e a API suportam no máximo 3 itens comuns.
      const itensComunsIds = itensSelecionados
        .slice(0, 3)
        .filter(item => item !== null)
        .map(item => item.ID_riot);

      const botaId = itensSelecionados[3] ? itensSelecionados[3].ID_riot : null;

      // Unir as runas selecionadas (Keystone + Shards)
      const runesIds = [];
      if (runaPrincipal) runesIds.push(runaPrincipal.id);
      fragmentos.forEach(frag => {
        if (frag) runesIds.push(frag.id);
      });

      const buildPayload = {
        userId: nomeUsuario || 'invocador_anonimo',
        nomeBuild: nomeDaBuild,
        championId: campeaoSelecionado.ID,
        items: itensComunsIds,
        bootId: botaId,
        spell1Id: 4, // Feitiço Padrão: Flash (ID 4)
        spell2Id: 11, // Feitiço Padrão: Incendiar/Golpear (ID 11)
        runes: runesIds
      };

      await criarBuild(buildPayload);
      
      setTipoAlerta('sucesso');
      setMensagemModalAlerta(`A build "${nomeDaBuild}" foi favoritada e salva no banco de dados!`);
      setModalAlertaVisivel(true);
      // Reseta o formulário ao fechar o modal de sucesso (veja aoFecharModalAlerta)
    } catch (erro) {
      setTipoAlerta('aviso');
      setMensagemModalAlerta("Não foi possível salvar a build. Tente novamente.");
      setModalAlertaVisivel(true);
    } finally {
      setEnviandoBuild(false);
    }
  };

  const abrirSeletor = (titulo, dadosBrutos, tipo, aoSelecionarOriginal) => {
    // Normalizar dados para o ModalSeletor que espera { id, nome, imagem }
    let dadosNormalizados = [];
    
    if (tipo === 'campeao') {
      dadosNormalizados = dadosBrutos.map(c => ({
        id: String(c.ID),
        nome: c.nome,
        imagem: c.square_url,
        original: c
      }));
    } else if (tipo === 'item') {
      dadosNormalizados = dadosBrutos.map(i => ({
        id: String(i.ID_riot),
        nome: i.nome,
        imagem: i.imagem_url,
        original: i
      }));
    } else if (tipo === 'runa_arvore') {
      dadosNormalizados = dadosBrutos.map(r => {
        const arvoreAdaptada = {
          id: r.nome_arvore,
          nome: r.nome_arvore,
          imagem: r.keystones?.[0]?.imagem_url || '',
          runasPrincipais: r.keystones || [],
          espaco1: r.slots?.[0] || [],
          espaco2: r.slots?.[1] || [],
          espaco3: r.slots?.[2] || []
        };
        return {
          id: r.nome_arvore,
          nome: r.nome_arvore,
          imagem: arvoreAdaptada.imagem,
          original: arvoreAdaptada
        };
      });
    } else {
      // Runas individuais
      dadosNormalizados = dadosBrutos.map(r => ({
        id: String(r.ID_runa),
        nome: r.nome_runa,
        imagem: r.imagem_url,
        original: {
          id: r.ID_runa,
          nome: r.nome_runa,
          imagem: r.imagem_url,
          ...r
        }
      }));
    }

    setConfigSeletor({
      titulo,
      dados: dadosNormalizados,
      onSelect: (itemSelecionado) => {
        aoSelecionarOriginal(itemSelecionado.original);
      }
    });
    setModalSeletorVisivel(true);
  };

  const BotaoEspaco = ({ imagem, onPress, onRemove, tamanho = 60, tamanhoIcone = 30 }) => (
    <View style={{ position: 'relative' }}>
      <TouchableOpacity 
        style={[estilos.espacoVazio, { width: tamanho, height: tamanho }]}
        onPress={onPress}
      >
        {imagem ? (
          <Image source={{ uri: imagem }} style={estilos.imagemSelecionada} />
        ) : (
          <Ionicons name="add" size={tamanhoIcone} color={cores.primariaEscura} />
        )}
      </TouchableOpacity>
      {/* Se tiver imagem, mostraremos um "X" vermelho no cantinho para poder apagar */}
      {imagem && onRemove && (
        <TouchableOpacity style={estilos.botaoRemoverAbsoluto} onPress={onRemove}>
          <Ionicons name="close-circle" size={24} color="#e74c3c" />
        </TouchableOpacity>
      )}
    </View>
  );

  if (carregandoDados) {
    return (
      <View style={estilos.centroCarregamento}>
        <ActivityIndicator size="large" color={cores.primaria} />
        <Text style={estilos.textoLoading}>Preparando forja...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={estilos.areaSegura}>
      <View style={estilos.container}>
        
        <View style={estilos.cabecalho}>
          <TouchableOpacity onPress={() => navegacao.goBack()} style={estilos.botaoVoltar}>
            <Ionicons name="arrow-back" size={24} color={cores.primaria} />
          </TouchableOpacity>
          <Text style={estilos.tituloCabecalho}>BUILD</Text>
          <TouchableOpacity style={estilos.botaoFavoritar} onPress={lidarComFavoritar} disabled={enviandoBuild}>
            {enviandoBuild ? (
              <ActivityIndicator size="small" color={cores.primaria} />
            ) : (
              <>
                <Text style={estilos.textoFavoritar}>FAVORITAR BUILD</Text>
                <Ionicons name="star-outline" size={20} color={cores.primaria} />
              </>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={estilos.conteudoRolavel}>
          
          <TextInput 
            style={estilos.inputNome} 
            placeholder="{NOME_DA_BUILD}"
            placeholderTextColor={cores.textoSecundario}
            value={nomeDaBuild}
            onChangeText={setNomeDaBuild}
          />

          <View style={estilos.secao}>
            <View style={estilos.cabecalhoSecao}>
              <Text style={estilos.tituloSecao}>SELECIONE UM CAMPEÃO</Text>
            </View>
            <View style={estilos.linhaCentralizada}>
              <BotaoEspaco 
                imagem={campeaoSelecionado?.square_url} 
                onPress={() => abrirSeletor("Selecione um Campeão", campeoesApi, 'campeao', setCampeao)}
                onRemove={() => setCampeao(null)}
                tamanho={80} 
                tamanhoIcone={40} 
              />
            </View>
          </View>

          <View style={estilos.secao}>
            <View style={estilos.cabecalhoSecao}>
              <Text style={estilos.tituloSecao}>SELEÇÃO DE ITENS (4º SLOT É A BOTA)</Text>
            </View>
            <View style={estilos.gradeDeItens}>
              {itensSelecionados.map((item, i) => (
                <View key={i} style={estilos.envelopeDoItem}>
                  <BotaoEspaco 
                    imagem={item?.imagem_url}
                    onPress={() => abrirSeletor(i === 3 ? "Selecione uma Bota" : "Selecione um Item", itensApi, 'item', (itemEscolhido) => setItem(i, itemEscolhido))}
                    onRemove={() => setItem(i, null)}
                    tamanho={65} 
                    tamanhoIcone={30} 
                  />
                  <Text style={estilos.legendaSlot}>{i === 3 ? 'Bota' : `Slot ${i+1}`}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={estilos.secao}>
            <View style={estilos.cabecalhoSecao}>
              <Text style={estilos.tituloSecao}>SELEÇÃO DE RUNAS</Text>
            </View>
            <View style={estilos.linhaSuperiorRunas}>
              <View style={estilos.colunaRuna}>
                <Text style={estilos.rotuloRuna}>Caminho (Path)</Text>
                <BotaoEspaco 
                  imagem={arvoreDeRunas?.imagem}
                  onPress={() => abrirSeletor("Caminho Principal", runasApi, 'runa_arvore', setArvoreDeRunas)}
                  onRemove={() => setArvoreDeRunas(null)}
                  tamanho={70} 
                  tamanhoIcone={35} 
                />
              </View>
              <View style={estilos.colunaRuna}>
                <Text style={estilos.rotuloRuna}>Runa Keystone</Text>
                <BotaoEspaco 
                  imagem={runaPrincipal?.imagem}
                  onPress={() => {
                    if(!arvoreDeRunas) {
                      setTipoAlerta('aviso');
                      setMensagemModalAlerta("Selecione um Caminho de runas primeiro!");
                      return setModalAlertaVisivel(true);
                    }
                    abrirSeletor("Selecione a Keystone", arvoreDeRunas.runasPrincipais, 'runa_individual', setRunaPrincipal);
                  }}
                  onRemove={() => setRunaPrincipal(null)}
                  tamanho={70} 
                  tamanhoIcone={35} 
                />
              </View>
            </View>
            
            <View style={estilos.secaoFragmentos}>
              <Text style={estilos.rotuloRuna}>Fragmentos Menores (Slots 1, 2 e 3)</Text>
              <View style={estilos.linhaDeFragmentos}>
                {fragmentos.map((frag, i) => (
                  <BotaoEspaco 
                    key={i}
                    imagem={frag?.imagem}
                    onPress={() => {
                      if(!arvoreDeRunas) {
                        setTipoAlerta('aviso');
                        setMensagemModalAlerta("Selecione um Caminho de runas primeiro!");
                        return setModalAlertaVisivel(true);
                      }
                      const espacos = [arvoreDeRunas.espaco1, arvoreDeRunas.espaco2, arvoreDeRunas.espaco3];
                      abrirSeletor(`Fragmento ${i+1}`, espacos[i], 'runa_individual', (runaEscolhida) => setFragmento(i, runaEscolhida));
                    }}
                    onRemove={() => setFragmento(i, null)}
                    tamanho={50} 
                    tamanhoIcone={25} 
                  />
                ))}
              </View>
            </View>
          </View>

        </ScrollView>

        <ModalAlerta 
          visivel={modalAlertaVisivel}
          titulo="SISTEMA"
          tipo={tipoAlerta}
          mensagem={mensagemModalAlerta}
          aoFechar={() => {
            setModalAlertaVisivel(false);
            // Se foi sucesso, limpa o formulário para uma nova build
            if (tipoAlerta === 'sucesso') {
              resetarBuild();
            }
          }}
        />

        <ModalSeletor
          visivel={modalSeletorVisivel}
          fecharModal={() => setModalSeletorVisivel(false)}
          titulo={configSeletor.titulo}
          dados={configSeletor.dados}
          aoSelecionar={configSeletor.onSelect}
        />
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  areaSegura: { flex: 1, backgroundColor: cores.fundoPrincipal },
  container: { flex: 1 },
  centroCarregamento: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: cores.fundoPrincipal,
  },
  textoLoading: {
    color: cores.primaria,
    marginTop: 15,
    fontSize: 16,
    fontFamily: 'serif',
  },
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
    fontSize: 28,
    fontWeight: 'bold',
    color: cores.primaria,
    fontFamily: 'serif',
    letterSpacing: 2,
  },
  botaoFavoritar: { flexDirection: 'row', alignItems: 'center' },
  textoFavoritar: {
    color: cores.primariaEscura,
    marginRight: 8,
    fontSize: 12,
    fontWeight: 'bold',
  },
  conteudoRolavel: {
    padding: 20,
    paddingBottom: 40,
  },
  inputNome: {
    backgroundColor: cores.fundoSecundario,
    borderWidth: 1,
    borderColor: cores.primaria,
    borderRadius: 8,
    padding: 15,
    color: cores.textoPrincipal,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  secao: { marginBottom: 30 },
  cabecalhoSecao: {
    borderWidth: 1,
    borderColor: cores.primariaEscura,
    backgroundColor: cores.fundoSecundario,
    padding: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  tituloSecao: {
    color: cores.textoClaro,
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1,
  },
  linhaCentralizada: { alignItems: 'center' },
  espacoVazio: {
    backgroundColor: cores.fundoSecundario,
    borderWidth: 1,
    borderColor: cores.primaria,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoRemoverAbsoluto: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff', // Fundo branco sutil atrás do ícone para dar contraste
    borderRadius: 12,
    zIndex: 10,
  },
  imagemSelecionada: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  gradeDeItens: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  envelopeDoItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 15,
  },
  legendaSlot: {
    color: cores.textoSecundario,
    fontSize: 10,
    marginTop: 4,
  },
  linhaSuperiorRunas: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  colunaRuna: { alignItems: 'center' },
  rotuloRuna: {
    color: cores.primaria,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  secaoFragmentos: { alignItems: 'center' },
  linhaDeFragmentos: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },
});

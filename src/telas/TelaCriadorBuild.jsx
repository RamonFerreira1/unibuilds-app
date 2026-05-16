import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useEstadoBuild } from '../estado/useEstadoBuild';
import { cores } from '../tema/cores';
import ModalAlerta from '../componentes/ModalAlerta';
import ModalSeletor from '../componentes/ModalSeletor';

import { dadosCampeoes } from '../dados/dadosCampeoes';
import { dadosItens } from '../dados/dadosItens';
import { dadosRunas } from '../dados/dadosRunas';

export default function TelaCriadorBuild() {
  const navegacao = useNavigation();
  
  const { 
    nomeDaBuild, setNomeDaBuild,
    campeaoSelecionado, setCampeao,
    itensSelecionados, setItem,
    arvoreDeRunas, setArvoreDeRunas,
    runaPrincipal, setRunaPrincipal,
    fragmentos, setFragmento
  } = useEstadoBuild();
  
  const [modalAlertaVisivel, setModalAlertaVisivel] = useState(false);
  const [mensagemModalAlerta, setMensagemModalAlerta] = useState('');

  const [modalSeletorVisivel, setModalSeletorVisivel] = useState(false);
  const [configSeletor, setConfigSeletor] = useState({ titulo: '', dados: [], onSelect: () => {} });

  const lidarComFavoritar = () => {
    if (!nomeDaBuild.trim()) {
      setMensagemModalAlerta("Sua build precisa de um nome antes de ser favoritada!");
      setModalAlertaVisivel(true);
      return;
    }
    setMensagemModalAlerta(`A build "${nomeDaBuild}" foi favoritada com sucesso no sistema!`);
    setModalAlertaVisivel(true);
  };

  const abrirSeletor = (titulo, dados, onSelect) => {
    setConfigSeletor({ titulo, dados, onSelect });
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

  return (
    <SafeAreaView style={estilos.areaSegura}>
      <View style={estilos.container}>
        
        <View style={estilos.cabecalho}>
          <TouchableOpacity onPress={() => navegacao.goBack()} style={estilos.botaoVoltar}>
            <Ionicons name="arrow-back" size={24} color={cores.primaria} />
          </TouchableOpacity>
          <Text style={estilos.tituloCabecalho}>BUILD</Text>
          <TouchableOpacity style={estilos.botaoFavoritar} onPress={lidarComFavoritar}>
            <Text style={estilos.textoFavoritar}>FAVORITAR BUILD</Text>
            <Ionicons name="star-outline" size={20} color={cores.primaria} />
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
                imagem={campeaoSelecionado?.skins?.[0]?.imagem || campeaoSelecionado?.imagem} 
                onPress={() => abrirSeletor("Selecione um Campeão", dadosCampeoes, setCampeao)}
                onRemove={() => setCampeao(null)}
                tamanho={80} 
                tamanhoIcone={40} 
              />
            </View>
          </View>

          <View style={estilos.secao}>
            <View style={estilos.cabecalhoSecao}>
              <Text style={estilos.tituloSecao}>SELEÇÃO DE ITENS</Text>
            </View>
            <View style={estilos.gradeDeItens}>
              {itensSelecionados.map((item, i) => (
                <View key={i} style={estilos.envelopeDoItem}>
                  <BotaoEspaco 
                    imagem={item?.imagem}
                    onPress={() => abrirSeletor("Selecione um Item", dadosItens, (itemEscolhido) => setItem(i, itemEscolhido))}
                    onRemove={() => setItem(i, null)}
                    tamanho={65} 
                    tamanhoIcone={30} 
                  />
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
                  onPress={() => abrirSeletor("Caminho Principal", dadosRunas, setArvoreDeRunas)}
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
                      setMensagemModalAlerta("Selecione um Caminho de runas primeiro!");
                      return setModalAlertaVisivel(true);
                    }
                    abrirSeletor("Selecione a Keystone", arvoreDeRunas.runasPrincipais, setRunaPrincipal);
                  }}
                  onRemove={() => setRunaPrincipal(null)}
                  tamanho={70} 
                  tamanhoIcone={35} 
                />
              </View>
            </View>
            
            <View style={estilos.secaoFragmentos}>
              <Text style={estilos.rotuloRuna}>Fragmentos Menores (Shards)</Text>
              <View style={estilos.linhaDeFragmentos}>
                {fragmentos.map((frag, i) => (
                  <BotaoEspaco 
                    key={i}
                    imagem={frag?.imagem}
                    onPress={() => {
                      if(!arvoreDeRunas) {
                        setMensagemModalAlerta("Selecione um Caminho de runas primeiro!");
                        return setModalAlertaVisivel(true);
                      }
                      const espacos = [arvoreDeRunas.espaco1, arvoreDeRunas.espaco2, arvoreDeRunas.espaco3];
                      abrirSeletor(`Fragmento ${i+1}`, espacos[i], (runaEscolhida) => setFragmento(i, runaEscolhida));
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
          tipo={mensagemModalAlerta.includes("sucesso") ? "sucesso" : "aviso"}
          mensagem={mensagemModalAlerta}
          aoFechar={() => setModalAlertaVisivel(false)}
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

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { dadosRunas } from '../dados/dadosRunas';
import { cores } from '../tema/cores';

// Essa tela exibe uma verdadeira enciclopédia das runas, separadas por caminhos (ex: Precisão, Dominação).
export default function TelaListaRunas() {
  const navegacao = useNavigation();
  const [textoBusca, setTextoBusca] = useState('');

  // Filtra as árvores de runas. Se o nome da árvore bater com a pesquisa, ou se o nome
  // de qualquer runa lá dentro bater, nós mostramos essa árvore.
  const runasFiltradas = dadosRunas.filter(arvore => {
    const busca = textoBusca.toLowerCase();
    if (arvore.nome.toLowerCase().includes(busca)) return true;
    
    // Procura dentro das runas se tem alguma com esse nome
    const achouPrincipal = arvore.runasPrincipais.some(r => r.nome.toLowerCase().includes(busca));
    const achou1 = arvore.espaco1.some(r => r.nome.toLowerCase().includes(busca));
    const achou2 = arvore.espaco2.some(r => r.nome.toLowerCase().includes(busca));
    const achou3 = arvore.espaco3.some(r => r.nome.toLowerCase().includes(busca));
    
    return achouPrincipal || achou1 || achou2 || achou3;
  });

  // Uma função auxiliar que a gente criou para renderizar (desenhar na tela) uma linha de runas.
  // Criamos essa função para não precisar repetir o mesmo código 4 vezes para cada árvore de runas.
  const renderizarLinhaRuna = (titulo, runas) => (
    <View style={estilos.containerLinhaRuna}>
      {/* Cabeçalho da linha (ex: "KEYSTONE", "SLOT 1") com as linhazinhas divisórias do lado */}
      <View style={estilos.cabecalhoLinhaRuna}>
        <View style={estilos.divisoriaLinha} />
        <Text style={estilos.tituloLinhaRuna}>{titulo}</Text>
        <View style={estilos.divisoriaLinha} />
      </View>
      
      {/* Os ícones das runas alinhados lado a lado */}
      <View style={estilos.linhaRuna}>
        {runas.map(runa => (
          <View key={runa.id} style={estilos.itemRuna}>
            <Image source={{ uri: runa.imagem }} style={estilos.imagemRuna} />
            <Text style={estilos.nomeRuna} numberOfLines={1}>{runa.nome}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={estilos.areaSegura}>
      <View style={estilos.container}>
        {/* Cabeçalho Customizado com Botão de Voltar */}
        <View style={estilos.cabecalho}>
          <TouchableOpacity onPress={() => navegacao.goBack()} style={estilos.botaoVoltar}>
            <Ionicons name="arrow-back" size={24} color={cores.primaria} />
          </TouchableOpacity>
          <Text style={estilos.tituloCabecalho}>RUNAS</Text>
          <View style={{ width: 24 }} />
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

        {/* ScrollView permite rolar a página verticalmente, já que é muito conteúdo */}
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
          )))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// Estilos visuais
const estilos = StyleSheet.create({
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
  }
});

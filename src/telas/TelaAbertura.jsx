import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { cores } from '../tema/cores';

// Tela de introdução (Splash Screen) que aparece rapidamente quando o app abre.
export default function TelaAbertura() {
  const navegacao = useNavigation();

  // useEffect roda uma vez quando a tela é montada
  useEffect(() => {
    // Definimos um tempo de 2 segundos (2000 milissegundos)
    const temporizador = setTimeout(() => {
      // Após 2 segundos, levamos o usuário para a tela de Login
      navegacao.replace('Login'); 
    }, 2000);
    
    // Limpeza de segurança caso o componente seja destruído antes
    return () => clearTimeout(temporizador);
  }, [navegacao]);

  return (
    <View style={estilos.container}>
      <View style={estilos.caixaLogo}>
        <Text style={estilos.textoLogo}>UB</Text>
      </View>
      <Text style={estilos.textoTitulo}>UNIBUILDS</Text>
    </View>
  );
}

// Estilização com a paleta de cores do League of Legends
const estilos = StyleSheet.create({
  container: {
    flex: 1, // Ocupa toda a tela
    backgroundColor: '#957134', // Tom dourado inspirado nos mockups
    justifyContent: 'center', // Centraliza na vertical
    alignItems: 'center', // Centraliza na horizontal
  },
  caixaLogo: {
    width: 120,
    height: 120,
    backgroundColor: cores.fundoPrincipal,
    borderRadius: 24, // Bordas arredondadas
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: cores.textoPrincipal,
    marginBottom: 20,
  },
  textoLogo: {
    fontSize: 60,
    fontFamily: 'serif',
    color: cores.primaria,
  },
  textoTitulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: cores.fundoPrincipal,
    letterSpacing: 4, // Afasta um pouco as letras para ficar estiloso
  },
});

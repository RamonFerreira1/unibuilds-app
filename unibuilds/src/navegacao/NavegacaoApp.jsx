import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TelaAbertura from '../telas/TelaAbertura';
import TelaLogin from '../telas/TelaLogin';
import TelaCadastro from '../telas/TelaCadastro';
import NavegacaoPrincipal from './NavegacaoPrincipal';
import TelaDetalheCampeao from '../telas/TelaDetalheCampeao';
import TelaListaBuilds from '../telas/TelaListaBuilds';

// Inicializa a navegação em pilha (Stack), que permite colocar telas uma em cima da outra
const Pilha = createNativeStackNavigator();

// Este é o componente que gerencia todo o roteamento principal do aplicativo
export default function NavegacaoApp() {
  return (
    <NavigationContainer>
      {/* Escondemos o cabeçalho padrão para desenharmos nossos próprios cabeçalhos com o tema do jogo */}
      <Pilha.Navigator screenOptions={{ headerShown: false }} initialRouteName="Abertura">
        <Pilha.Screen name="Abertura" component={TelaAbertura} />
        <Pilha.Screen name="Login" component={TelaLogin} />
        <Pilha.Screen name="Cadastro" component={TelaCadastro} />
        {/* A tela "Principal" não é uma tela comum, ela carrega o nosso menu de abas inferior (Tabs) */}
        <Pilha.Screen name="Principal" component={NavegacaoPrincipal} />
        <Pilha.Screen name="DetalheCampeao" component={TelaDetalheCampeao} />
        <Pilha.Screen name="ListaBuilds" component={TelaListaBuilds} />
      </Pilha.Navigator>
    </NavigationContainer>
  );
}

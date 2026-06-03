import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BackHandler, Alert } from 'react-native';

import TelaAbertura from '../telas/TelaAbertura';
import TelaLogin from '../telas/TelaLogin';
import TelaCadastro from '../telas/TelaCadastro';
import NavegacaoPrincipal from './NavegacaoPrincipal';
import TelaDetalheCampeao from '../telas/TelaDetalheCampeao';
import TelaListaBuilds from '../telas/TelaListaBuilds';

const Pilha = createNativeStackNavigator();

export default function NavegacaoApp() {
  const navigationRef = useRef(null);

  useEffect(() => {
    const onBackPress = () => {
      // Tenta voltar na pilha de navegação ou no histórico das abas
      if (navigationRef.current && navigationRef.current.canGoBack()) {
        navigationRef.current.goBack();
        return true; // Bloqueia o comportamento padrão (que é fechar o app)
      }
      
      // Se não puder voltar (ou seja, chegou na raiz do app), perguntar se quer sair
      Alert.alert(
        'Sair do UniBuilds',
        'Deseja realmente sair do aplicativo?',
        [
          { text: 'Cancelar', style: 'cancel', onPress: () => {} },
          { text: 'Sair', style: 'destructive', onPress: () => BackHandler.exitApp() },
        ]
      );
      
      return true; // Também bloqueia o fechamento abrupto
    };

    // Inscreve nosso listener para o botão de voltar do Android
    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

    // Limpa o listener se o componente for desmontado
    return () => backHandler.remove();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Pilha.Navigator screenOptions={{ headerShown: false }} initialRouteName="Abertura">
        <Pilha.Screen name="Abertura" component={TelaAbertura} />
        <Pilha.Screen name="Login" component={TelaLogin} />
        <Pilha.Screen name="Cadastro" component={TelaCadastro} />
        <Pilha.Screen name="Principal" component={NavegacaoPrincipal} />
        <Pilha.Screen name="DetalheCampeao" component={TelaDetalheCampeao} />
        <Pilha.Screen name="ListaBuilds" component={TelaListaBuilds} />
      </Pilha.Navigator>
    </NavigationContainer>
  );
}

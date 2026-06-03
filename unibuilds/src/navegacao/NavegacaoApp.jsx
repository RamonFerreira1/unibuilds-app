import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BackHandler, Alert, Platform } from 'react-native';

import TelaAbertura from '../telas/TelaAbertura';
import TelaLogin from '../telas/TelaLogin';
import TelaCadastro from '../telas/TelaCadastro';
import NavegacaoPrincipal from './NavegacaoPrincipal';
import TelaDetalheCampeao from '../telas/TelaDetalheCampeao';
import TelaListaBuilds from '../telas/TelaListaBuilds';

const Pilha = createNativeStackNavigator();

// Configuração de rotas web (PWA) para o histórico do navegador e botão voltar do celular funcionar na Vercel
const configuracaoDeLinks = {
  prefixes: ['https://unibuilds.vercel.app', 'unibuilds://'],
  config: {
    screens: {
      Abertura: '',
      Login: 'login',
      Cadastro: 'cadastro',
      Principal: {
        screens: {
          Painel: 'painel',
          Campeões: 'campeoes',
          Itens: 'itens',
          Runas: 'runas',
          Builds: 'builds',
        },
      },
      DetalheCampeao: 'campeao',
      ListaBuilds: 'favoritas',
    },
  },
};

export default function NavegacaoApp() {
  const navigationRef = useRef(null);

  useEffect(() => {
    // Interceptador para dispositivos móveis (Android)
    const onBackPress = () => {
      if (navigationRef.current && navigationRef.current.canGoBack()) {
        navigationRef.current.goBack();
        return true; 
      }
      
      Alert.alert(
        'Sair do UniBuilds',
        'Deseja realmente sair do aplicativo?',
        [
          { text: 'Cancelar', style: 'cancel', onPress: () => {} },
          { text: 'Sair', style: 'destructive', onPress: () => BackHandler.exitApp() },
        ]
      );
      
      return true; 
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

    // Interceptador para Web (PWA) ao tentar fechar a aba/aplicativo
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = ''; // Exibe o prompt padrão do navegador de confirmação de saída
    };

    if (Platform.OS === 'web') {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      backHandler.remove();
      if (Platform.OS === 'web') {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      }
    };
  }, []);

  return (
    <NavigationContainer ref={navigationRef} linking={configuracaoDeLinks}>
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

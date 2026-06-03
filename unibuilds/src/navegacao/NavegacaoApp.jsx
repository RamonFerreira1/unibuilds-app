import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BackHandler, Alert, Platform } from 'react-native';

import TelaAbertura from '../telas/TelaAbertura';
import TelaLogin from '../telas/TelaLogin';
import TelaCadastro from '../telas/TelaCadastro';
import NavegacaoPrincipal from './NavegacaoPrincipal';
import TelaDetalheCampeao from '../telas/TelaDetalheCampeao';
import TelaListaBuilds from '../telas/TelaListaBuilds';
import ModalConfirmacao from '../componentes/ModalConfirmacao';

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
  const [modalSairVisivel, setModalSairVisivel] = useState(false);
  const saindo = useRef(false);

  useEffect(() => {
    // Interceptador APENAS para dispositivos móveis nativos (Android/APK)
    const onBackPress = () => {
      if (navigationRef.current && navigationRef.current.canGoBack()) {
        navigationRef.current.goBack();
        return true; 
      }
      
      setModalSairVisivel(true);
      return true; 
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

    // Interceptador padrão de fechamento de aba (Web)
    const handleBeforeUnload = (e) => {
      if (saindo.current) return;
      e.preventDefault();
      e.returnValue = ''; 
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

  const confirmarSaida = () => {
    setModalSairVisivel(false);
    saindo.current = true;
    
    // Como essa função só será chamada no ambiente Nativo (já que no Web o modal nativo do navegador é que atua),
    // podemos usar exitApp direto.
    BackHandler.exitApp();
  };

  return (
    <>
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
      
      {Platform.OS !== 'web' && (
        <ModalConfirmacao
          visivel={modalSairVisivel}
          titulo="Sair do UniBuilds"
          mensagem="Deseja realmente sair do aplicativo?"
          textoConfirmar="SAIR"
          aoCancelar={() => setModalSairVisivel(false)}
          aoConfirmar={confirmarSaida}
        />
      )}
    </>
  );
}

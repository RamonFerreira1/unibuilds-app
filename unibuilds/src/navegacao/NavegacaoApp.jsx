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

// Executado apenas uma vez fora do componente para inicializar o histórico PWA
if (Platform.OS === 'web' && typeof window !== 'undefined') {
  if (!window.history.state || !window.history.state.isAppRoot) {
    // Substitui a raiz do histórico atual pela nossa armadilha (Index 0)
    window.history.replaceState({ isAppRoot: true }, '');
    // Empurra um estado vazio por cima (Index 1). O React Navigation vai usar ESSE estado vazio para iniciar.
    window.history.pushState({}, ''); 
  }
}

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
    // Interceptador para dispositivos móveis (Android Nativo)
    const onBackPress = () => {
      if (navigationRef.current && navigationRef.current.canGoBack()) {
        navigationRef.current.goBack();
        return true; 
      }
      
      setModalSairVisivel(true);
      return true; 
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

    // Interceptador para Web (PWA) 
    const handleBeforeUnload = (e) => {
      if (saindo.current) return;
      e.preventDefault();
      e.returnValue = ''; 
    };

    let handlePopState;
    if (Platform.OS === 'web') {
      window.addEventListener('beforeunload', handleBeforeUnload);

      handlePopState = (e) => {
        if (saindo.current) return;

        // Se o usuário apertou voltar e atingiu o INDEX 0 (nossa armadilha)
        if (e.state && e.state.isAppRoot) {
          // Mostramos o modal de saída
          setModalSairVisivel(true);
          // Empurramos um estado vazio imediatamente para frente (INDEX 1) novamente
          // Isso impede que o navegador feche o app e garante que possamos interceptar o próximo voltar
          window.history.pushState({}, '');
        }
      };

      window.addEventListener('popstate', handlePopState);
    }

    return () => {
      backHandler.remove();
      if (Platform.OS === 'web') {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        if (handlePopState) window.removeEventListener('popstate', handlePopState);
      }
    };
  }, []);

  const confirmarSaida = () => {
    setModalSairVisivel(false);
    saindo.current = true;
    
    if (Platform.OS === 'web') {
      // Força a saída real (volta para fora do app, consumindo o Index 0)
      window.history.back();
    } else {
      BackHandler.exitApp();
    }
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
      
      <ModalConfirmacao
        visivel={modalSairVisivel}
        titulo="Sair do UniBuilds"
        mensagem="Deseja realmente sair do aplicativo?"
        textoConfirmar="SAIR"
        aoCancelar={() => setModalSairVisivel(false)}
        aoConfirmar={confirmarSaida}
      />
    </>
  );
}

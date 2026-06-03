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
    // Interceptador para dispositivos móveis (Android)
    const onBackPress = () => {
      if (navigationRef.current && navigationRef.current.canGoBack()) {
        navigationRef.current.goBack();
        return true; 
      }
      
      // Exibe nosso modal React estilizado ao invés do Alert nativo padrão
      setModalSairVisivel(true);
      return true; 
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

    // Interceptador para Web (PWA) ao tentar fechar a aba/aplicativo
    const handleBeforeUnload = (e) => {
      if (saindo.current) return;
      e.preventDefault();
      e.returnValue = ''; 
    };

    let handlePopState;
    if (Platform.OS === 'web') {
      window.addEventListener('beforeunload', handleBeforeUnload);

      // Truque avançado para PWA: injeta um estado extra no histórico para interceptar o botão físico voltar
      window.history.pushState({ interceptadorSaida: true }, '');
      
      handlePopState = () => {
        if (saindo.current) return;
        // O evento foi disparado (usuário tentou voltar).
        // Se a navegação interna do React Navigation disser que não há para onde voltar, é a raiz.
        if (navigationRef.current && !navigationRef.current.canGoBack()) {
          // Bloqueia a saída empurrando a armadilha de volta no histórico
          window.history.pushState({ interceptadorSaida: true }, '');
          setModalSairVisivel(true);
        }
      };
      
      window.addEventListener('popstate', handlePopState);
    }

    return () => {
      backHandler.remove();
      if (Platform.OS === 'web') {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        if(handlePopState) window.removeEventListener('popstate', handlePopState);
      }
    };
  }, []);

  const confirmarSaida = () => {
    setModalSairVisivel(false);
    saindo.current = true;
    
    if (Platform.OS === 'web') {
      // Força a saída do PWA voltando no histórico e ignorando interceptadores
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

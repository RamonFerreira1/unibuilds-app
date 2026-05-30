import React from 'react';
import { StatusBar } from 'expo-status-bar';

// Aqui nós importamos o nosso arquivo central de Navegação.
// Esse arquivo que diz qual tela vem primeiro e quais são as rotas do aplicativo.
import NavegacaoApp from './src/navegacao/NavegacaoApp';

// Este é o Ponto de Entrada (Entry Point) do seu aplicativo! 
// Quando o celular roda o app, é o código daqui de dentro que ele lê primeiro.
export default function App() {
  return (
    <>
      {/* O StatusBar controla a cor dos ícones de bateria/horário do celular lá em cima.
          Colocamos "light" para os ícones ficarem brancos, já que nosso app tem fundo escuro. */}
      <StatusBar style="light" />
      
      {/* Aqui a gente simplesmente entrega o controle para o nosso roteador */}
      <NavegacaoApp />
    </>
  );
}

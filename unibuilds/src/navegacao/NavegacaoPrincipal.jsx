import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { cores } from '../tema/cores';

// Importamos todas as nossas telas convertidas para JS
import TelaPainel from '../telas/TelaPainel';
import TelaListaCampeoes from '../telas/TelaListaCampeoes';
import TelaListaItens from '../telas/TelaListaItens';
import TelaListaRunas from '../telas/TelaListaRunas';
import TelaCriadorBuild from '../telas/TelaCriadorBuild';

// Inicializamos a barra de navegação inferior (Bottom Tabs)
const Aba = createBottomTabNavigator();

// Componente que envelopa todas as abas do aplicativo
export default function NavegacaoPrincipal() {
  return (
    <Aba.Navigator
      screenOptions={{
        headerShown: false, // Esconde o cabeçalho padrão das abas, pois criamos os nossos próprios
        tabBarStyle: {
          backgroundColor: cores.fundoPrincipal, // Cor da barra de navegação
          borderTopColor: cores.primaria, // Linha dourada separando
          paddingBottom: 5,
          height: 60,
        },
        tabBarActiveTintColor: cores.destaque, // Cor do ícone quando a aba está selecionada
        tabBarInactiveTintColor: cores.textoSecundario, // Cor do ícone inativo
      }}
    >
      <Aba.Screen 
        name="Painel" 
        component={TelaPainel} 
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />
        }}
      />
      <Aba.Screen 
        name="Campeões" 
        component={TelaListaCampeoes} 
        options={{
          tabBarIcon: ({ color }) => <FontAwesome5 name="khanda" size={20} color={color} />
        }}
      />
      <Aba.Screen 
        name="Itens" 
        component={TelaListaItens} 
        options={{
          tabBarIcon: ({ color }) => <FontAwesome5 name="briefcase" size={20} color={color} />
        }}
      />
      <Aba.Screen 
        name="Runas" 
        component={TelaListaRunas} 
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="sparkles" size={24} color={color} />
        }}
      />
      <Aba.Screen 
        name="Builds" 
        component={TelaCriadorBuild} 
        options={{
          tabBarIcon: ({ color }) => <FontAwesome5 name="scroll" size={20} color={color} />
        }}
      />
    </Aba.Navigator>
  );
}

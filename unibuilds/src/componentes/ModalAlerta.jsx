import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { cores } from '../tema/cores';

// Componente de Modal reutilizável para substituir o 'alert()' padrão do navegador/celular.
export default function ModalAlerta({ visivel, mensagem, titulo = "Aviso", aoFechar, tipo = "aviso" }) {
  // 'tipo' pode ser "aviso" (usa cor dourada) ou "sucesso" (usa cor ciano)
  const corDestaque = tipo === "sucesso" ? cores.destaque : cores.primaria;

  return (
    <Modal
      transparent={true} // Permite ver a tela de fundo borrada/escurecida
      animationType="fade" // Animação suave de surgimento
      visible={visivel}
      onRequestClose={aoFechar}
    >
      <View style={estilos.fundoEscuro}>
        <View style={[estilos.caixaModal, { borderColor: corDestaque }]}>
          <Text style={[estilos.titulo, { color: corDestaque }]}>{titulo}</Text>
          <Text style={estilos.mensagem}>{mensagem}</Text>
          <TouchableOpacity 
            style={[estilos.botao, { backgroundColor: corDestaque }]} 
            onPress={aoFechar}
          >
            <Text style={estilos.textoBotao}>ENTENDIDO</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  fundoEscuro: {
    flex: 1,
    backgroundColor: 'rgba(6, 16, 30, 0.85)', // Oceano escuro com opacidade
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  caixaModal: {
    backgroundColor: cores.fundoSecundario,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 350,
    borderWidth: 2,
    alignItems: 'center',
    // Sombras para dar efeito 3D
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'serif',
    marginBottom: 15,
    letterSpacing: 1,
    textAlign: 'center',
  },
  mensagem: {
    fontSize: 16,
    color: cores.textoClaro,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24,
  },
  botao: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  textoBotao: {
    color: cores.fundoPrincipal,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  }
});

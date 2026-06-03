import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { cores } from '../tema/cores';

export default function ModalConfirmacao({ visivel, titulo = "Confirmação", mensagem, aoConfirmar, aoCancelar, carregando = false, textoConfirmar = "CONFIRMAR" }) {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visivel}
      onRequestClose={aoCancelar}
    >
      <View style={estilos.fundoEscuro}>
        <View style={estilos.caixaModal}>
          <Text style={estilos.titulo}>{titulo}</Text>
          <Text style={estilos.mensagem}>{mensagem}</Text>
          
          <View style={estilos.containerBotoes}>
            <TouchableOpacity style={estilos.botaoCancelar} onPress={aoCancelar}>
              <Text style={estilos.textoCancelar}>CANCELAR</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[estilos.botaoConfirmar, carregando && { opacity: 0.7 }]} onPress={aoConfirmar} disabled={carregando}>
              {carregando ? (
                <ActivityIndicator color={cores.textoClaro} />
              ) : (
                <Text style={estilos.textoConfirmar}>{textoConfirmar}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  fundoEscuro: {
    flex: 1,
    backgroundColor: 'rgba(6, 16, 30, 0.85)',
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
    borderColor: '#e74c3c', // Borda vermelha indicando ação destrutiva
    alignItems: 'center',
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
    color: '#e74c3c',
    textAlign: 'center',
  },
  mensagem: {
    fontSize: 16,
    color: cores.textoClaro,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24,
  },
  containerBotoes: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 12,
  },
  botaoCancelar: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: cores.primaria,
    alignItems: 'center',
  },
  textoCancelar: {
    color: cores.primaria,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  botaoConfirmar: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    alignItems: 'center',
  },
  textoConfirmar: {
    color: cores.textoClaro,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  }
});

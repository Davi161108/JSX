import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

// FIX: itens ainda não implementados ficam desabilitados com tag "Em breve"
const menuItems = [
  { label: 'Painel', pronto: true },
  { label: 'Contas', pronto: true },
  { label: 'Metas', pronto: false },
  { label: 'Cartões', pronto: false },
  { label: 'Configurações', pronto: false },
];

export default function Sidebar({ isOpen, onClose, activeMenu, setActiveMenu }) {
  if (!isOpen) return null;

  return (
    <View style={styles.sidebarContainer}>
      <View style={styles.sidebar}>
        <View style={styles.sidebarHeader}>
          <Text style={styles.sidebarLogo}>Koplo</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeMenuBtn}>
            <Text style={styles.closeMenuText}>✕</Text>
          </TouchableOpacity>
        </View>

        {menuItems.map((item) => {
          const ativo = activeMenu === item.label;
          const desabilitado = !item.pronto;

          return (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.menuItem,
                ativo && styles.menuItemActive,
                desabilitado && styles.menuItemDisabled,
              ]}
              disabled={desabilitado}
              onPress={() => {
                setActiveMenu(item.label);
                onClose();
              }}
            >
              <Text
                style={[
                  styles.menuItemText,
                  ativo && styles.menuItemTextActive,
                  desabilitado && styles.menuItemTextDisabled,
                ]}
              >
                {item.label}
              </Text>
              {desabilitado && <Text style={styles.emBreveTag}>Em breve</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
      <TouchableOpacity style={styles.sidebarOverlay} onPress={onClose} />
    </View>
  );
}

const styles = StyleSheet.create({
  sidebarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    zIndex: 9999,
  },
  sidebar: {
    width: '70%',
    backgroundColor: '#0B1C24',
    height: '100%',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  sidebarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  sidebarLogo: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold' },
  closeMenuBtn: { padding: 6 },
  closeMenuText: { color: '#90A4AE', fontSize: 18 },
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemActive: { backgroundColor: '#00796B' },
  menuItemDisabled: { opacity: 0.45 },
  menuItemText: { color: '#90A4AE', fontSize: 16, fontWeight: '500' },
  menuItemTextActive: { color: '#FFFFFF', fontWeight: '700' },
  menuItemTextDisabled: { color: '#546E7A' },
  emBreveTag: {
    fontSize: 10,
    color: '#78909C',
    backgroundColor: '#1C3D4E',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    overflow: 'hidden',
  },
});

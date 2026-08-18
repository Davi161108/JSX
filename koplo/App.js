import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Sidebar from './components/Sidebar';
import SectionPainel from './components/SectionPainel';
import SectionContas from './components/SectionContas';
import SectionAutenticacao from './components/SectionAutenticacao';

const META_MENSAL_FIXA = 2000;

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Outros');
  const [editingId, setEditingId] = useState(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Painel');
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  useEffect(() => {
    checarSessaoExistente();
  }, []);

  // Chave de banco isolada por usuário logado
  const getChaveUsuario = (email) => {
    return `@koplo_modular_data_${email.toLowerCase()}`;
  };

  const checarSessaoExistente = async () => {
    try {
      const sessao = await AsyncStorage.getItem('@koplo_user_session');
      if (sessao !== null) {
        const usuario = JSON.parse(sessao);
        setUsuarioLogado(usuario);
        loadData(usuario.email);
      }
    } catch (e) {
      console.log("Erro ao checar sessão ativa");
    }
  };

  // FIX: salva na sessão apenas name/email — a senha nunca vai para a sessão
  const handleLoginSucesso = async (usuario) => {
    const dadosSeguros = { name: usuario.name, email: usuario.email };
    setUsuarioLogado(dadosSeguros);
    loadData(dadosSeguros.email);
    try {
      await AsyncStorage.setItem('@koplo_user_session', JSON.stringify(dadosSeguros));
    } catch (e) {
      console.log("Erro ao salvar sessão de login");
    }
  };

  const handleLogout = async () => {
    setUsuarioLogado(null);
    setTransactions([]);
    setIsMenuOpen(false);
    try {
      await AsyncStorage.removeItem('@koplo_user_session');
    } catch (e) {
      console.log("Erro ao limpar sessão");
    }
  };

  const loadData = async (userEmail) => {
    if (!userEmail) return;
    try {
      const chaveDinamica = getChaveUsuario(userEmail);
      const savedData = await AsyncStorage.getItem(chaveDinamica);
      if (savedData !== null) {
        setTransactions(JSON.parse(savedData));
      } else {
        setTransactions([]);
      }
    } catch (e) {
      console.log("Erro ao carregar dados do AsyncStorage");
    }
  };

  // FIX: normaliza vírgula -> ponto antes do parseFloat (ex.: 35,70 vira 35.70)
  const handleSave = async () => {
    if (!description.trim() || !amount.trim() || !usuarioLogado) return;

    const valorNumerico = parseFloat(amount.replace(',', '.'));
    if (isNaN(valorNumerico)) return;

    let updated = [];
    if (editingId) {
      updated = transactions.map(item =>
        item.id === editingId ? { ...item, description, amount: valorNumerico, category } : item
      );
      setEditingId(null);
    } else {
      updated = [...transactions, {
        id: String(Date.now()),
        description,
        amount: valorNumerico,
        category,
        date: new Date().toISOString()
      }];
    }

    setTransactions(updated);
    setDescription('');
    setAmount('');
    setCategory('Outros');

    try {
      const chaveDinamica = getChaveUsuario(usuarioLogado.email);
      await AsyncStorage.setItem(chaveDinamica, JSON.stringify(updated));
    } catch (e) {
      console.log("Erro ao salvar dados");
    }
  };

  const handleStartEdit = (item) => {
    setEditingId(item.id);
    setDescription(item.description);
    setAmount(String(item.amount));
    setCategory(item.category || 'Outros');
  };

  const handleDelete = async (id) => {
    if (!usuarioLogado) return;
    const filtered = transactions.filter(item => item.id !== id);
    setTransactions(filtered);
    try {
      const chaveDinamica = getChaveUsuario(usuarioLogado.email);
      await AsyncStorage.setItem(chaveDinamica, JSON.stringify(filtered));
    } catch (e) {
      console.log("Erro ao deletar dados");
    }
  };

  const totalBalance = transactions.reduce((acc, item) => acc + parseFloat(item.amount), 0);

  const porcentagemMeta = totalBalance > 0
    ? Math.min(Math.round((totalBalance / META_MENSAL_FIXA) * 100), 100)
    : 0;

  const getIniciaisNome = () => {
    if (!usuarioLogado || !usuarioLogado.name) return 'SL';
    const partes = usuarioLogado.name.trim().split(' ');
    if (partes.length > 1) return (partes[0][0] + partes[1][0]).toUpperCase();
    return partes[0][0].toUpperCase();
  };

  const renderActiveSection = () => {
    switch (activeMenu) {
      case 'Painel':
        return <SectionPainel totalBalance={totalBalance} transactions={transactions} metaMensal={META_MENSAL_FIXA} />;
      case 'Contas':
        return (
          <SectionContas
            description={description}
            setDescription={setDescription}
            amount={amount}
            setAmount={setAmount}
            category={category}          // FIX: agora passa a categoria
            setCategory={setCategory}    // FIX: agora passa o setter
            editingId={editingId}
            onSave={handleSave}
            transactions={transactions}
            onEdit={handleStartEdit}
            onDelete={handleDelete}
          />
        );
      default:
        return (
          <View style={styles.fallbackSection}>
            <Text style={styles.fallbackText}>Seção de {activeMenu} em desenvolvimento.</Text>
          </View>
        );
    }
  };

  if (!usuarioLogado) {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="#0B1C24" translucent={false} />
        <SectionAutenticacao onLoginSucesso={handleLoginSucesso} />
      </>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />

      <Sidebar
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

      <View style={styles.topBar}>
        <TouchableOpacity style={styles.logoKContainer} onPress={() => setIsMenuOpen(true)}>
          <Text style={styles.logoKText}>K</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>{activeMenu}</Text>

        <TouchableOpacity style={styles.userBadge} onPress={handleLogout}>
          <Text style={styles.userBadgeText}>{getIniciaisNome()}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Saldo Total</Text>
          <Text style={styles.summaryValue}>R$ {totalBalance.toFixed(2)}</Text>
        </View>
        <View style={[styles.summaryCard, styles.summaryCardGreen]}>
          <Text style={styles.summaryLabelGreen}>Porcentagem não Usada</Text>
          <Text style={styles.summaryValueGreen}>{porcentagemMeta}%</Text>
        </View>
      </View>

      <View style={styles.contentBody}>
        {renderActiveSection()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1C24' },
  topBar: {
    backgroundColor: '#0B1C24', paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : StatusBar.currentHeight + 20,
    paddingBottom: 45, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  logoKContainer: {
    backgroundColor: '#00796B', width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
  },
  logoKText: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  topBarTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  userBadge: {
    backgroundColor: '#E74C3C', width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center',
  },
  userBadgeText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  summaryGrid: { flexDirection: 'row', marginHorizontal: 20, marginTop: -30, gap: 12, zIndex: 10 },
  summaryCard: {
    flex: 1, backgroundColor: '#112A36', padding: 16, borderRadius: 16,
    elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 6,
  },
  summaryCardGreen: { backgroundColor: '#00796B' },
  summaryLabel: { color: '#90A4AE', fontSize: 12, fontWeight: '600' },
  summaryValue: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginTop: 4 },
  summaryLabelGreen: { color: '#B2DFDB', fontSize: 12, fontWeight: '600' },
  summaryValueGreen: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginTop: 4 },
  contentBody: { flex: 1, backgroundColor: '#F4F6F8' },
  fallbackSection: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4F6F8' },
  fallbackText: { color: '#78909C', fontSize: 15 }
});

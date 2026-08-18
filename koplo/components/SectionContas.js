import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import TransactionCard from './TransactionCard';

const CATEGORIAS = ['Salário', 'Alimentação', 'Transporte', 'Moradia', 'Lazer', 'Saúde', 'Outros'];

export default function SectionContas({
  description,
  setDescription,
  amount,
  setAmount,
  category,
  setCategory,
  editingId,
  onSave,
  transactions,
  onEdit,
  onDelete
}) {

  // Converte a string ISO gerada pelo App.js em "DD/MM/AAAA às HH:MM"
  const formatarDataHora = (isoString) => {
    if (!isoString) return 'Data indisponível';
    const dataObj = new Date(isoString);
    const dataFormatada = dataObj.toLocaleDateString('pt-BR');
    const horas = String(dataObj.getHours()).padStart(2, '0');
    const minutos = String(dataObj.getMinutes()).padStart(2, '0');
    return `${dataFormatada} às ${horas}:${minutos}`;
  };

  return (
    <View style={styles.contasContainer}>

      {/* FORMULÁRIO EXCLUSIVO DA SEÇÃO CONTAS */}
      <View style={styles.form}>
        <Text style={styles.formTitle}>{editingId ? 'Editar Registro' : 'Nova Transação'}</Text>

        <TextInput
          style={styles.input}
          placeholder="Descrição da Transação"
          placeholderTextColor="#90A4AE"
          value={description}
          onChangeText={setDescription}
        />

        <TextInput
          style={styles.input}
          placeholder="Valor (Ex: 1500 ou -35,70)"
          placeholderTextColor="#90A4AE"
          keyboardType="decimal-pad" // FIX: aceita vírgula no teclado
          value={amount}
          onChangeText={setAmount}
        />

        {/* FIX: seletor de categoria em chips */}
        <Text style={styles.categoriaLabel}>Categoria</Text>
        <View style={styles.chipsRow}>
          {CATEGORIAS.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, category === cat && styles.chipActive]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={onSave}>
          <Text style={styles.submitBtnText}>
            {editingId ? "Atualizar Dados" : "Adicionar Transação"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* LISTAGEM DO HISTÓRICO */}
      <Text style={styles.sectionTitle}>Últimas Transações</Text>
      <FlatList
        data={[...transactions].reverse()}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const itemComDataContas = {
            ...item,
            date: formatarDataHora(item.date)
          };
          return (
            <TransactionCard
              item={itemComDataContas}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum registro encontrado localmente.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contasContainer: { flex: 1, paddingHorizontal: 20, marginTop: 20 },
  form: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ECEFF1',
    marginBottom: 20,
  },
  formTitle: { fontSize: 15, fontWeight: '700', color: '#0B1C24', marginBottom: 12 },
  input: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#CFD8DC',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    fontSize: 14,
    color: '#263238',
  },
  categoriaLabel: { fontSize: 12, color: '#78909C', fontWeight: '600', marginBottom: 8 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F4F6F8',
    borderWidth: 1,
    borderColor: '#CFD8DC',
  },
  chipActive: { backgroundColor: '#00796B', borderColor: '#00796B' },
  chipText: { fontSize: 12, color: '#546E7A', fontWeight: '600' },
  chipTextActive: { color: '#FFFFFF' },
  submitBtn: { backgroundColor: '#0B1C24', padding: 14, borderRadius: 10, alignItems: 'center' },
  submitBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#263238', marginBottom: 12 },
  emptyText: { textAlign: 'center', color: '#78909C', marginTop: 20 },
  listContent: { paddingBottom: 24 },
});

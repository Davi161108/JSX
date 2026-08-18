import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function TransactionCard({ item, onEdit, onDelete }) {
  // SEGURANÇA: Se o item não existir por erro de renderização, evita quebrar o app
  if (!item) return null;

  // SEGURANÇA: Garante que o valor seja interpretado como número
  const safeAmount = item.amount ? parseFloat(item.amount) : 0;

  // Verifica se a transação é uma receita (positivo) ou despesa (negativo)
  const isIncome = safeAmount >= 0;

  return (
    <View style={styles.card}>
      <View style={styles.leftContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.description}>{item.description || 'Sem descrição'}</Text>
          {/* FIX: mostra a data real formatada pelo SectionContas */}
          <Text style={styles.date}>{item.date || 'Data indisponível'}</Text>
        </View>
      </View>

      <View style={styles.rightContainer}>
        <Text style={[styles.amount, { color: isIncome ? '#2E7D32' : '#C62828' }]}>
          {isIncome ? '+ ' : '- '}R$ {Math.abs(safeAmount).toFixed(2)}
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity onPress={() => onEdit && onEdit(item)}>
            <Text style={styles.editText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onDelete && onDelete(item.id)}>
            <Text style={styles.deleteText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ECEFF1',
  },
  leftContainer: { flexDirection: 'row', alignItems: 'center' },
  textContainer: { justifyContent: 'center' },
  description: { fontSize: 15, fontWeight: '600', color: '#263238' },
  date: { fontSize: 12, color: '#90A4AE', marginTop: 2 },
  rightContainer: { alignItems: 'flex-end' },
  amount: { fontSize: 15, fontWeight: '700' },
  actions: { flexDirection: 'row', marginTop: 4, gap: 10 },
  editText: { color: '#00796B', fontSize: 12, fontWeight: '500' },
  deleteText: { color: '#D32F2F', fontSize: 12, fontWeight: '500' },
});

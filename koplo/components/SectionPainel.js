import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

export default function SectionPainel({ totalBalance = 0, transactions = [], metaMensal = 2000 }) {

  // 1. ESTADO DA COTAÇÃO DO DÓLAR
  const [dolarPrice, setDolarPrice] = useState(null);
  const [arrow, setArrow] = useState('▲');
  const [arrowColor, setArrowColor] = useState('#2E7D32');

  useEffect(() => {
    fetch('https://economia.awesomeapi.com.br/last/USD-BRL')
      .then((response) => response.json())
      .then((data) => {
        if (data.USDBRL) {
          setDolarPrice(parseFloat(data.USDBRL.bid).toFixed(2));
          const variacao = parseFloat(data.USDBRL.pctChange);
          if (variacao >= 0) {
            setArrow('▲');
            setArrowColor('#2E7D32');
          } else {
            setArrow('▼');
            setArrowColor('#C62828');
          }
        }
      })
      .catch(() => console.log('Erro ao buscar cotação'));
  }, []);

  // 2. CÁLCULOS FINANCEIROS GERAIS
  const totalEntradas = transactions
    .filter((item) => parseFloat(item.amount) > 0)
    .reduce((acc, item) => acc + parseFloat(item.amount), 0);

  const totalSaidas = transactions
    .filter((item) => parseFloat(item.amount) < 0)
    .reduce((acc, item) => acc + Math.abs(parseFloat(item.amount)), 0);

  // 3. LÓGICA DO GRÁFICO DINÂMICO DE MESES (FIX: compara mês E ano)
  const agora = new Date();
  const mesAtualNum = agora.getMonth(); // 0 = Jan, 1 = Fev, etc.
  const anoAtual = agora.getFullYear();
  const nomesMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  // Cada slot carrega mês E ano corretos (inclusive virada de ano)
  const ultimosMeses = [0, 1, 2, 3].map((offset) => {
    const d = new Date(anoAtual, mesAtualNum - 3 + offset, 1);
    return { mes: d.getMonth(), ano: d.getFullYear() };
  });

  // Função para calcular os gastos de um mês/ano específico
  const getGastosDoMes = (mesIndex, ano) => {
    return transactions
      .filter((item) => {
        const dataItem = item.date ? new Date(item.date) : null;
        if (!dataItem || isNaN(dataItem.getTime())) return false;
        return (
          dataItem.getMonth() === mesIndex &&
          dataItem.getFullYear() === ano &&
          parseFloat(item.amount) < 0
        );
      })
      .reduce((acc, item) => acc + Math.abs(parseFloat(item.amount)), 0);
  };

  // 4. AGRUPAMENTO DE GASTOS POR CATEGORIA
  const categoriasTotais = transactions
    .filter(item => parseFloat(item.amount) < 0)
    .reduce((acc, item) => {
      const cat = item.category || 'Geral';
      const valor = Math.abs(parseFloat(item.amount));
      acc[cat] = (acc[cat] || 0) + valor;
      return acc;
    }, {});

  const listaCategorias = Object.keys(categoriasTotais).map(cat => ({
    nome: cat,
    valor: categoriasTotais[cat],
    porcentagem: totalSaidas > 0 ? Math.round((categoriasTotais[cat] / totalSaidas) * 100) : 0
  }));

  return (
    <ScrollView style={styles.painelContainer} showsVerticalScrollIndicator={false}>

      {/* CARD DÓLAR */}
      <View style={styles.marketCard}>
        <View style={styles.marketHeaderRow}>
          <Text style={styles.marketLabel}>Dólar Comercial</Text>
          <View style={[styles.badgeVariacao, { backgroundColor: arrowColor + '15' }]}>
            <Text style={[styles.arrowText, { color: arrowColor }]}>{arrow} Live</Text>
          </View>
        </View>
        <Text style={styles.marketValue}>
          {dolarPrice ? `USD $1.00 = R$ ${dolarPrice}` : 'Carregando cotação...'}
        </Text>
      </View>

      {/* CARD ENTRADAS E SAÍDAS */}
      <View style={styles.insightGrid}>
        <View style={styles.insightCard}>
          <Text style={styles.insightLabel}>Total Entradas</Text>
          <Text style={[styles.insightValue, { color: '#2E7D32' }]}>+ R$ {totalEntradas.toFixed(2)}</Text>
        </View>
        <View style={styles.insightCard}>
          <Text style={styles.insightLabel}>Total Saídas</Text>
          <Text style={[styles.insightValue, { color: '#C62828' }]}>- R$ {totalSaidas.toFixed(2)}</Text>
        </View>
      </View>

      {/* CARD GRÁFICO HISTÓRICO DE BARRAS */}
      <Text style={styles.sectionTitle}>Histórico de Gastos</Text>
      <View style={styles.graphCard}>
        <Text style={styles.graphSubtitle}>Comparativo Mensal (Limite ref: R$ {metaMensal})</Text>

        <View style={styles.barChartContainer}>
          {ultimosMeses.map((slot, index) => {
            const gastosMes = getGastosDoMes(slot.mes, slot.ano);
            const alturaBarra = Math.min((gastosMes / metaMensal) * 120, 120);
            const isMesAtual = index === 3;

            return (
              <View key={`${slot.mes}-${slot.ano}`} style={styles.barColumn}>
                <Text style={styles.barValue}>R$ {gastosMes.toFixed(0)}</Text>
                <View
                  style={[
                    styles.bar,
                    {
                      // FIX: mês sem gastos não exibe barra falsa
                      height: gastosMes > 0 ? Math.max(alturaBarra, 4) : 2,
                      backgroundColor: isMesAtual ? '#00796B' : '#112A36',
                    },
                  ]}
                />
                <Text style={[styles.barLabel, isMesAtual && { fontWeight: 'bold', color: '#00796B' }]}>
                  {isMesAtual ? 'Atual' : nomesMeses[slot.mes]}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* CARD GRÁFICO DE BARRAS POR CATEGORIA */}
      <Text style={styles.sectionTitle}>Gastos por Categoria</Text>
      <View style={styles.investCard}>
        {listaCategorias.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma despesa registrada para análise.</Text>
        ) : (
          listaCategorias.map((cat) => (
            <View key={cat.nome} style={{ marginBottom: 12 }}>
              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>{cat.nome}</Text>
                <Text style={styles.progressValue}>R$ {cat.valor.toFixed(2)} ({cat.porcentagem}%)</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${cat.porcentagem}%` }]} />
              </View>
            </View>
          ))
        )}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  painelContainer: { flex: 1, paddingHorizontal: 20, marginTop: 20 },
  marketCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#ECEFF1', marginBottom: 16 },
  marketHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  marketLabel: { color: '#78909C', fontSize: 11, fontWeight: '600', textTransform: 'uppercase' },
  badgeVariacao: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  arrowText: { fontSize: 12, fontWeight: '700' },
  marketValue: { fontSize: 22, fontWeight: 'bold', color: '#0B1C24', marginTop: 6 },
  insightGrid: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  insightCard: { flex: 1, backgroundColor: '#FFFFFF', padding: 14, borderRadius: 16, borderWidth: 1, borderColor: '#ECEFF1' },
  insightLabel: { fontSize: 11, color: '#78909C', fontWeight: '600' },
  insightValue: { fontSize: 14, fontWeight: '700', marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#263238', marginBottom: 12 },
  graphCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#ECEFF1', marginBottom: 20 },
  graphSubtitle: { fontSize: 12, color: '#78909C', marginBottom: 16 },
  barChartContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 160 },
  barColumn: { alignItems: 'center', justifyContent: 'flex-end' },
  bar: { width: 28, borderRadius: 6 },
  barValue: { fontSize: 10, color: '#78909C', marginBottom: 4 },
  barLabel: { fontSize: 11, color: '#78909C', marginTop: 6 },
  investCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#ECEFF1', marginBottom: 30 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { fontSize: 13, color: '#546E7A', fontWeight: '600' },
  progressValue: { fontSize: 13, fontWeight: '600', color: '#00796B' },
  progressBarBg: { height: 8, backgroundColor: '#ECEFF1', borderRadius: 4 },
  progressBarFill: { height: '100%', backgroundColor: '#00796B', borderRadius: 4 },
  emptyText: { color: '#90A4AE', fontSize: 13 }
});

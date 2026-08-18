import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = '@koplo_users_database';

export default function SectionAutenticacao({ onLoginSucesso }) {
  const [isLoginScreen, setIsLoginScreen] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [perfisSalvos, setPerfisSalvos] = useState([]);

  useEffect(() => {
    carregarPerfis();
  }, []);

  const carregarPerfis = async () => {
    try {
      const dados = await AsyncStorage.getItem(USERS_KEY);
      if (dados !== null) {
        setPerfisSalvos(JSON.parse(dados));
      }
    } catch (e) {
      console.log("Erro ao carregar perfis");
    }
  };

  const isEmailValido = (emailDigitado) => {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(emailDigitado);
  };

  const handleCadastro = async () => {
    if (!email.trim() || !password.trim() || !name.trim()) {
      Alert.alert('Campos Incompletos', 'Por favor, preencha o nome, e-mail e a senha para criar sua conta.');
      return;
    }

    if (!isEmailValido(email.trim())) {
      Alert.alert('E-mail Inválido', 'O formato do e-mail digitado não é válido. Certifique-se de usar algo como: seuemail@dominio.com');
      return;
    }

    if (password.length < 4) {
      Alert.alert('Senha Muito Curta', 'Por segurança, sua senha secreta deve conter pelo menos 4 caracteres.');
      return;
    }

    try {
      const dadosExistentes = await AsyncStorage.getItem(USERS_KEY);
      const listaUsuarios = dadosExistentes ? JSON.parse(dadosExistentes) : [];

      const usuarioJaExiste = listaUsuarios.some(user => user.email.toLowerCase() === email.toLowerCase());
      if (usuarioJaExiste) {
        Alert.alert('E-mail já Cadastrado', 'Este endereço de e-mail já pertence a uma conta grátis ativa no Koplo.');
        return;
      }

      const novoUsuario = { name: name.trim(), email: email.trim().toLowerCase(), password };
      listaUsuarios.push(novoUsuario);

      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(listaUsuarios));

      Alert.alert('Conta Criada!', 'Parabéns! Sua conta grátis foi gerada com sucesso. Insira sua senha para acessar.');

      setPerfisSalvos(listaUsuarios);
      setIsLoginScreen(true);
      setPassword('');
    } catch (e) {
      Alert.alert('Erro no Sistema', 'Não foi possível salvar seu cadastro localmente. Tente novamente.');
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Campos Vazios', 'Insira seu e-mail de acesso e sua senha secreta para entrar.');
      return;
    }

    if (!isEmailValido(email.trim())) {
      Alert.alert('Formato Incorreto', 'O e-mail informado não possui um formato estrutural válido.');
      return;
    }

    try {
      const dadosExistentes = await AsyncStorage.getItem(USERS_KEY);
      const listaUsuarios = dadosExistentes ? JSON.parse(dadosExistentes) : [];

      const usuarioEncontrado = listaUsuarios.find(user => user.email.toLowerCase() === email.trim().toLowerCase());

      if (!usuarioEncontrado) {
        Alert.alert(
          'Perfil Não Encontrado',
          'Não encontramos nenhuma conta com este e-mail. Toque em "Cadastre-se grátis" caso ainda não tenha uma conta.'
        );
        return;
      }

      if (usuarioEncontrado.password !== password) {
        Alert.alert(
          'Senha Incorreta',
          'A senha secreta informada está errada para este perfil. Verifique letras maiúsculas ou digite novamente.'
        );
        return;
      }

      onLoginSucesso(usuarioEncontrado);
    } catch (e) {
      Alert.alert('Erro de Acesso', 'Falha crítica ao ler as credenciais de segurança.');
    }
  };

  const handleSelecionarPerfil = (perfil) => {
    setEmail(perfil.email);
    setPassword('');
    Alert.alert('Confirmar Identidade', `Por favor, digite a senha secreta do perfil de ${perfil.name}.`);
  };

  const getIniciais = (nomeCompleto) => {
    if (!nomeCompleto) return 'U';
    const partes = nomeCompleto.trim().split(' ');
    if (partes.length > 1) return (partes[0][0] + partes[1][0]).toUpperCase();
    return partes[0][0].toUpperCase();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.centerContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardAuth}>
          <Text style={styles.title}>
            {isLoginScreen ? 'Acessar Conta' : 'Criar Conta Grátis'}
          </Text>

          {!isLoginScreen && (
            <TextInput
              style={styles.input}
              placeholder="Seu Nome Completo"
              placeholderTextColor="#90A4AE"
              value={name}
              onChangeText={setName}
              maxLength={60}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Seu melhor e-mail"
            placeholderTextColor="#90A4AE"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            maxLength={120}
          />

          <TextInput
            style={styles.input}
            placeholder="Sua senha secreta"
            placeholderTextColor="#90A4AE"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
            maxLength={30}
          />

          <TouchableOpacity style={styles.primaryBtn} onPress={isLoginScreen ? handleLogin : handleCadastro}>
            <Text style={styles.primaryBtnText}>
              {isLoginScreen ? 'Entrar no Koplo' : 'Concluir Cadastro'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.switchBtn} onPress={() => {
            setIsLoginScreen(!isLoginScreen);
            setEmail('');
            setPassword('');
            setName('');
          }}>
            <Text style={styles.switchBtnText}>
              {isLoginScreen ? 'Não tem conta? Cadastre-se grátis' : 'Já possui uma conta? Acesse aqui'}
            </Text>
          </TouchableOpacity>
        </View>

        {isLoginScreen && perfisSalvos.length > 0 && (
          <Text style={styles.divisorText}>Ou acesse por um perfil salvo:</Text>
        )}

        {isLoginScreen && perfisSalvos.map((perfil) => (
          <TouchableOpacity key={perfil.email} style={styles.perfilCard} onPress={() => handleSelecionarPerfil(perfil)}>
            <View style={styles.perfilAvatar}>
              <Text style={styles.perfilAvatarText}>{getIniciais(perfil.name)}</Text>
            </View>
            <View style={styles.perfilInfo}>
              <Text style={styles.perfilName}>{perfil.name}</Text>
              <Text style={styles.perfilEmail}>{perfil.email}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1C24' },
  centerContent: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 40 },
  cardAuth: { backgroundColor: '#FFFFFF', width: '100%', padding: 24, borderRadius: 16, marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#0B1C24', textAlign: 'center', marginBottom: 20 },
  input: { backgroundColor: '#F4F6F8', borderWidth: 1, borderColor: '#CFD8DC', borderRadius: 10, padding: 14, marginBottom: 12, fontSize: 14, color: '#263238' },
  primaryBtn: { backgroundColor: '#00796B', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  primaryBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  switchBtn: { marginTop: 16, alignItems: 'center' },
  switchBtnText: { color: '#00796B', fontSize: 13, fontWeight: '600' },
  divisorText: { textAlign: 'center', color: '#78909C', fontSize: 13, fontWeight: '600', marginTop: 24, borderTopWidth: 1, borderTopColor: '#ECEFF1', paddingTop: 16, marginBottom: 16 },
  perfilCard: { flexDirection: 'row', backgroundColor: '#112A36', padding: 12, borderRadius: 12, alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#1C3D4E' },
  perfilAvatar: { backgroundColor: '#00796B', width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  perfilAvatarText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  perfilInfo: { flex: 1 },
  perfilName: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  perfilEmail: { color: '#90A4AE', fontSize: 12, marginTop: 2 }
});

import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthInput from '../components/AuthInput';
import PrimaryButton from '../components/PrimaryButton';
import { colors, radius, spacing } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { hasErrors, validateLogin } from '../utils/validation';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    const nextErrors = validateLogin({ email, password });
    setErrors(nextErrors);
    setFormError('');

    if (hasErrors(nextErrors)) return;

    try {
      setLoading(true);
      await login(email, password);
    } catch (error) {
      setFormError(error.message || 'Incorrect email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.brand}>
            <View style={styles.iconWrap}>
              <Ionicons name="lock-closed" size={28} color={colors.surface} />
            </View>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Log in to continue to your account.</Text>
          </View>

          <View style={styles.card}>
            {formError ? (
              <View style={styles.banner}>
                <Ionicons name="alert-circle" size={18} color={colors.error} />
                <Text style={styles.bannerText}>{formError}</Text>
              </View>
            ) : null}

            <AuthInput
              label="Email"
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                setErrors((prev) => ({ ...prev, email: '' }));
              }}
              placeholder="you@example.com"
              keyboardType="email-address"
              icon="mail-outline"
              error={errors.email}
            />
            <AuthInput
              label="Password"
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                setErrors((prev) => ({ ...prev, password: '' }));
              }}
              placeholder="Enter your password"
              icon="lock-closed-outline"
              secureTextEntry
              showPasswordToggle
              error={errors.password}
            />

            <PrimaryButton title="Login" onPress={onLogin} loading={loading} />
            <PrimaryButton
              title="Go to Signup"
              variant="ghost"
              onPress={() => navigation.navigate('Signup')}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  brand: {
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: colors.muted,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    shadowColor: '#163832',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.errorSoft,
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  bannerText: {
    color: colors.error,
    fontSize: 13,
    flex: 1,
    fontWeight: '600',
  },
});

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Users, Search, UserPlus, Briefcase, Plus, FolderOpen, LucideProps } from 'lucide-react-native';

const ICON_MAP: Record<string, React.FC<LucideProps>> = {
  users: Users,
  search: Search,
  'user-plus': UserPlus,
  briefcase: Briefcase,
  plus: Plus,
};

interface EmptyStateProps {
  icon: string;
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, subtitle, actionLabel, onAction }: EmptyStateProps) {
  const IconComponent = ICON_MAP[icon] || FolderOpen;

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <IconComponent size={32} color="#818CF8" />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {actionLabel && onAction && (
        <TouchableOpacity style={styles.button} onPress={onAction} activeOpacity={0.85}>
          <Plus size={18} color="#0F172A" />
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#64748B',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ffffffff',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    borderColor: '#0F172A',
    borderWidth: 1,
    borderStyle: 'dashed',

  },
  buttonText: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '700',
  },
});

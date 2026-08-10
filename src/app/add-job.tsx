import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import {
  ChevronLeft, Link as LucideLink, X, Zap, CheckCircle, Briefcase, Building,
  Hash, MapPin, Clock, FileText, Check, LucideIcon
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { addJob } from '../services/api';

const FIELD_ICON_MAP: Record<string, LucideIcon> = {
  briefcase: Briefcase,
  home: Building,
  hash: Hash,
  'map-pin': MapPin,
  clock: Clock,
};

// ─── Types ───────────────────────────────────────────────────────────────────
interface JobFields {
  company: string;
  role: string;
  jobId: string;
  location: string;
  type: string;
  jd: string;
  link: string;
}

// ─── JSON-LD schema.org/JobPosting extractor ─────────────────────────────────
function extractJsonLd(html: string): Partial<JobFields> {
  const result: Partial<JobFields> = {};
  const regex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;

  while ((match = regex.exec(html)) !== null) {
    try {
      const data = JSON.parse(match[1]);
      const items = Array.isArray(data) ? data : [data];
      for (const item of items) {
        if (item['@type'] === 'JobPosting') {
          result.role = item.title || '';
          result.company = item.hiringOrganization?.name || '';
          result.jd = item.description
            ? stripHtml(item.description)
            : '';
          result.location = item.jobLocation?.address?.addressLocality
            ? `${item.jobLocation.address.addressLocality}, ${item.jobLocation.address.addressRegion || ''}`.trim().replace(/,$/, '')
            : '';
          result.type = item.employmentType
            ? item.employmentType.replace(/_/g, ' ')
            : '';
          result.jobId = item.identifier?.value || item.identifier || '';
          return result;
        }
      }
    } catch { /* malformed JSON, skip */ }
  }
  return result;
}

// ─── Meta-tag fallback extractor ─────────────────────────────────────────────
function extractMeta(html: string): Partial<JobFields> {
  const result: Partial<JobFields> = {};

  const ogTitle = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i);
  const ogSiteName = html.match(/<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i);
  const ogDesc = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i);
  const title = html.match(/<title[^>]*>([^<]+)<\/title>/i);

  if (ogTitle?.[1]) result.role = ogTitle[1];
  else if (title?.[1]) result.role = title[1].split('|')[0].split('-')[0].trim();

  if (ogSiteName?.[1]) result.company = ogSiteName[1];
  if (ogDesc?.[1]) result.jd = ogDesc[1];

  return result;
}

// ─── Strip HTML tags ──────────────────────────────────────────────────────────
function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<li[^>]*>/gi, '\n• ')
    .replace(/<\/?(ul|ol|p|div|h[1-6])[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// ─── Fetch + extract ──────────────────────────────────────────────────────────
async function extractJobFromUrl(url: string): Promise<Partial<JobFields>> {
  // Proxy via allorigins to bypass CORS on mobile
  const proxied = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
  const res = await fetch(proxied, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const json = await res.json();
  const html: string = json.contents || '';

  if (!html) throw new Error('Empty response');

  const jsonLd = extractJsonLd(html);
  const meta = extractMeta(html);

  return {
    role: jsonLd.role || meta.role || '',
    company: jsonLd.company || meta.company || '',
    jd: jsonLd.jd || meta.jd || '',
    location: jsonLd.location || '',
    type: jsonLd.type || '',
    jobId: jsonLd.jobId || '',
  };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AddJobScreen() {
  const router = useRouter();

  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [extracted, setExtracted] = useState(false);
  const [fields, setFields] = useState<JobFields>({
    company: '', role: '', jobId: '', location: '', type: '', jd: '', link: '',
  });

  const handleExtract = async () => {
    const trimmed = url.trim();
    if (!trimmed) { Alert.alert('Enter a URL', 'Please paste a job posting link first.'); return; }
    if (!trimmed.startsWith('http')) {
      Alert.alert('Invalid URL', 'Make sure the link starts with http:// or https://');
      return;
    }

    setLoading(true);
    try {
      const data = await extractJobFromUrl(trimmed);
      setFields(prev => ({
        ...prev,
        ...data,
        link: trimmed,
      }));
      setExtracted(true);
    } catch (e: any) {
      Alert.alert(
        'Could not extract',
        e.message || 'This site may block scraping. Please fill in the details manually.',
      );
      // Still show the form so user can fill manually
      setFields(prev => ({ ...prev, link: trimmed }));
      setExtracted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!fields.role || !fields.company) {
      Alert.alert('Missing info', 'Role and Company are required.');
      return;
    }
    try {
      setLoading(true);
      await addJob({
        ...fields,
        status: 'Pending AI Draft',
        referrer: 'To be found',
        statusColor: '#D97706',
        statusBg: '#FFFBEB',
      });
      Alert.alert('Job Saved! ✅', `${fields.role} at ${fields.company} has been added.`, [
        { text: 'OK', onPress: () => router.replace('/(tabs)/jobs') },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Banner */}
      <View style={styles.headerBackground}>
        <LinearGradient
          colors={['#080d18ff', '#080d18ff', '#1E293B', '#1E1B4B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.indigoGlow} />
        <View style={styles.emeraldGlow} />
      </View>

      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Add Job</Text>
          <View style={{ width: 40 }} />
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* URL Paste card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Paste Job Link</Text>
              <Text style={styles.cardSubtitle}>
                We'll try to auto-fill the details from the job posting page.
              </Text>

              <View style={styles.urlRow}>
                <View style={[styles.inputWrapper, { flex: 1 }]}>
                  <LucideLink size={16} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.urlInput}
                    value={url}
                    onChangeText={setUrl}
                    placeholder="https://careers.company.com/job/..."
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="url"
                  />
                  {url.length > 0 && (
                    <TouchableOpacity onPress={() => { setUrl(''); setExtracted(false); }}>
                      <X size={16} color="#9CA3AF" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <TouchableOpacity
                style={[styles.extractButton, loading && { opacity: 0.7 }]}
                onPress={handleExtract}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Zap size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={styles.extractButtonText}>
                      {extracted ? 'Re-extract' : 'Extract Job Details'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              {extracted && (
                <View style={styles.successBadge}>
                  <CheckCircle size={14} color="#059669" />
                  <Text style={styles.successText}>Details extracted — review and edit below</Text>
                </View>
              )}
            </View>

            {/* Editable fields */}
            {extracted && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Job Details</Text>
                <Text style={styles.cardSubtitle}>Review and edit the extracted info.</Text>

                <InputField
                  label="Role / Job Title"
                  icon="briefcase"
                  value={fields.role}
                  onChange={v => setFields(p => ({ ...p, role: v }))}
                  placeholder="e.g. Senior Frontend Engineer"
                />
                <InputField
                  label="Company"
                  icon="home"
                  value={fields.company}
                  onChange={v => setFields(p => ({ ...p, company: v }))}
                  placeholder="e.g. Google"
                />
                <InputField
                  label="Job ID"
                  icon="hash"
                  value={fields.jobId}
                  onChange={v => setFields(p => ({ ...p, jobId: v }))}
                  placeholder="e.g. REF-2026-001"
                />
                <InputField
                  label="Location"
                  icon="map-pin"
                  value={fields.location}
                  onChange={v => setFields(p => ({ ...p, location: v }))}
                  placeholder="e.g. Pune, India (Hybrid)"
                />
                <InputField
                  label="Employment Type"
                  icon="clock"
                  value={fields.type}
                  onChange={v => setFields(p => ({ ...p, type: v }))}
                  placeholder="e.g. Full-time"
                />

                {/* JD multiline */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Job Description</Text>
                  <View style={[styles.inputWrapper, { alignItems: 'flex-start', minHeight: 140, paddingVertical: 12 }]}>
                    <FileText size={16} color="#9CA3AF" style={[styles.inputIcon, { marginTop: 2 }]} />
                    <TextInput
                      style={[styles.fieldInput, { flex: 1, height: undefined, textAlignVertical: 'top' }]}
                      value={fields.jd}
                      onChangeText={v => setFields(p => ({ ...p, jd: v }))}
                      placeholder="Job description will appear here..."
                      placeholderTextColor="#9CA3AF"
                      multiline
                    />
                  </View>
                </View>
              </View>
            )}

            <View style={{ height: 100 }} />
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Save button */}
        {extracted && (
          <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Check size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.saveButtonText}>Save Job</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

// ─── Reusable field component ─────────────────────────────────────────────────
function InputField({
  label, icon, value, onChange, placeholder,
}: {
  label: string; icon: string; value: string;
  onChange: (v: string) => void; placeholder: string;
}) {
  const IconComponent = FIELD_ICON_MAP[icon] || Briefcase;
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <IconComponent size={16} color="#9CA3AF" style={styles.inputIcon} />
        <TextInput
          style={styles.fieldInput}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
        />
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  headerBackground: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 220,
    borderBottomLeftRadius: 32, borderBottomRightRadius: 32, overflow: 'hidden',
  },
  indigoGlow: {
    position: 'absolute', top: -120, right: -130,
    width: 256, height: 256, borderRadius: 500,
    backgroundColor: 'rgba(99, 102, 241, 0.18)',
  },
  emeraldGlow: {
    position: 'absolute', bottom: -100, left: -50,
    width: 192, height: 192, borderRadius: 96,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 10, marginBottom: 24,
  },
  backButton: { padding: 8, marginLeft: -8 },
  pageTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20,
    marginBottom: 16,
    shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12, elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  cardSubtitle: { fontSize: 13, color: '#9CA3AF', marginBottom: 16, lineHeight: 18 },
  urlRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F3F4F6', borderRadius: 14,
    paddingHorizontal: 14, height: 50,
  },
  inputIcon: { marginRight: 10 },
  urlInput: { flex: 1, color: '#111827', fontSize: 14 },
  extractButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#161C33', borderRadius: 14, paddingVertical: 14,
  },
  extractButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },
  successBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#ECFDF5', borderRadius: 10, padding: 10, marginTop: 12,
  },
  successText: { color: '#059669', fontSize: 13, fontWeight: '500', flex: 1 },
  inputGroup: { marginBottom: 16 },
  label: {
    fontSize: 11, fontWeight: 'bold', color: '#6B7280',
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8,
  },
  fieldInput: { flex: 1, color: '#111827', fontSize: 15, fontWeight: '500' },
  bottomBar: {
    position: 'absolute', bottom: 20, left: 20, right: 20,
    backgroundColor: '#161C33', borderRadius: 18,
    elevation: 10, shadowColor: '#000', shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: -4 }, shadowRadius: 12,
  },
  saveButton: {
    flexDirection: 'row', paddingVertical: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});

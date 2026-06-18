import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { useEffect, useMemo, useState } from "react";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import {
  Alert,
  Animated,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { cropLibrary, getCropById, getCropLibraryItem } from "./src/data/cropLibrary";
import { addDays, buildFarmCalendar, buildPracticeInsights, getCropPractice, toDateInputValue, type FarmCalendarEvent, type FarmInsight } from "./src/data/cropPractices";
import { quickActions } from "./src/data/farmData";
import { addField, addPhoto, addRecord, addReminder, deleteRecord, getCropCycles, getFields, getPhotos, getRecords, getReminders, getUserProfile, initializeDatabase, resetFarmData, saveUserProfile, updateField } from "./src/data/farmRepository";
import type { CropCycle, CropField, FarmRecord, FieldInput, FieldStatus, PhotoInput, PhotoRecord, RecordInput, Reminder, UserProfile, UserProfileInput } from "./src/data/types";
import { buildDashboardMetrics, buildReportModel, calculateFarmTotals, type DashboardMetric } from "./src/reports/currentReportRules";
import { nextMorningDate, scheduleFarmReminder } from "./src/services/notifications";
import { createReportExportActions } from "./src/services/reportExports";
import { colors, radii, spacing } from "./src/theme";

type TabKey = "Home" | "Fields" | "Records" | "Calendar" | "Reports" | "More";

const currency = new Intl.NumberFormat("en-ZM", {
  style: "currency",
  currency: "ZMW",
  maximumFractionDigits: 0
});

const tabs: { key: TabKey; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: "Home", icon: "home" },
  { key: "Fields", icon: "layers-outline" },
  { key: "Records", icon: "clipboard-outline" },
  { key: "Calendar", icon: "calendar-outline" },
  { key: "Reports", icon: "bar-chart-outline" },
  { key: "More", icon: "ellipsis-horizontal" }
];

const recordFilters = ["All", "Fertilizer", "Irrigation", "Labor", "Sale"] as const;

function MasonaApp() {
  const [activeTab, setActiveTab] = useState<TabKey>("Home");
  const [fields, setFields] = useState<CropField[]>([]);
  const [cropCycles, setCropCycles] = useState<CropCycle[]>([]);
  const [records, setRecords] = useState<FarmRecord[]>([]);
  const [photos, setPhotos] = useState<PhotoRecord[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isFieldFormOpen, setIsFieldFormOpen] = useState(false);
  const [isRecordFormOpen, setIsRecordFormOpen] = useState(false);
  const [isPhotoFormOpen, setIsPhotoFormOpen] = useState(false);
  const [isProfileFormOpen, setIsProfileFormOpen] = useState(false);
  const [resetOnProfileSave, setResetOnProfileSave] = useState(false);
  const [selectedField, setSelectedField] = useState<CropField | null>(null);
  const [editingField, setEditingField] = useState<CropField | null>(null);
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null);
  const [initialRecordType, setInitialRecordType] = useState("Activity");
  const [initialRecordDate, setInitialRecordDate] = useState(toDateInputValue(new Date()));
  const [activeRecordFilter, setActiveRecordFilter] = useState("All");
  const insets = useSafeAreaInsets();
  const totals = useMemo(() => calculateFarmTotals(records), [records]);
  const dashboardMetrics = useMemo(() => buildDashboardMetrics(totals, fields, records), [fields, records, totals]);
  const calendarEvents = useMemo(() => buildFarmCalendar(fields, records), [fields, records]);
  const practiceInsights = useMemo(() => buildPracticeInsights(fields, records), [fields, records]);

  useEffect(() => {
    try {
      initializeDatabase();
      const storedProfile = getUserProfile();
      setProfile(storedProfile);
      if (!storedProfile?.onboardingCompleted) {
        setResetOnProfileSave(true);
        setIsProfileFormOpen(true);
      }
      refreshFarmData();
    } catch {
      Alert.alert("Could not open farm records", "Your records are still saved on this phone. Please close and reopen the app.");
    }
  }, []);

  function refreshFarmData() {
    setFields(getFields());
    setCropCycles(getCropCycles());
    setRecords(getRecords());
    setPhotos(getPhotos());
    setReminders(getReminders());
  }

  function handleSaveField(input: FieldInput) {
    if (editingField) {
      updateField(editingField.id, input);
      setEditingField(null);
      setSelectedField(null);
    } else {
      addField(input);
    }
    refreshFarmData();
    setActiveTab("Fields");
    setIsFieldFormOpen(false);
  }

  function handleCloseFieldForm() {
    setIsFieldFormOpen(false);
    setEditingField(null);
  }

  function handleEditField(field: CropField) {
    setSelectedField(null);
    setEditingField(field);
    setIsFieldFormOpen(true);
  }

  async function handleSaveRecord(input: RecordInput) {
    addRecord(input);
    const recordDate = parseDateInputValue(input.date);
    const upcomingReminderDate = recordDate ? buildUpcomingActivityReminderDate(recordDate) : null;
    if (upcomingReminderDate) {
      const notificationId = await scheduleFarmReminder(
        buildReminderTitle(input),
        input.quantity ? `${input.detail} - ${input.quantity}` : input.detail,
        upcomingReminderDate
      );
      addReminder({
        title: buildReminderTitle(input),
        detail: input.quantity ? `${input.detail} - ${input.quantity}` : input.detail,
        field: input.cropCycleName,
        dueAt: upcomingReminderDate.toISOString(),
        tone: input.type === "Chemical" || input.type === "Treatment" ? "red" : "amber",
        icon: input.type === "Irrigation" ? "water" : "calendar",
        notificationId
      });
    }
    if (input.type === "Chemical") {
      const dueDate = recordDate ? dateAtHour(addDays(recordDate, 1), 8) : nextMorningDate(1);
      const notificationId = await scheduleFarmReminder(
        `Check ${input.cropCycleName}`,
        `Record chemical result: ${input.detail}`,
        dueDate
      );
      addReminder({
        title: `Chemical follow-up - ${input.cropCycleName}`,
        detail: `Check result for ${input.detail}`,
        field: input.cropCycleName,
        dueAt: dueDate.toISOString(),
        tone: "red",
        icon: "sprinkler",
        notificationId
      });
      if (recordDate) {
        const withholdingDate = dateAtHour(addDays(recordDate, 7), 8);
        const withholdingNotificationId = await scheduleFarmReminder(
          `Withholding check - ${input.cropCycleName}`,
          `Review harvest safety before picking after: ${input.detail}`,
          withholdingDate
        );
        addReminder({
          title: `Withholding check - ${input.cropCycleName}`,
          detail: `Review harvest safety before picking after: ${input.detail}`,
          field: input.cropCycleName,
          dueAt: withholdingDate.toISOString(),
          tone: "red",
          icon: "sprinkler",
          notificationId: withholdingNotificationId
        });
      }
    }
    refreshFarmData();
    setActiveTab("Records");
    setIsRecordFormOpen(false);
  }

  function handleSavePhoto(input: PhotoInput) {
    addPhoto(input);
    refreshFarmData();
    setActiveTab("More");
    setIsPhotoFormOpen(false);
  }

  function handleDeleteRecord(record: FarmRecord) {
    Alert.alert("Archive record?", `${record.type} - ${record.cropCycleName || record.field}\n\nThis keeps the history but hides the record from normal lists and reports.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Archive",
        style: "destructive",
        onPress: () => {
          deleteRecord(record.id);
          refreshFarmData();
        }
      }
    ]);
  }

  function handleOpenProfile() {
    setResetOnProfileSave(false);
    setIsProfileFormOpen(true);
  }

  function handleSaveProfile(input: UserProfileInput) {
    if (resetOnProfileSave) {
      resetFarmData();
    }
    const savedProfile = saveUserProfile(input);
    setProfile(savedProfile);
    refreshFarmData();
    setIsProfileFormOpen(false);
    setResetOnProfileSave(false);
    if (resetOnProfileSave) {
      setActiveTab("Fields");
      setIsFieldFormOpen(true);
    }
  }

  function handleQuickAction(label: string) {
    if (label === "Add Field") {
      setIsFieldFormOpen(true);
      return;
    }
    if (label === "Photo") {
      setIsPhotoFormOpen(true);
      return;
    }
    setInitialRecordType(label === "Add Record" ? "Activity" : label);
    setInitialRecordDate(toDateInputValue(new Date()));
    setIsRecordFormOpen(true);
  }

  function handleAddRecordForDate(date: string, type = "Activity") {
    setInitialRecordType(type);
    setInitialRecordDate(date);
    setActiveTab("Calendar");
    setIsRecordFormOpen(true);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.header} />
      <View style={styles.app}>
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 14) }]}>
          <View style={styles.headerWash} />
          <View style={styles.brandRow}>
            <MasonaLogo />
            <View style={styles.brandCopy}>
              <View style={styles.titleRow}>
                <Text style={styles.appTitle} numberOfLines={1}>{profile?.farmName || "Masona Farms"}</Text>
                <Ionicons name="chevron-down" size={20} color="#ffffff" />
              </View>
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={15} color="rgba(255,255,255,0.78)" />
                <Text style={styles.locationText} numberOfLines={1}>{profile?.location || "Set up your farm"}</Text>
              </View>
            </View>
            <View style={styles.headerTools}>
              <View style={styles.offlineBadge}>
                <Ionicons name="cloud-offline-outline" size={23} color="#ffffff" />
                <Text style={styles.offlineText}>Offline</Text>
                <View style={styles.syncDot} />
              </View>
              <Pressable style={styles.bellButton} accessibilityRole="button" accessibilityLabel="Notifications">
                <Ionicons name="notifications-outline" size={24} color="#ffffff" />
                {reminders.length ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{reminders.length}</Text>
                  </View>
                ) : null}
              </Pressable>
            </View>
          </View>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={[styles.contentInner, { paddingBottom: 112 + insets.bottom }]} showsVerticalScrollIndicator={false}>
          {activeTab === "Home" && (
            <HomeScreen
              metrics={dashboardMetrics}
              fields={fields}
              records={records}
              reminders={reminders}
              onAddField={() => setIsFieldFormOpen(true)}
              onOpenField={setSelectedField}
              onQuickAction={handleQuickAction}
              expandedRecordId={expandedRecordId}
              onToggleRecord={setExpandedRecordId}
              onDeleteRecord={handleDeleteRecord}
              insights={practiceInsights}
            />
          )}
          {activeTab === "Fields" && <FieldsScreen fields={fields} cropCycles={cropCycles} onAddField={() => setIsFieldFormOpen(true)} onOpenField={setSelectedField} />}
          {activeTab === "Records" && (
            <RecordsScreen
              records={records}
              activeFilter={activeRecordFilter}
              onFilterChange={setActiveRecordFilter}
              onAddRecord={() => {
                setInitialRecordType("Activity");
                setInitialRecordDate(toDateInputValue(new Date()));
                setIsRecordFormOpen(true);
              }}
              expandedRecordId={expandedRecordId}
              onToggleRecord={setExpandedRecordId}
              onDeleteRecord={handleDeleteRecord}
            />
          )}
          {activeTab === "Calendar" && <CalendarScreen events={calendarEvents} fields={fields} onAddRecordForDate={handleAddRecordForDate} />}
          {activeTab === "Reports" && <ReportsScreen totals={totals} fields={fields} records={records} insights={practiceInsights} />}
          {activeTab === "More" && <MoreScreen photos={photos} profile={profile} onEditProfile={handleOpenProfile} />}
        </ScrollView>

        <Pressable
          style={[styles.fab, { bottom: 86 + insets.bottom }]}
          onPress={() => {
            setInitialRecordType("Activity");
            setInitialRecordDate(toDateInputValue(new Date()));
            setIsRecordFormOpen(true);
          }}
          accessibilityRole="button"
          accessibilityLabel="Add farm record"
        >
          <Ionicons name="add" size={38} color="#ffffff" />
        </Pressable>

        <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
          {tabs.map((tab) => {
            const selected = tab.key === activeTab;
            return (
              <Pressable key={tab.key} style={styles.tabItem} onPress={() => setActiveTab(tab.key)} accessibilityRole="tab" accessibilityState={{ selected }}>
                <Ionicons name={tab.icon} size={24} color={selected ? colors.green : "#64716a"} />
                <Text style={[styles.tabText, selected && styles.tabTextActive]}>{tab.key}</Text>
              </Pressable>
            );
          })}
        </View>
        <FieldFormModal visible={isFieldFormOpen} initialField={editingField} onClose={handleCloseFieldForm} onSave={handleSaveField} />
        <RecordFormModal visible={isRecordFormOpen} cropCycles={cropCycles} initialType={initialRecordType} initialDate={initialRecordDate} onClose={() => setIsRecordFormOpen(false)} onSave={handleSaveRecord} />
        <PhotoFormModal visible={isPhotoFormOpen} fields={fields} records={records} onClose={() => setIsPhotoFormOpen(false)} onSave={handleSavePhoto} />
        <ProfileSetupModal
          visible={isProfileFormOpen}
          profile={profile}
          resetFarmOnSave={resetOnProfileSave}
          onClose={() => {
            if (!resetOnProfileSave) setIsProfileFormOpen(false);
          }}
          onSave={handleSaveProfile}
        />
        <FieldDetailModal
          field={selectedField}
          cropCycles={cropCycles}
          records={records}
          photos={photos}
          onEdit={handleEditField}
          onClose={() => setSelectedField(null)}
        />
      </View>
    </SafeAreaView>
  );
}

function HomeScreen({
  metrics,
  fields,
  records,
  reminders,
  onAddField,
  onOpenField,
  onQuickAction,
  expandedRecordId,
  onToggleRecord,
  onDeleteRecord,
  insights
}: {
  metrics: DashboardMetric[];
  fields: CropField[];
  records: FarmRecord[];
  reminders: Reminder[];
  onAddField: () => void;
  onOpenField: (field: CropField) => void;
  onQuickAction: (label: string) => void;
  expandedRecordId: string | null;
  onToggleRecord: (recordId: string | null) => void;
  onDeleteRecord: (record: FarmRecord) => void;
  insights: FarmInsight[];
}) {
  return (
    <>
      <MetricStrip metrics={metrics} />
      <SectionHeader title="Farm Insights" />
      <View style={styles.listPanel}>{insights.slice(0, 3).map((insight, index) => <InsightRow key={insight.id} insight={insight} index={index} />)}</View>
      <SectionHeader title="Active Crop Fields" action="Add field" onAction={onAddField} />
      <View style={styles.fieldPanel}>
        {fields.length ? (
          fields.map((field, index) => <FieldRow key={field.id} field={field} index={index} onPress={() => onOpenField(field)} />)
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No fields yet</Text>
            <Text style={styles.emptyText}>Add your first field or plot to start tracking work, costs, harvests, and sales.</Text>
          </View>
        )}
      </View>
      <SectionHeader title="Urgent Reminders" action="View all" tone="red" />
      <View style={styles.listPanel}>{reminders.map((item, index) => <ReminderRow key={item.id} reminder={item} index={index} />)}</View>
      <SectionHeader title="Quick Actions" />
      <View style={styles.quickGrid}>{quickActions.map((item, index) => <QuickAction key={item.label} item={item} index={index} onPress={() => onQuickAction(item.label)} />)}</View>
      <SectionHeader title="Recent Records" action="View all" />
      <View style={styles.listPanel}>
        {records.length ? (
          records.slice(0, 5).map((item, index) => (
            <RecordRow
              key={item.id}
              record={item}
              index={index}
              expanded={expandedRecordId === item.id}
              onToggle={() => onToggleRecord(expandedRecordId === item.id ? null : item.id)}
              onDelete={onDeleteRecord}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No records yet</Text>
            <Text style={styles.emptyText}>Add an activity, expense, harvest, or sale to bring the dashboard to life.</Text>
          </View>
        )}
      </View>
    </>
  );
}

function MasonaLogo({ size = 62 }: { size?: number }) {
  const leafSize = Math.round(size * 0.55);
  return (
    <View style={[styles.logoMark, { width: size, height: size, borderRadius: size / 2 }]}>
      <View style={[styles.logoFieldLine, styles.logoFieldLineTop]} />
      <View style={[styles.logoFieldLine, styles.logoFieldLineBottom]} />
      <MaterialCommunityIcons name="leaf" size={leafSize} color={colors.greenDark} />
      <View style={styles.logoSun} />
    </View>
  );
}

function FadeInView({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: object }) {
  const opacity = useState(() => new Animated.Value(0))[0];
  const translateY = useState(() => new Animated.Value(10))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 320,
        delay,
        useNativeDriver: true
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 320,
        delay,
        useNativeDriver: true
      })
    ]).start();
  }, [delay, opacity, translateY]);

  return <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>{children}</Animated.View>;
}

function MetricStrip({ metrics }: { metrics: DashboardMetric[] }) {
  return (
    <View style={styles.metricsPanel}>
      {metrics.map((metric, index) => (
        <FadeInView key={metric.label} delay={index * 45} style={[styles.metricCell, index < metrics.length - 1 && styles.metricDivider]}>
          <View style={[styles.metricIcon, metric.tone === "teal" && styles.metricIconTeal, metric.tone === "red" && styles.metricIconRed]}>
            <Ionicons name={metric.icon} size={20} color={metric.tone === "teal" ? colors.teal : metric.tone === "red" ? colors.red : colors.green} />
          </View>
          <Text style={styles.metricLabel}>{metric.label}</Text>
          <Text style={styles.metricValue}>{metric.value}</Text>
          <Text style={[styles.metricDelta, metric.tone === "red" && styles.metricDeltaRed]}>{metric.hint}</Text>
        </FadeInView>
      ))}
    </View>
  );
}

function SectionHeader({ title, action, tone = "green", onAction }: { title: string; action?: string; tone?: "green" | "red"; onAction?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <Pressable style={styles.sectionAction} onPress={onAction}>
          <Text style={[styles.sectionActionText, tone === "red" && styles.sectionActionRed]}>{action}</Text>
          <Ionicons name="chevron-forward" size={18} color={tone === "red" ? colors.red : colors.green} />
        </Pressable>
      ) : null}
    </View>
  );
}

function FieldRow({ field, index = 0, onPress }: { field: CropField; index?: number; onPress?: () => void }) {
  const statusStyle = field.status === "Watch" ? styles.statusWatch : styles.statusGood;
  return (
    <FadeInView delay={index * 35}>
    <Pressable style={styles.fieldRow} onPress={onPress}>
      <View style={[styles.cropThumb, { backgroundColor: field.accent }]}>
        <MaterialCommunityIcons name={cropIcon(field.crop)} size={34} color="#ffffff" />
      </View>
      <View style={styles.fieldBody}>
        <View style={styles.fieldTitleRow}>
          <Text style={styles.fieldTitle}>{field.crop} - {field.field}</Text>
          <View style={[styles.statusChip, statusStyle]}>
            <Text style={[styles.statusText, field.status === "Watch" && styles.statusTextWatch]}>{field.status}</Text>
          </View>
        </View>
        <Text style={styles.fieldMeta}>{field.area}  -  {field.stage}{field.daysAfterPlanting !== null ? `  -  Day ${field.daysAfterPlanting}` : ""}</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${field.progress}%` }]} />
        </View>
      </View>
      <Text style={styles.progressText}>{field.progress}%</Text>
      <Ionicons name="chevron-forward" size={22} color="#9aa4a0" />
    </Pressable>
    </FadeInView>
  );
}

function ReminderRow({ reminder, index = 0 }: { reminder: Reminder; index?: number }) {
  const isRed = reminder.tone === "red";
  function openReminder() {
    Alert.alert(reminder.title, `${reminder.detail}\n\nDue: ${reminder.due}`);
  }
  return (
    <FadeInView delay={index * 35}>
    <Pressable style={styles.reminderRow} onPress={openReminder}>
      <View style={[styles.reminderIcon, isRed ? styles.reminderIconRed : styles.reminderIconAmber]}>
        <MaterialCommunityIcons name={reminder.icon} size={25} color="#ffffff" />
      </View>
      <View style={styles.flex}>
        <Text style={styles.rowTitle}>{reminder.title}</Text>
        <Text style={styles.rowSub}>{reminder.detail}</Text>
      </View>
      <Text style={[styles.dueText, isRed ? styles.dueRed : styles.dueAmber]}>{reminder.due}</Text>
      <View style={[styles.alertDot, isRed ? styles.alertDotRed : styles.alertDotAmber]} />
      <Ionicons name="chevron-forward" size={21} color="#9aa4a0" />
    </Pressable>
    </FadeInView>
  );
}

function InsightRow({ insight, index = 0 }: { insight: FarmInsight; index?: number }) {
  const color = insight.tone === "red" ? colors.red : insight.tone === "amber" ? colors.amber : insight.tone === "teal" ? colors.teal : colors.green;
  function openInsight() {
    Alert.alert(insight.title, insight.detail);
  }
  return (
    <FadeInView delay={index * 35}>
      <Pressable style={styles.settingRow} onPress={openInsight}>
        <View style={[styles.insightIcon, { backgroundColor: insight.tone === "amber" ? colors.amberSoft : insight.tone === "red" ? colors.redSoft : colors.mint }]}>
          <Ionicons name={insight.icon} size={22} color={color} />
        </View>
        <View style={styles.flex}>
          <Text style={styles.rowTitle}>{insight.title}</Text>
          <Text style={styles.rowSub}>{insight.detail}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9aa4a0" />
      </Pressable>
    </FadeInView>
  );
}

function QuickAction({ item, index = 0, onPress }: { item: (typeof quickActions)[number]; index?: number; onPress: () => void }) {
  return (
    <FadeInView delay={index * 35} style={styles.quickAction}>
    <Pressable style={styles.quickActionPressable} onPress={onPress}>
      <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={31} color={item.color} />
      <Text style={styles.quickText}>{item.label}</Text>
    </Pressable>
    </FadeInView>
  );
}

function RecordRow({
  record,
  index = 0,
  expanded = false,
  onToggle,
  onDelete
}: {
  record: FarmRecord;
  index?: number;
  expanded?: boolean;
  onToggle?: () => void;
  onDelete?: (record: FarmRecord) => void;
}) {
  const toneStyle = record.tone === "amber" ? styles.recordIconAmber : record.tone === "blue" ? styles.recordIconBlue : styles.recordIconGreen;
  return (
    <FadeInView delay={index * 30}>
    <Pressable style={[styles.recordRow, expanded && styles.recordRowExpanded]} onPress={onToggle}>
      <View style={[styles.recordIcon, toneStyle]}>
        <Ionicons name={record.icon} size={23} color={record.tone === "amber" ? colors.amber : record.tone === "blue" ? colors.teal : colors.green} />
      </View>
      <View style={styles.flex}>
        <Text style={styles.rowTitle}>{record.type} - {record.cropCycleName || record.field}</Text>
        <Text style={styles.rowSub}>{record.detail}{record.quantity ? ` - ${record.quantity}` : ""}</Text>
      </View>
      <View style={styles.recordAmount}>
        <Text style={styles.recordDate}>{record.date}</Text>
        <Text style={styles.amountText}>{currency.format(record.amount)}</Text>
      </View>
      {onDelete ? (
        <Pressable style={styles.deleteRecordButton} onPress={() => onDelete(record)} accessibilityRole="button" accessibilityLabel={`Archive ${record.type} record`}>
          <Ionicons name="archive-outline" size={20} color={colors.red} />
        </Pressable>
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#9aa4a0" />
      )}
    </Pressable>
    {expanded ? (
      <View style={styles.recordDetailPanel}>
        <Text style={styles.detailLabel}>Crop cycle</Text>
        <Text style={styles.detailValue}>{record.cropCycleName || record.field}</Text>
        <Text style={styles.detailLabel}>Record detail</Text>
        <Text style={styles.detailValue}>{record.detail}</Text>
        {record.quantity ? (
          <>
            <Text style={styles.detailLabel}>Quantity or dosage</Text>
            <Text style={styles.detailValue}>{record.quantity}</Text>
          </>
        ) : null}
        <View style={styles.detailGrid}>
          <View style={styles.detailChip}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{record.date}</Text>
          </View>
          <View style={styles.detailChip}>
            <Text style={styles.detailLabel}>Amount</Text>
            <Text style={styles.detailValue}>{currency.format(record.amount)}</Text>
          </View>
        </View>
      </View>
    ) : null}
    </FadeInView>
  );
}

function FieldsScreen({ fields, cropCycles, onAddField, onOpenField }: { fields: CropField[]; cropCycles: CropCycle[]; onAddField: () => void; onOpenField: (field: CropField) => void }) {
  return (
    <>
      <SectionHeader title="Fields" action="Add field" onAction={onAddField} />
      <View style={styles.fieldPanel}>
        {fields.length ? (
          fields.map((field, index) => <FieldRow key={field.id} field={field} index={index} onPress={() => onOpenField(field)} />)
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No fields yet</Text>
            <Text style={styles.emptyText}>Add your first field to create a crop cycle and calendar.</Text>
          </View>
        )}
      </View>
      <SectionHeader title="Active Crop Cycles" />
      <View style={styles.listPanel}>
        {cropCycles.length ? (
          cropCycles.map((cycle, index) => <CropCycleRow key={cycle.id} cycle={cycle} index={index} />)
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No crop cycles yet</Text>
            <Text style={styles.emptyText}>Add a field to start tracking its active crop cycle.</Text>
          </View>
        )}
      </View>
    </>
  );
}

function CropCycleRow({ cycle, index = 0 }: { cycle: CropCycle; index?: number }) {
  function openCycle() {
    Alert.alert(cycle.label, `Field: ${cycle.field}\nCrop: ${cycle.crop}\nVariety: ${cycle.variety}\nPlanting date: ${cycle.plantingDate || "Not set"}\nExpected harvest: ${cycle.expectedHarvest || "Not set"}\nStage: ${cycle.stage}\nStatus: ${cycle.status}`);
  }
  return (
    <FadeInView delay={index * 30}>
      <Pressable style={styles.cropCycleRow} onPress={openCycle}>
        <View style={styles.cropCycleIcon}>
          <MaterialCommunityIcons name={cropIcon(cycle.crop)} size={24} color={colors.green} />
        </View>
        <View style={styles.flex}>
          <Text style={styles.rowTitle}>{cycle.label}</Text>
          <Text style={styles.rowSub}>{cycle.stage} - {cycle.plantingDate || "No planting date"} - {cycle.status}</Text>
        </View>
        <View style={styles.cropCycleBadge}>
          <Text style={styles.cropCycleBadgeText}>Cycle</Text>
        </View>
      </Pressable>
    </FadeInView>
  );
}

function RecordsScreen({
  records,
  activeFilter,
  onFilterChange,
  onAddRecord,
  expandedRecordId,
  onToggleRecord,
  onDeleteRecord
}: {
  records: FarmRecord[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onAddRecord: () => void;
  expandedRecordId: string | null;
  onToggleRecord: (recordId: string | null) => void;
  onDeleteRecord: (record: FarmRecord) => void;
}) {
  const visibleRecords = activeFilter === "All" ? records : records.filter((record) => record.type === activeFilter || record.type.includes(activeFilter));
  const filterCounts = buildFilterCounts(records);
  return (
    <>
      <SectionHeader title="Records" action="Add record" onAction={onAddRecord} />
      <View style={styles.segmentRow}>
        {recordFilters.map((item) => (
          <Pressable key={item} style={[styles.segment, activeFilter === item && styles.segmentActive]} onPress={() => onFilterChange(item)}>
            <Text style={[styles.segmentText, activeFilter === item && styles.segmentTextActive]}>{item} {filterCounts[item] ?? 0}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.listPanel}>
        {visibleRecords.length ? (
          visibleRecords.map((record, index) => (
            <RecordRow
              key={record.id}
              record={record}
              index={index}
              expanded={expandedRecordId === record.id}
              onToggle={() => onToggleRecord(expandedRecordId === record.id ? null : record.id)}
              onDelete={onDeleteRecord}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No records yet</Text>
            <Text style={styles.emptyText}>Add a {activeFilter.toLowerCase()} record and it will appear here.</Text>
          </View>
        )}
      </View>
    </>
  );
}

function CalendarScreen({ events, fields, onAddRecordForDate }: { events: FarmCalendarEvent[]; fields: CropField[]; onAddRecordForDate: (date: string, type?: string) => void }) {
  const today = toDateInputValue(new Date());
  const [selectedDate, setSelectedDate] = useState(today);
  const [jumpDate, setJumpDate] = useState(today);
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(`${today}T00:00:00`));
  const monthDays = useMemo(() => buildMonthCalendarDays(visibleMonth, events, today, selectedDate), [events, selectedDate, today, visibleMonth]);

  useEffect(() => {
    setJumpDate(selectedDate);
  }, [selectedDate]);

  const selectedEvents = events.filter((event) => event.date === selectedDate);
  const upcomingEvents = events.filter((event) => event.date >= today).slice(0, 8);
  const backfillTypes = ["Planting", "Fertilizer", "Chemical", "Irrigation", "Treatment", "Labor", "Harvest", "Sale"] as const;

  function jumpToDate() {
    if (!isDateInputValue(jumpDate)) {
      Alert.alert("Check date", "Use a date like 2026-06-09.");
      return;
    }
    setSelectedDate(jumpDate);
    setVisibleMonth(new Date(`${jumpDate}T00:00:00`));
  }

  function moveMonth(offset: number) {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  }

  function selectCalendarDate(date: string) {
    setSelectedDate(date);
    setVisibleMonth(new Date(`${date}T00:00:00`));
  }

  return (
    <>
      <SectionHeader title="Calendar" />
      <View style={styles.calendarJumpCard}>
        <View style={styles.flex}>
          <Text style={styles.rowTitle}>Go to date</Text>
          <Text style={styles.rowSub}>Backfill work that happened on any day.</Text>
        </View>
        <TextInput
          value={jumpDate}
          onChangeText={setJumpDate}
          placeholder="2026-06-09"
          placeholderTextColor="#9aa4a0"
          style={styles.calendarJumpInput}
        />
        <Pressable style={styles.calendarGoButton} onPress={jumpToDate}>
          <Text style={styles.calendarGoText}>Go</Text>
        </Pressable>
      </View>
      <View style={styles.monthPanel}>
        <View style={styles.monthHeader}>
          <Pressable style={styles.monthNavButton} onPress={() => moveMonth(-1)} accessibilityRole="button" accessibilityLabel="Previous month">
            <Ionicons name="chevron-back" size={22} color={colors.green} />
          </Pressable>
          <Text style={styles.monthTitle}>{visibleMonth.toLocaleDateString("en", { month: "long", year: "numeric" })}</Text>
          <Pressable style={styles.monthNavButton} onPress={() => moveMonth(1)} accessibilityRole="button" accessibilityLabel="Next month">
            <Ionicons name="chevron-forward" size={22} color={colors.green} />
          </Pressable>
        </View>
        <View style={styles.weekHeader}>
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <Text key={day} style={styles.weekHeaderText}>{day}</Text>
          ))}
        </View>
        <View style={styles.monthGrid}>
          {monthDays.map((item) => {
            const active = item.date === selectedDate;
            const isToday = item.date === today;
            const muted = !item.inMonth;
          return (
            <Pressable key={item.date} style={[styles.monthDay, muted && styles.monthDayMuted, isToday && styles.monthDayToday, active && styles.monthDayActive]} onPress={() => selectCalendarDate(item.date)}>
              <Text style={[styles.monthDayNumber, muted && styles.monthDayNumberMuted, active && styles.monthDayNumberActive]}>{item.day}</Text>
              <View style={styles.monthDotRow}>
                {Array.from({ length: Math.min(item.count, 3) }).map((_, dotIndex) => (
                  <View key={dotIndex} style={[styles.monthDot, active && styles.monthDotActive]} />
                ))}
              </View>
            </Pressable>
          );
        })}
        </View>
      </View>

      <SectionHeader title={formatCalendarHeading(selectedDate)} action="Add record" onAction={() => onAddRecordForDate(selectedDate)} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.backfillStrip}>
        {backfillTypes.map((type) => (
          <Pressable key={type} style={styles.backfillChip} onPress={() => onAddRecordForDate(selectedDate, type)}>
            <Text style={styles.backfillChipText}>{type}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <View style={styles.listPanel}>
        {selectedEvents.length ? (
          selectedEvents.map((event, index) => <CalendarEventRow key={event.id} event={event} index={index} />)
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Nothing planned</Text>
            <Text style={styles.emptyText}>Add planting dates or records to fill this day.</Text>
          </View>
        )}
      </View>

      <SectionHeader title="Upcoming Work" />
      <View style={styles.listPanel}>
        {upcomingEvents.length ? (
          upcomingEvents.map((event, index) => <CalendarEventRow key={`${event.id}-upcoming`} event={event} index={index} />)
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No upcoming work yet</Text>
            <Text style={styles.emptyText}>{fields.length ? "Add planting dates to build the crop calendar." : "Add a field first, then the crop calendar will appear here."}</Text>
          </View>
        )}
      </View>
    </>
  );
}

function CalendarEventRow({ event, index = 0 }: { event: FarmCalendarEvent; index?: number }) {
  const color = event.tone === "red" ? colors.red : event.tone === "amber" ? colors.amber : event.tone === "teal" ? colors.teal : colors.green;
  function openEvent() {
    Alert.alert(event.title, `${event.detail}\n\nField: ${event.field}\nDate: ${event.date}`);
  }
  return (
    <FadeInView delay={index * 30}>
      <Pressable style={styles.settingRow} onPress={openEvent}>
        <View style={[styles.insightIcon, { backgroundColor: event.tone === "amber" ? colors.amberSoft : event.tone === "red" ? colors.redSoft : colors.mint }]}>
          <Ionicons name={event.icon} size={22} color={color} />
        </View>
        <View style={styles.flex}>
          <Text style={styles.rowTitle}>{event.title}</Text>
          <Text style={styles.rowSub}>{event.field} - {event.detail}</Text>
        </View>
        <Text style={styles.recordDate}>{event.date}</Text>
      </Pressable>
    </FadeInView>
  );
}

function FieldDetailModal({
  field,
  cropCycles,
  records,
  photos,
  onEdit,
  onClose
}: {
  field: CropField | null;
  cropCycles: CropCycle[];
  records: FarmRecord[];
  photos: PhotoRecord[];
  onEdit: (field: CropField) => void;
  onClose: () => void;
}) {
  if (!field) return null;

  const relatedCycles = cropCycles.filter((cycle) => cycle.field === field.field);
  const relatedRecords = records.filter((record) => record.field === field.field).slice(0, 5);
  const relatedPhotos = photos.filter((photo) => photo.field === field.field).slice(0, 4);
  const fieldSpend = relatedRecords.filter((record) => record.type !== "Sale" && record.type !== "Harvest").reduce((sum, record) => sum + record.amount, 0);
  const fieldRevenue = relatedRecords.filter((record) => record.type === "Sale").reduce((sum, record) => sum + record.amount, 0);

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetTitle}>{field.crop} - {field.field}</Text>
              <Text style={styles.sheetSubtitle}>{field.area} - {field.stage}</Text>
            </View>
            <View style={styles.sheetActions}>
              <Pressable style={styles.closeButton} onPress={() => onEdit(field)} accessibilityRole="button" accessibilityLabel="Edit field calendar">
                <Ionicons name="create-outline" size={22} color={colors.green} />
              </Pressable>
              <Pressable style={styles.closeButton} onPress={onClose} accessibilityRole="button" accessibilityLabel="Close field details">
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.detailGrid}>
              <View style={styles.detailChip}>
                <Text style={styles.detailLabel}>Status</Text>
                <Text style={styles.detailValue}>{field.status}</Text>
              </View>
              <View style={styles.detailChip}>
                <Text style={styles.detailLabel}>Progress</Text>
                <Text style={styles.detailValue}>{field.progress}% {field.progressSource === "calendar" ? "calendar" : "manual"}</Text>
              </View>
              <View style={styles.detailChip}>
                <Text style={styles.detailLabel}>Planting date</Text>
                <Text style={styles.detailValue}>{field.plantingDate || "Not set"}</Text>
              </View>
              <View style={styles.detailChip}>
                <Text style={styles.detailLabel}>Expected harvest</Text>
                <Text style={styles.detailValue}>{field.expectedHarvest || "Not set"}</Text>
              </View>
              <View style={styles.detailChip}>
                <Text style={styles.detailLabel}>Variety</Text>
                <Text style={styles.detailValue}>{field.variety || "Not set"}</Text>
              </View>
              <View style={styles.detailChip}>
                <Text style={styles.detailLabel}>Crop age</Text>
                <Text style={styles.detailValue}>{field.daysAfterPlanting !== null ? `${field.daysAfterPlanting} days` : "Not set"}</Text>
              </View>
              <View style={styles.detailChip}>
                <Text style={styles.detailLabel}>Spent</Text>
                <Text style={styles.detailValue}>{currency.format(fieldSpend)}</Text>
              </View>
              <View style={styles.detailChip}>
                <Text style={styles.detailLabel}>Earned</Text>
                <Text style={styles.detailValue}>{currency.format(fieldRevenue)}</Text>
              </View>
            </View>

            <Text style={styles.detailSectionTitle}>Crop cycles</Text>
            {relatedCycles.length ? relatedCycles.map((cycle) => <CropCycleRow key={cycle.id} cycle={cycle} />) : <Text style={styles.detailEmptyText}>No crop cycles linked yet.</Text>}

            <Text style={styles.detailSectionTitle}>Recent records</Text>
            {relatedRecords.length ? relatedRecords.map((record) => <RecordRow key={record.id} record={record} />) : <Text style={styles.detailEmptyText}>No records linked yet.</Text>}

            <Text style={styles.detailSectionTitle}>Photos</Text>
            <View style={styles.photoGrid}>
              {relatedPhotos.length ? relatedPhotos.map((photo) => (
                <View key={photo.id} style={styles.photoCard}>
                  <Image source={{ uri: photo.uri }} style={styles.photoThumb} />
                  <Text style={styles.photoTag}>{photo.category}</Text>
                  <Text style={styles.photoCaption} numberOfLines={2}>{photo.caption || photo.field}</Text>
                </View>
              )) : <Text style={styles.detailEmptyText}>No photos linked yet.</Text>}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function FieldFormModal({
  visible,
  initialField,
  onClose,
  onSave
}: {
  visible: boolean;
  initialField?: CropField | null;
  onClose: () => void;
  onSave: (input: FieldInput) => void;
}) {
  const [field, setField] = useState("Field 6");
  const [cropId, setCropId] = useState("abe-chilli");
  const [area, setArea] = useState("1.0 ha");
  const [variety, setVariety] = useState(getCropById("abe-chilli").defaultVariety);
  const [plantingDate, setPlantingDate] = useState(toDateInputValue(new Date()));
  const [expectedHarvest, setExpectedHarvest] = useState(toDateInputValue(addDays(new Date(), getCropById("abe-chilli").practice.durationDays)));
  const [stage, setStage] = useState("Transplanting");
  const [status, setStatus] = useState<FieldStatus>("Good");
  const selectedCrop = getCropById(cropId);

  useEffect(() => {
    if (!visible) return;
    if (initialField) {
      const cropItem = getCropLibraryItem(initialField.crop);
      setField(initialField.field);
      setCropId(cropItem.id);
      setArea(initialField.area);
      setVariety(initialField.variety || cropItem.defaultVariety);
      setPlantingDate(initialField.plantingDate || toDateInputValue(new Date()));
      setExpectedHarvest(initialField.expectedHarvest || toDateInputValue(addDays(new Date(), cropItem.practice.durationDays)));
      setStage(initialField.stage || cropItem.practice.stages[0]?.name || "Active");
      setStatus(initialField.status);
      return;
    }

    const defaultCrop = getCropById("abe-chilli");
    const today = new Date();
    setField("Field 1");
    setCropId(defaultCrop.id);
    setArea(defaultCrop.defaultAreaUnit);
    setVariety(defaultCrop.defaultVariety);
    setPlantingDate(toDateInputValue(today));
    setExpectedHarvest(toDateInputValue(addDays(today, defaultCrop.practice.durationDays)));
    setStage("Transplanting");
    setStatus("Good");
  }, [initialField, visible]);

  function selectCrop(cropIdValue: string) {
    const crop = getCropById(cropIdValue);
    setCropId(crop.id);
    setVariety(crop.defaultVariety);
    setStage(crop.id === "abe-chilli" ? "Transplanting" : crop.practice.stages[0]?.name ?? "Active");
    const parsedPlanting = new Date(`${plantingDate}T00:00:00`);
    if (!Number.isNaN(parsedPlanting.getTime())) {
      setExpectedHarvest(toDateInputValue(addDays(parsedPlanting, crop.practice.durationDays)));
    }
  }

  function changePlantingDate(value: string) {
    setPlantingDate(value);
    const parsedPlanting = new Date(`${value}T00:00:00`);
    if (!Number.isNaN(parsedPlanting.getTime())) {
      setExpectedHarvest(toDateInputValue(addDays(parsedPlanting, selectedCrop.practice.durationDays)));
    }
  }

  function submit() {
    const normalizedField = field.trim();
    const normalizedCrop = selectedCrop.name;
    if (!normalizedField || !normalizedCrop) {
      Alert.alert("Missing details", "Field name and crop are required.");
      return;
    }

    if (!isDateInputValue(plantingDate) || !isDateInputValue(expectedHarvest)) {
      Alert.alert("Check dates", "Use dates like 2026-06-09 for planting and expected harvest.");
      return;
    }

    const numericProgress = calculateFormProgress(plantingDate, expectedHarvest, selectedCrop.practice.durationDays);
    onSave({
      field: normalizedField,
      crop: normalizedCrop,
      area: area.trim() || "0 ha",
      variety: variety.trim() || "Not set",
      plantingDate,
      expectedHarvest,
      stage: stage.trim() || "Active",
      progress: numericProgress,
      status,
      accent: selectedCrop.accent
    });
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.modalRoot}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetTitle}>{initialField ? "Edit field" : "Add field"}</Text>
              <Text style={styles.sheetSubtitle}>{initialField ? "Update crop dates and calendar guidance" : "Saved offline on this phone"}</Text>
            </View>
            <Pressable style={styles.closeButton} onPress={onClose} accessibilityRole="button" accessibilityLabel="Close field form">
              <Ionicons name="close" size={24} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <FormInput label="Field name" value={field} onChangeText={setField} placeholder="Block A" />
            <Text style={styles.formLabel}>Crop</Text>
            <View style={styles.typeGrid}>
              {cropLibrary.map((item) => (
                <Pressable key={item.id} style={[styles.typeOption, cropId === item.id && styles.typeOptionActive]} onPress={() => selectCrop(item.id)}>
                  <Text style={[styles.typeOptionText, cropId === item.id && styles.typeOptionTextActive]}>{item.displayName}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.formLabel}>Variety</Text>
            <View style={styles.typeGrid}>
              {selectedCrop.varieties.map((item) => (
                <Pressable key={item} style={[styles.typeOption, variety === item && styles.typeOptionActive]} onPress={() => setVariety(item)}>
                  <Text style={[styles.typeOptionText, variety === item && styles.typeOptionTextActive]}>{item}</Text>
                </Pressable>
              ))}
            </View>
            <FormInput label="Area" value={area} onChangeText={setArea} placeholder="0.5 ha" />
            <FormInput label={selectedCrop.dateLabel} value={plantingDate} onChangeText={changePlantingDate} placeholder="2026-06-09" />
            <FormInput label="Expected harvest date" value={expectedHarvest} onChangeText={setExpectedHarvest} placeholder="2026-10-07" />
            <FormInput label="Crop stage" value={stage} onChangeText={setStage} placeholder="Nursery, flowering, harvesting" />
            <View style={styles.blankSlateNotice}>
              <Ionicons name="calendar-outline" size={22} color={colors.green} />
              <Text style={styles.blankSlateText}>Progress will update automatically from these dates. You can still adjust the stage if the crop is ahead or behind.</Text>
            </View>

            <Text style={styles.formLabel}>Status</Text>
            <View style={styles.statusPicker}>
              {(["Healthy", "Good", "Watch"] as const).map((item) => (
                <Pressable key={item} style={[styles.statusOption, status === item && styles.statusOptionActive]} onPress={() => setStatus(item)}>
                  <Text style={[styles.statusOptionText, status === item && styles.statusOptionTextActive]}>{item}</Text>
                </Pressable>
              ))}
            </View>

            <Pressable style={styles.saveButton} onPress={submit}>
              <Text style={styles.saveButtonText}>{initialField ? "Save field changes" : "Save field offline"}</Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function RecordFormModal({
  visible,
  cropCycles,
  initialType,
  initialDate,
  onClose,
  onSave
}: {
  visible: boolean;
  cropCycles: CropCycle[];
  initialType: string;
  initialDate: string;
  onClose: () => void;
  onSave: (input: RecordInput) => void;
}) {
  const [recordType, setRecordType] = useState(initialType);
  const [cycleId, setCycleId] = useState(cropCycles[0]?.id ?? "");
  const [detail, setDetail] = useState("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState(initialDate);
  const [amount, setAmount] = useState("0");

  useEffect(() => {
    if (!visible) return;
    setRecordType(initialType);
    setCycleId(cropCycles[0]?.id ?? "");
    setDetail(defaultRecordDetail(initialType));
    setQuantity(defaultRecordQuantity(initialType));
    setDate(initialDate);
    setAmount(initialType === "Sale" ? "1200" : "0");
  }, [cropCycles, initialDate, initialType, visible]);

  function submit() {
    if (!cropCycles.length) {
      Alert.alert("Add a field first", "Records must be linked to a crop cycle.");
      return;
    }
    const selectedCycle = cropCycles.find((cycle) => cycle.id === cycleId) ?? cropCycles[0];
    const normalizedDetail = detail.trim();
    if (!recordType.trim() || !selectedCycle || !normalizedDetail) {
      Alert.alert("Missing details", "Record type, crop cycle, and details are required.");
      return;
    }
    if (!isDateInputValue(date)) {
      Alert.alert("Check date", "Use a date like 2026-06-09.");
      return;
    }
    onSave({
      type: recordType.trim(),
      field: selectedCycle.field,
      cropCycleId: selectedCycle.id,
      cropCycleName: selectedCycle.label,
      detail: normalizedDetail,
      quantity: quantity.trim(),
      date,
      amount: Number(amount) || 0,
      ...recordVisuals(recordType)
    });
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.modalRoot}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetTitle}>Add record</Text>
              <Text style={styles.sheetSubtitle}>Linked to a crop cycle and saved offline</Text>
            </View>
            <Pressable style={styles.closeButton} onPress={onClose} accessibilityRole="button" accessibilityLabel="Close record form">
              <Ionicons name="close" size={24} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Text style={styles.formLabel}>Record type</Text>
            <View style={styles.typeGrid}>
              {["Activity", "Planting", "Treatment", "Fertilizer", "Chemical", "Irrigation", "Expense", "Labor", "Harvest", "Sale", "Payment", "Restocking", "Problem"].map((item) => (
                <Pressable key={item} style={[styles.typeOption, recordType === item && styles.typeOptionActive]} onPress={() => setRecordType(item)}>
                  <Text style={[styles.typeOptionText, recordType === item && styles.typeOptionTextActive]}>{item}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.formLabel}>Crop cycle</Text>
            <View style={styles.typeGrid}>
              {cropCycles.map((item) => (
                <Pressable key={item.id} style={[styles.typeOption, cycleId === item.id && styles.typeOptionActive]} onPress={() => setCycleId(item.id)}>
                  <Text style={[styles.typeOptionText, cycleId === item.id && styles.typeOptionTextActive]}>{item.label}</Text>
                </Pressable>
              ))}
            </View>

            <FormInput label="Date" value={date} onChangeText={setDate} placeholder="2026-06-09" />
            <FormInput label="What happened or what was added" value={detail} onChangeText={setDetail} placeholder="Urea, pesticide spray, transplanting, buyer payment" />
            <FormInput label="Quantity or dosage" value={quantity} onChangeText={setQuantity} placeholder="50 kg, 200 ml/16 L, 2 hours, 4 workers" />
            <FormInput label={recordType === "Sale" ? "Revenue amount" : "Cost amount"} value={amount} onChangeText={setAmount} placeholder="0" keyboardType="numeric" />

            <Pressable style={styles.saveButton} onPress={submit}>
              <Text style={styles.saveButtonText}>Save record offline</Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function FormInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default"
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType?: "default" | "numeric";
}) {
  return (
    <View style={styles.formField}>
      <Text style={styles.formLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9aa4a0"
        keyboardType={keyboardType}
        style={styles.textInput}
      />
    </View>
  );
}

function ReportsScreen({ totals, fields, records, insights }: { totals: { revenue: number; expenses: number; profit: number }; fields: CropField[]; records: FarmRecord[]; insights: FarmInsight[] }) {
  const report = buildReportModel({ totals, fields, records, insights });
  const { shareReport, exportPdf, exportCsv } = createReportExportActions(report, {
    cacheDirectory: FileSystem.cacheDirectory,
    shareText: Share.share,
    printToFile: Print.printToFileAsync,
    isFileSharingAvailable: Sharing.isAvailableAsync,
    shareFile: Sharing.shareAsync,
    writeTextFile: FileSystem.writeAsStringAsync,
    alert: Alert.alert
  });

  return (
    <>
      <SectionHeader title="Reports" action="Share" onAction={shareReport} />
      <View style={styles.exportRow}>
        <Pressable style={styles.exportButton} onPress={exportPdf}>
          <Ionicons name="document-text-outline" size={20} color={colors.green} />
          <Text style={styles.exportButtonText}>PDF</Text>
        </Pressable>
        <Pressable style={styles.exportButton} onPress={exportCsv}>
          <Ionicons name="grid-outline" size={20} color={colors.green} />
          <Text style={styles.exportButtonText}>Excel CSV</Text>
        </Pressable>
      </View>
      <View style={styles.reportGrid}>
        {report.reportCards.map(([label, value, detail]) => (
          <View key={label} style={styles.reportCard}>
            <Text style={styles.metricLabel}>{label}</Text>
            <Text style={styles.reportValue}>{value}</Text>
            <Text style={styles.rowSub}>{detail}</Text>
          </View>
        ))}
      </View>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Agronomist summary</Text>
        <Text style={styles.summaryText}>{report.agronomistSummary}</Text>
      </View>
      <SectionHeader title="Benchmark Checks" />
      <View style={styles.listPanel}>{insights.map((insight, index) => <InsightRow key={insight.id} insight={insight} index={index} />)}</View>
    </>
  );
}

function PhotoFormModal({
  visible,
  fields,
  records,
  onClose,
  onSave
}: {
  visible: boolean;
  fields: CropField[];
  records: FarmRecord[];
  onClose: () => void;
  onSave: (input: PhotoInput) => void;
}) {
  const [field, setField] = useState(fields[0]?.field ?? "");
  const [category, setCategory] = useState<PhotoRecord["category"]>("Progress");
  const [recordId, setRecordId] = useState("");
  const [caption, setCaption] = useState("Crop progress photo");
  const [uri, setUri] = useState("");
  const linkableRecords = records.filter((record) => record.field === field && (category === "Problem" ? record.type === "Problem" : category === "Receipt" ? ["Expense", "Fertilizer", "Chemical", "Treatment", "Labor", "Sale"].includes(record.type) : true)).slice(0, 8);

  useEffect(() => {
    if (!visible) return;
    setField(fields[0]?.field ?? "");
    setCategory("Progress");
    setRecordId("");
    setCaption("Crop progress photo");
    setUri("");
  }, [fields, visible]);

  useEffect(() => {
    setRecordId("");
    if (category === "Problem") setCaption("Crop problem photo");
    if (category === "Receipt") setCaption("Receipt photo");
    if (category === "Progress") setCaption("Crop progress photo");
  }, [category, field]);

  async function pickPhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Allow photo access to attach crop and receipt photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.82
    });

    if (!result.canceled) {
      setUri(result.assets[0]?.uri ?? "");
    }
  }

  function submit() {
    if (!fields.length) {
      Alert.alert("Add a field first", "Photos must be linked to a field.");
      return;
    }
    if (!uri) {
      Alert.alert("Choose a photo", "Select a photo before saving.");
      return;
    }
    const linkedRecord = records.find((record) => record.id === recordId);
    onSave({
      field,
      category,
      recordId: linkedRecord?.id ?? null,
      recordLabel: linkedRecord ? `${linkedRecord.type} - ${linkedRecord.detail}` : null,
      uri,
      caption: caption.trim()
    });
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.modalRoot}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetTitle}>Add photo</Text>
              <Text style={styles.sheetSubtitle}>Crop progress, problems, receipts</Text>
            </View>
            <Pressable style={styles.closeButton} onPress={onClose} accessibilityRole="button" accessibilityLabel="Close photo form">
              <Ionicons name="close" size={24} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Pressable style={styles.photoPicker} onPress={pickPhoto}>
              {uri ? <Image source={{ uri }} style={styles.photoPreview} /> : <Ionicons name="image-outline" size={44} color={colors.green} />}
              <Text style={styles.photoPickerText}>{uri ? "Change photo" : "Choose photo"}</Text>
            </Pressable>

            <Text style={styles.formLabel}>Field</Text>
            <View style={styles.typeGrid}>
              {fields.map((item) => (
                <Pressable key={item.id} style={[styles.typeOption, field === item.field && styles.typeOptionActive]} onPress={() => setField(item.field)}>
                  <Text style={[styles.typeOptionText, field === item.field && styles.typeOptionTextActive]}>{item.field}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.formLabel}>Photo type</Text>
            <View style={styles.typeGrid}>
              {(["Progress", "Problem", "Receipt", "General"] as const).map((item) => (
                <Pressable key={item} style={[styles.typeOption, category === item && styles.typeOptionActive]} onPress={() => setCategory(item)}>
                  <Text style={[styles.typeOptionText, category === item && styles.typeOptionTextActive]}>{item}</Text>
                </Pressable>
              ))}
            </View>

            {category === "Problem" || category === "Receipt" ? (
              <>
                <Text style={styles.formLabel}>Link to record</Text>
                <View style={styles.typeGrid}>
                  {linkableRecords.length ? linkableRecords.map((item) => (
                    <Pressable key={item.id} style={[styles.typeOption, recordId === item.id && styles.typeOptionActive]} onPress={() => setRecordId(item.id)}>
                      <Text style={[styles.typeOptionText, recordId === item.id && styles.typeOptionTextActive]}>{item.type} - {item.detail}</Text>
                    </Pressable>
                  )) : (
                    <Text style={styles.detailEmptyText}>No matching records yet. You can save the photo without a link.</Text>
                  )}
                </View>
              </>
            ) : null}

            <FormInput label="Caption" value={caption} onChangeText={setCaption} placeholder="Receipt, aphid damage, flowering progress" />

            <Pressable style={styles.saveButton} onPress={submit}>
              <Text style={styles.saveButtonText}>Save photo offline</Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function MoreScreen({ photos, profile, onEditProfile }: { photos: PhotoRecord[]; profile: UserProfile | null; onEditProfile: () => void }) {
  const settings = [
    ["Inventory", "Fertilizer, chemicals, seed, tools, fuel", "cube-outline"],
    ["Suppliers", "Shops, contacts, prices, receipts", "storefront-outline"],
    ["Photo records", "Crop progress, pests, receipts", "camera-outline"],
    ["Offline sync", "SQLite and cloud sync planned next", "sync-outline"]
  ] as const;
  return (
    <>
      <SectionHeader title="More" />
      <View style={styles.profileCard}>
        <View style={styles.profileAvatar}>
          <Ionicons name="person-outline" size={28} color="#ffffff" />
        </View>
        <View style={styles.flex}>
          <Text style={styles.profileName}>{profile?.farmerName || "Farmer profile"}</Text>
          <Text style={styles.profileFarm}>{profile?.farmName || "Set up your farm"}</Text>
          <Text style={styles.rowSub}>{profile?.location || "Add your location for reports and reminders"}</Text>
        </View>
        <Pressable style={styles.profileEditButton} onPress={onEditProfile} accessibilityRole="button" accessibilityLabel="Edit farm profile">
          <Ionicons name="create-outline" size={21} color={colors.green} />
        </Pressable>
      </View>
      <View style={styles.listPanel}>
        {settings.map(([title, detail, iconName]) => (
          <Pressable key={title} style={styles.settingRow}>
            <Ionicons name={iconName} size={25} color={colors.green} />
            <View style={styles.flex}>
              <Text style={styles.rowTitle}>{title}</Text>
              <Text style={styles.rowSub}>{detail}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9aa4a0" />
          </Pressable>
        ))}
      </View>
      <SectionHeader title="Recent Photos" />
      <View style={styles.photoGrid}>
        {photos.length ? (
          photos.slice(0, 6).map((photo) => (
            <View key={photo.id} style={styles.photoCard}>
              <Image source={{ uri: photo.uri }} style={styles.photoThumb} />
              <Text style={styles.photoTag}>{photo.category}</Text>
              <Text style={styles.photoCaption} numberOfLines={2}>{photo.caption || photo.field}</Text>
            </View>
          ))
        ) : (
          <View style={styles.photoEmpty}>
            <Ionicons name="camera-outline" size={32} color={colors.green} />
            <Text style={styles.emptyTitle}>No photos yet</Text>
            <Text style={styles.emptyText}>Use the Photo quick action to attach crop progress or receipt photos.</Text>
          </View>
        )}
      </View>
    </>
  );
}

function ProfileSetupModal({
  visible,
  profile,
  resetFarmOnSave,
  onClose,
  onSave
}: {
  visible: boolean;
  profile: UserProfile | null;
  resetFarmOnSave: boolean;
  onClose: () => void;
  onSave: (input: UserProfileInput) => void;
}) {
  const [farmerName, setFarmerName] = useState(profile?.farmerName ?? "");
  const [farmName, setFarmName] = useState(profile?.farmName ?? "");
  const [location, setLocation] = useState(profile?.location ?? "");
  const walkthrough = [
    ["layers-outline", "Create fields", "Add each plot and crop cycle when you start planting."],
    ["clipboard-outline", "Record work", "Save inputs, labour, harvests, sales, photos, and reminders offline."],
    ["bar-chart-outline", "Track profit", "Expenses and sales feed the reports automatically."]
  ] as const;

  useEffect(() => {
    if (!visible) return;
    setFarmerName(profile?.farmerName ?? "");
    setFarmName(profile?.farmName ?? "");
    setLocation(profile?.location ?? "");
  }, [profile, visible]);

  function submit() {
    const cleanedFarmer = farmerName.trim();
    const cleanedFarm = farmName.trim();
    const cleanedLocation = location.trim();
    if (!cleanedFarmer || !cleanedFarm) {
      Alert.alert("Profile needed", "Add your name and farm name to start with a blank farm.");
      return;
    }
    onSave({
      farmerName: cleanedFarmer,
      farmName: cleanedFarm,
      location: cleanedLocation || "Location not set"
    });
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.modalRoot}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.profileSetupHeader}>
            <MasonaLogo size={58} />
            <View style={styles.flex}>
              <Text style={styles.sheetTitle}>{resetFarmOnSave ? "Set up Masona Farms" : "Edit profile"}</Text>
              <Text style={styles.sheetSubtitle}>{resetFarmOnSave ? "Start clean, then add your real farm records." : "Keep reports tied to the right farmer and farm."}</Text>
            </View>
            {!resetFarmOnSave ? (
              <Pressable style={styles.closeButton} onPress={onClose} accessibilityRole="button" accessibilityLabel="Close profile form">
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            ) : null}
          </View>

          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View style={styles.walkthroughGrid}>
              {walkthrough.map(([icon, title, detail]) => (
                <View key={title} style={styles.walkthroughCard}>
                  <View style={styles.walkthroughIcon}>
                    <Ionicons name={icon} size={21} color={colors.green} />
                  </View>
                  <Text style={styles.walkthroughTitle}>{title}</Text>
                  <Text style={styles.walkthroughText}>{detail}</Text>
                </View>
              ))}
            </View>

            <FormInput label="Your name" value={farmerName} onChangeText={setFarmerName} placeholder="Mason Phiri" />
            <FormInput label="Farm name" value={farmName} onChangeText={setFarmName} placeholder="Masona Farms" />
            <FormInput label="Location" value={location} onChangeText={setLocation} placeholder="Chisamba, Central Province" />

            {resetFarmOnSave ? (
              <View style={styles.blankSlateNotice}>
                <Ionicons name="sparkles-outline" size={22} color={colors.green} />
                <Text style={styles.blankSlateText}>This will clear starter/demo records on this phone so your first field starts from zero.</Text>
              </View>
            ) : null}

            <Pressable style={styles.saveButton} onPress={submit}>
              <Text style={styles.saveButtonText}>{resetFarmOnSave ? "Start blank farm" : "Save profile"}</Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function cropIcon(crop: string): keyof typeof MaterialCommunityIcons.glyphMap {
  const normalized = crop.toLowerCase();
  if (normalized.includes("maize")) return "corn";
  if (normalized.includes("onion")) return "food-apple-outline";
  if (normalized.includes("chilli") || normalized.includes("chili") || normalized.includes("abe")) return "chili-mild";
  if (normalized.includes("soy")) return "seed-outline";
  return "fruit-cherries";
}

function cropAccent(crop: string) {
  return getCropLibraryItem(crop).accent;
}

function buildFilterCounts(records: FarmRecord[]) {
  return {
    All: records.length,
    Fertilizer: records.filter((record) => record.type === "Fertilizer" || record.type.includes("Fertilizer")).length,
    Irrigation: records.filter((record) => record.type === "Irrigation").length,
    Labor: records.filter((record) => record.type === "Labor").length,
    Sale: records.filter((record) => record.type === "Sale").length
  };
}

function buildMonthCalendarDays(monthDate: Date, events: FarmCalendarEvent[], today: string, selectedDate: string) {
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const mondayStartOffset = (firstDay.getDay() + 6) % 7;
  const gridStart = addDays(firstDay, -mondayStartOffset);
  const eventCounts = events.reduce((map, event) => {
    map.set(event.date, (map.get(event.date) ?? 0) + 1);
    return map;
  }, new Map<string, number>());

  return Array.from({ length: 42 }, (_, index) => {
    const date = addDays(gridStart, index);
    const value = toDateInputValue(date);
    const count = eventCounts.get(value) ?? 0;
    return {
      date: value,
      day: String(date.getDate()),
      count,
      inMonth: date.getMonth() === monthDate.getMonth(),
      isToday: value === today,
      selected: value === selectedDate
    };
  });
}

function formatCalendarHeading(date: string) {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return "Selected Day";
  return parsed.toLocaleDateString("en", { weekday: "long", day: "numeric", month: "short" });
}

function isDateInputValue(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00`));
}

function calculateFormProgress(plantingDate: string, expectedHarvest: string, fallbackDuration: number) {
  const start = new Date(`${plantingDate}T00:00:00`);
  const harvest = new Date(`${expectedHarvest}T00:00:00`);
  const today = new Date();
  const duration = Number.isNaN(harvest.getTime()) ? fallbackDuration : Math.max(1, Math.round((harvest.getTime() - start.getTime()) / 86400000));
  const days = Math.max(0, Math.round((today.getTime() - start.getTime()) / 86400000));
  return Math.max(0, Math.min(100, Math.round((days / duration) * 100)));
}

function parseDateInputValue(value: string) {
  if (!isDateInputValue(value)) return null;
  return new Date(`${value}T00:00:00`);
}

function dateAtHour(date: Date, hour: number) {
  const reminder = new Date(date);
  reminder.setHours(hour, 0, 0, 0);
  return reminder;
}

function buildUpcomingActivityReminderDate(recordDate: Date) {
  const today = new Date();
  const recordStart = new Date(recordDate.getFullYear(), recordDate.getMonth(), recordDate.getDate()).getTime();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  if (recordStart <= todayStart) return null;
  const dayBefore = addDays(recordDate, -1);
  const reminderDate = dateAtHour(dayBefore, 8);
  if (reminderDate.getTime() <= Date.now()) return dateAtHour(recordDate, 8);
  return reminderDate;
}

function defaultRecordDetail(type: string) {
  if (type === "Planting") return "Planting or transplanting completed";
  if (type === "Treatment") return "Field treatment applied";
  if (type === "Fertilizer") return "Urea - 50 kg";
  if (type === "Chemical") return "Pest spray applied";
  if (type === "Irrigation") return "Drip irrigation";
  if (type === "Expense") return "Farm input purchase";
  if (type === "Labor") return "Manual field work";
  if (type === "Harvest") return "Harvested crop quantity";
  if (type === "Sale") return "Crop sale";
  if (type === "Payment") return "Buyer payment collection";
  if (type === "Restocking") return "Input restocking";
  if (type === "Problem") return "Crop problem observed";
  return "Farm activity";
}

function defaultRecordQuantity(type: string) {
  if (type === "Planting") return "Seedlings planted";
  if (type === "Treatment") return "Dosage not set";
  if (type === "Fertilizer") return "50 kg";
  if (type === "Chemical") return "200 ml/16 L";
  if (type === "Irrigation") return "2 hours";
  if (type === "Labor") return "1 worker";
  if (type === "Harvest") return "0 kg";
  if (type === "Sale") return "0 kg";
  if (type === "Payment") return "Amount due";
  if (type === "Restocking") return "Quantity needed";
  return "";
}

function recordVisuals(type: string): Pick<RecordInput, "icon" | "tone"> {
  if (type === "Irrigation") return { icon: "water-outline", tone: "blue" };
  if (type === "Expense" || type === "Sale" || type === "Payment" || type === "Restocking") return { icon: "briefcase-outline", tone: "amber" };
  if (type === "Chemical" || type === "Treatment") return { icon: "flask-outline", tone: "amber" };
  if (type === "Planting" || type === "Labor" || type === "Harvest" || type === "Problem") return { icon: "leaf-outline", tone: "green" };
  return { icon: "checkbox-outline", tone: "green" };
}

function buildReminderTitle(input: RecordInput) {
  if (input.type === "Irrigation") return `Watering due - ${input.cropCycleName}`;
  if (input.type === "Harvest") return `Harvest due - ${input.cropCycleName}`;
  if (input.type === "Payment" || input.type === "Sale") return `Payment follow-up - ${input.cropCycleName}`;
  if (input.type === "Restocking") return `Restocking due - ${input.cropCycleName}`;
  return `${input.type} due - ${input.cropCycleName}`;
}

function formatToday() {
  return new Intl.DateTimeFormat("en-ZM", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date());
}

export default function App() {
  return (
    <SafeAreaProvider>
      <MasonaApp />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.header
  },
  app: {
    flex: 1,
    backgroundColor: colors.canvas
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 72,
    overflow: "hidden",
    backgroundColor: colors.header
  },
  headerWash: {
    position: "absolute",
    right: -70,
    top: -90,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(23, 159, 103, 0.42)"
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md
  },
  logoMark: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5
  },
  logoFieldLine: {
    position: "absolute",
    left: 14,
    right: 14,
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(7, 148, 95, 0.18)"
  },
  logoFieldLineTop: {
    bottom: 18,
    transform: [{ rotate: "-12deg" }]
  },
  logoFieldLineBottom: {
    bottom: 12,
    transform: [{ rotate: "-12deg" }]
  },
  logoSun: {
    position: "absolute",
    right: 14,
    top: 14,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.amber
  },
  brandCopy: {
    flex: 1,
    minWidth: 0
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs
  },
  appTitle: {
    color: "#ffffff",
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800"
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4
  },
  locationText: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 14,
    fontWeight: "600"
  },
  headerTools: {
    alignItems: "flex-end",
    gap: spacing.sm
  },
  offlineBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  offlineText: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 13,
    fontWeight: "700"
  },
  syncDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2fd0dc"
  },
  bellButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.12)"
  },
  badge: {
    position: "absolute",
    top: 2,
    right: 0,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.red
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "900"
  },
  content: {
    flex: 1,
    marginTop: -50,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: colors.canvas
  },
  contentInner: {
    padding: spacing.md
  },
  metricsPanel: {
    flexDirection: "row",
    minHeight: 150,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4
  },
  metricCell: {
    flex: 1,
    paddingHorizontal: spacing.sm
  },
  metricDivider: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: colors.line
  },
  metricIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
    backgroundColor: colors.mint
  },
  metricIconTeal: {
    backgroundColor: "#e3f6f8"
  },
  metricIconRed: {
    backgroundColor: colors.redSoft
  },
  metricLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700"
  },
  metricValue: {
    marginTop: 8,
    color: colors.text,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "900"
  },
  metricDelta: {
    marginTop: 8,
    color: colors.green,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "800"
  },
  metricDeltaRed: {
    color: colors.red
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
    marginTop: spacing.sm
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 23,
    lineHeight: 29,
    fontWeight: "900"
  },
  sectionAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2
  },
  sectionActionText: {
    color: colors.green,
    fontSize: 15,
    fontWeight: "900"
  },
  sectionActionRed: {
    color: colors.red
  },
  fieldPanel: {
    overflow: "hidden",
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3
  },
  fieldRow: {
    minHeight: 94,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line
  },
  cropThumb: {
    width: 78,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center"
  },
  fieldBody: {
    flex: 1,
    paddingHorizontal: spacing.md,
    minWidth: 0
  },
  fieldTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm
  },
  fieldTitle: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    fontWeight: "900"
  },
  statusChip: {
    minWidth: 72,
    height: 30,
    borderRadius: radii.xs,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm
  },
  statusGood: {
    backgroundColor: colors.mint
  },
  statusWatch: {
    backgroundColor: colors.amberSoft
  },
  statusText: {
    color: colors.greenDark,
    fontSize: 12,
    fontWeight: "900"
  },
  statusTextWatch: {
    color: colors.amber
  },
  fieldMeta: {
    marginTop: 5,
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700"
  },
  progressTrack: {
    height: 6,
    marginTop: spacing.sm,
    overflow: "hidden",
    borderRadius: 3,
    backgroundColor: "#e9eeec"
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.green
  },
  progressText: {
    width: 44,
    color: colors.green,
    fontSize: 18,
    fontWeight: "900",
    textAlign: "right"
  },
  listPanel: {
    overflow: "hidden",
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3
  },
  reminderRow: {
    minHeight: 70,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line
  },
  reminderIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.xs,
    alignItems: "center",
    justifyContent: "center"
  },
  reminderIconRed: {
    backgroundColor: colors.red
  },
  reminderIconAmber: {
    backgroundColor: colors.amber
  },
  flex: {
    flex: 1,
    minWidth: 0
  },
  rowTitle: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "900"
  },
  rowSub: {
    marginTop: 2,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600"
  },
  dueText: {
    fontSize: 13,
    fontWeight: "900"
  },
  dueRed: {
    color: colors.red
  },
  dueAmber: {
    color: colors.amber
  },
  alertDot: {
    width: 9,
    height: 9,
    borderRadius: 5
  },
  alertDotRed: {
    backgroundColor: colors.red
  },
  alertDotAmber: {
    backgroundColor: colors.amber
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.sm
  },
  quickAction: {
    width: "31.8%",
    minHeight: 92,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 7 },
    elevation: 3
  },
  quickActionPressable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.sm,
    borderRadius: radii.md
  },
  quickText: {
    marginTop: spacing.sm,
    color: colors.text,
    fontSize: 12,
    fontWeight: "800",
    textAlign: "center"
  },
  recordRow: {
    minHeight: 74,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line
  },
  recordRowExpanded: {
    backgroundColor: colors.surfaceSoft
  },
  recordDetailPanel: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
    backgroundColor: colors.surface
  },
  recordIcon: {
    width: 42,
    height: 42,
    borderRadius: radii.xs,
    alignItems: "center",
    justifyContent: "center"
  },
  recordIconGreen: {
    backgroundColor: colors.mint
  },
  recordIconBlue: {
    backgroundColor: colors.blueSoft
  },
  recordIconAmber: {
    backgroundColor: colors.amberSoft
  },
  recordAmount: {
    alignItems: "flex-end"
  },
  recordDate: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700"
  },
  amountText: {
    marginTop: 6,
    color: colors.text,
    fontSize: 15,
    fontWeight: "900"
  },
  deleteRecordButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 19,
    backgroundColor: colors.redSoft
  },
  detailSectionTitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    color: colors.text,
    fontSize: 17,
    fontWeight: "900"
  },
  detailGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  detailChip: {
    width: "48%",
    minHeight: 66,
    justifyContent: "center",
    padding: spacing.md,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.line
  },
  detailLabel: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800"
  },
  detailValue: {
    marginTop: 3,
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "900"
  },
  detailEmptyText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700"
  },
  segmentRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md
  },
  segment: {
    height: 38,
    minWidth: 66,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    borderRadius: radii.xs,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line
  },
  segmentActive: {
    backgroundColor: colors.green,
    borderColor: colors.green
  },
  segmentText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "900"
  },
  segmentTextActive: {
    color: "#ffffff"
  },
  calendarStrip: {
    gap: spacing.sm,
    paddingBottom: spacing.md
  },
  calendarJumpCard: {
    minHeight: 74,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 7 },
    elevation: 3
  },
  calendarJumpInput: {
    width: 118,
    minHeight: 44,
    paddingHorizontal: spacing.sm,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.xs,
    backgroundColor: colors.surfaceSoft,
    fontSize: 13,
    fontWeight: "800"
  },
  calendarGoButton: {
    minWidth: 48,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.xs,
    backgroundColor: colors.green
  },
  calendarGoText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "900"
  },
  calendarDay: {
    width: 92,
    minHeight: 96,
    justifyContent: "center",
    padding: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface
  },
  calendarDayActive: {
    borderColor: colors.green,
    backgroundColor: colors.green
  },
  calendarMonth: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  calendarDate: {
    marginTop: 2,
    color: colors.text,
    fontSize: 30,
    lineHeight: 35,
    fontWeight: "900"
  },
  calendarCount: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "800"
  },
  calendarTextActive: {
    color: "#ffffff"
  },
  monthPanel: {
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 7 },
    elevation: 3
  },
  monthHeader: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm
  },
  monthTitle: {
    color: colors.text,
    fontSize: 19,
    lineHeight: 24,
    fontWeight: "900"
  },
  monthNavButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 21,
    backgroundColor: colors.mint
  },
  weekHeader: {
    flexDirection: "row",
    marginBottom: spacing.xs
  },
  weekHeaderText: {
    flex: 1,
    color: colors.muted,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "900",
    textAlign: "center"
  },
  monthGrid: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  monthDay: {
    width: "14.285%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.xs,
    borderWidth: 1,
    borderColor: "transparent"
  },
  monthDayMuted: {
    opacity: 0.38
  },
  monthDayToday: {
    borderColor: colors.green
  },
  monthDayActive: {
    backgroundColor: colors.green,
    borderColor: colors.green
  },
  monthDayNumber: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "900"
  },
  monthDayNumberMuted: {
    color: colors.muted
  },
  monthDayNumberActive: {
    color: "#ffffff"
  },
  monthDotRow: {
    height: 8,
    flexDirection: "row",
    gap: 2,
    marginTop: 3
  },
  monthDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.amber
  },
  monthDotActive: {
    backgroundColor: "#ffffff"
  },
  backfillStrip: {
    gap: spacing.sm,
    paddingBottom: spacing.md
  },
  backfillChip: {
    minHeight: 40,
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    borderRadius: radii.xs,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface
  },
  backfillChipText: {
    color: colors.greenDark,
    fontSize: 13,
    fontWeight: "900"
  },
  reportGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  exportRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md
  },
  exportButton: {
    flex: 1,
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface
  },
  exportButtonText: {
    color: colors.greenDark,
    fontSize: 14,
    fontWeight: "900"
  },
  reportCard: {
    width: "48.6%",
    minHeight: 116,
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 7 },
    elevation: 3
  },
  reportValue: {
    marginTop: spacing.sm,
    color: colors.text,
    fontSize: 20,
    fontWeight: "900"
  },
  summaryCard: {
    marginTop: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 7 },
    elevation: 3
  },
  summaryTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900"
  },
  summaryText: {
    marginTop: spacing.sm,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600"
  },
  profileCard: {
    minHeight: 118,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.green
  },
  profileName: {
    color: colors.text,
    fontSize: 18,
    lineHeight: 23,
    fontWeight: "900"
  },
  profileFarm: {
    marginTop: 3,
    color: colors.greenDark,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "900"
  },
  profileEditButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.mint
  },
  insightIcon: {
    width: 42,
    height: 42,
    borderRadius: radii.xs,
    alignItems: "center",
    justifyContent: "center"
  },
  settingRow: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line
  },
  cropCycleRow: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line
  },
  cropCycleIcon: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.xs,
    backgroundColor: colors.mint
  },
  cropCycleBadge: {
    minHeight: 30,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
    borderRadius: radii.xs,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.line
  },
  cropCycleBadgeText: {
    color: colors.green,
    fontSize: 12,
    fontWeight: "900"
  },
  fab: {
    position: "absolute",
    right: spacing.xl,
    width: 66,
    height: 66,
    borderRadius: 33,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.green,
    shadowColor: "#000",
    shadowOpacity: 0.28,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 9 },
    elevation: 8
  },
  tabBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 78,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 8,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
    ...Platform.select({
      android: { elevation: 16 },
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: -8 }
      }
    })
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4
  },
  tabText: {
    color: "#64716a",
    fontSize: 12,
    fontWeight: "800"
  },
  tabTextActive: {
    color: colors.green
  },
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end"
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 24, 17, 0.42)"
  },
  sheet: {
    maxHeight: "88%",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: colors.surface,
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -10 },
    elevation: 14
  },
  sheetHandle: {
    alignSelf: "center",
    width: 44,
    height: 5,
    borderRadius: 3,
    marginBottom: spacing.md,
    backgroundColor: "#d5ddd9"
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg
  },
  sheetActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  sheetTitle: {
    color: colors.text,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "900"
  },
  sheetSubtitle: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 14,
    fontWeight: "700"
  },
  profileSetupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.lg
  },
  closeButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceSoft
  },
  formField: {
    marginBottom: spacing.md
  },
  formLabel: {
    marginBottom: spacing.xs,
    color: colors.text,
    fontSize: 13,
    fontWeight: "900"
  },
  textInput: {
    minHeight: 52,
    paddingHorizontal: spacing.md,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceSoft,
    fontSize: 16,
    fontWeight: "700"
  },
  statusPicker: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.lg
  },
  statusOption: {
    flex: 1,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceSoft
  },
  statusOptionActive: {
    borderColor: colors.green,
    backgroundColor: colors.mint
  },
  statusOptionText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "900"
  },
  statusOptionTextActive: {
    color: colors.greenDark
  },
  saveButton: {
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.md,
    backgroundColor: colors.green,
    shadowColor: colors.green,
    shadowOpacity: 0.24,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900"
  },
  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.md
  },
  typeOption: {
    minHeight: 40,
    minWidth: "30%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.xs,
    backgroundColor: colors.surfaceSoft
  },
  typeOptionActive: {
    borderColor: colors.green,
    backgroundColor: colors.mint
  },
  typeOptionText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "900"
  },
  typeOptionTextActive: {
    color: colors.greenDark
  },
  walkthroughGrid: {
    gap: spacing.sm,
    marginBottom: spacing.lg
  },
  walkthroughCard: {
    minHeight: 78,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.line
  },
  walkthroughIcon: {
    width: 42,
    height: 42,
    borderRadius: radii.xs,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.mint
  },
  walkthroughTitle: {
    width: 86,
    color: colors.text,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "900"
  },
  walkthroughText: {
    flex: 1,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700"
  },
  blankSlateNotice: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: radii.sm,
    backgroundColor: colors.mint
  },
  blankSlateText: {
    flex: 1,
    color: colors.greenDark,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "800"
  },
  emptyState: {
    minHeight: 120,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900"
  },
  emptyText: {
    marginTop: spacing.xs,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
    textAlign: "center"
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.md
  },
  photoCard: {
    width: "31.8%",
    overflow: "hidden",
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 7 },
    elevation: 3
  },
  photoThumb: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: colors.surfaceSoft
  },
  photoTag: {
    marginTop: spacing.xs,
    marginHorizontal: spacing.sm,
    alignSelf: "flex-start",
    paddingHorizontal: spacing.xs,
    paddingVertical: 3,
    overflow: "hidden",
    borderRadius: 6,
    color: colors.greenDark,
    backgroundColor: colors.mint,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: "900"
  },
  photoCaption: {
    minHeight: 42,
    padding: spacing.sm,
    color: colors.text,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800"
  },
  photoEmpty: {
    width: "100%",
    minHeight: 150,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
    borderRadius: radii.md,
    backgroundColor: colors.surface
  },
  photoPicker: {
    minHeight: 176,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceSoft
  },
  photoPreview: {
    position: "absolute",
    width: "100%",
    height: "100%"
  },
  photoPickerText: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    overflow: "hidden",
    borderRadius: radii.xs,
    color: "#ffffff",
    backgroundColor: "rgba(6, 69, 45, 0.78)",
    fontSize: 14,
    fontWeight: "900"
  }
});

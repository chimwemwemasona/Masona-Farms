import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true
  })
});

export async function ensureNotificationPermissions() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("farm-reminders", {
      name: "Farm reminders",
      importance: Notifications.AndroidImportance.DEFAULT
    });
  }

  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export async function scheduleFarmReminder(title: string, body: string, date: Date) {
  const granted = await ensureNotificationPermissions();
  if (!granted) return undefined;

  const triggerDate = date.getTime() > Date.now() ? date : new Date(Date.now() + 60 * 1000);
  return Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
      channelId: "farm-reminders"
    }
  });
}

export function nextMorningDate(daysFromNow: number) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(8, 0, 0, 0);
  return date;
}

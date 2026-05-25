interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export const useNotifications = () => {
  const config = useRuntimeConfig();
  const { addToast } = useToasts();
  const { getAuthHeaders } = useAuth();

  const notifications = useState<Notification[]>('notifications', () => []);
  const unreadCount = computed(() => notifications.value.length);
  const loading = ref(false);
  const isFirstFetch = ref(true);

  const fetchNotifications = async () => {
    loading.value = true;
    try {
      const data = await $fetch<Notification[]>(`${config.public.apiUrl}/notifications`, {
        headers: getAuthHeaders(),
      });

      if (!isFirstFetch.value) {
        const currentIds = new Set(notifications.value.map(n => n.id));
        const newNotifications = data.filter(n => !currentIds.has(n.id));
        newNotifications.forEach(n => {
          addToast(n.title, n.message, n.type.toLowerCase());
        });
      }

      isFirstFetch.value = false;
      notifications.value = data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      loading.value = false;
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await $fetch(`${config.public.apiUrl}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      notifications.value = notifications.value.filter(n => n.id !== id);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await $fetch(`${config.public.apiUrl}/notifications/read-all`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      notifications.value = [];
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  let interval: ReturnType<typeof setInterval> | null = null;

  const startPolling = (ms = 30000) => {
    if (interval) return;
    fetchNotifications();
    interval = setInterval(fetchNotifications, ms);
  };

  const stopPolling = () => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    startPolling,
    stopPolling,
  };
};

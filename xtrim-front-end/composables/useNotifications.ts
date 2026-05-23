export const useNotifications = () => {
  const config = useRuntimeConfig();
  const { addToast } = useToasts();
  const notifications = useState('notifications', () => []);
  const unreadCount = computed(() => notifications.value.length);
  const loading = ref(false);

  const fetchNotifications = async () => {
    loading.value = true;
    try {
      const data = await $fetch(`${config.public.apiUrl}/notifications`);
      
      // Identify new notifications to show toast
      const currentIds = new Set(notifications.value.map(n => n.id));
      const newNotifications = data.filter(n => !currentIds.has(n.id));
      
      newNotifications.forEach(n => {
        addToast(n.title, n.message, n.type.toLowerCase());
      });

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
        method: 'PATCH'
      });
      notifications.value = notifications.value.filter(n => n.id !== id);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await $fetch(`${config.public.apiUrl}/notifications/read-all`, {
        method: 'PATCH'
      });
      notifications.value = [];
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Start polling
  let interval: any = null;
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
    stopPolling
  };
};

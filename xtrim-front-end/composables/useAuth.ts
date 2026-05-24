export const useAuth = () => {
  const config = useRuntimeConfig();
  const token = useCookie('auth_token', { maxAge: 60 * 60 * 8 }); // 8h

  const login = async (username: string, password: string): Promise<void> => {
    const data = await $fetch<{ token: string }>(`${config.public.apiUrl}/auth/login`, {
      method: 'POST',
      body: { username, password },
    });
    token.value = data.token;
  };

  const logout = () => {
    token.value = null;
    navigateTo('/login');
  };

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${token.value}`,
  });

  const isAuthenticated = computed(() => !!token.value);

  return { login, logout, getAuthHeaders, isAuthenticated, token };
};

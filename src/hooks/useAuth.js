import { useAuthContext } from '../store/authStore';

/**
 * useAuth — convenience hook that surfaces the auth context.
 * Import this in any component instead of useAuthContext directly.
 */
export function useAuth() {
  return useAuthContext();
}

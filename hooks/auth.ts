import { useMutation } from "@tanstack/react-query";
import { signIn } from "@/api/auth/auth";
import { ClientSignIn } from "@/types/api/auth";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useUserStore } from "@/stores/user";
import { useRouter } from "next/navigation";

export const useSignIn = () => {
  const t = useTranslations("auth.messages");
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ClientSignIn) => signIn(data),
    onSuccess: (response) => {
      if (response.success && response.data?.accessToken) {
        setUser(response.data.user, response.data.accessToken, response.data.refreshToken);
        toast.success(t("loginSuccess") || "Login successful");
        router.push("/");
      } else {
        toast.error(response.message || t("loginError") || "Login failed");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || t("loginError") || "Login failed");
    },
  });
};

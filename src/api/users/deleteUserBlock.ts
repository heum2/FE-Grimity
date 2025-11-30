import { useMutation } from "@tanstack/react-query";

import axiosInstance from "@/constants/baseurl";

import { useToast } from "@/hooks/useToast";

export const deleteUserBlock = ({ id }: { id: string }): Promise<void> => {
  return axiosInstance.delete(`/users/${id}/block`);
};

export const useDeleteUserBlock = () => {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: deleteUserBlock,
    onSuccess: () => {
      showToast("차단 해제되었습니다.", "success");
    },
  });
};

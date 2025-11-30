import { useMutation } from "@tanstack/react-query";

import axiosInstance from "@/constants/baseurl";

import { useToast } from "@/hooks/useToast";

export const putUserBlock = ({ id }: { id: string }): Promise<void> => {
  return axiosInstance.put(`/users/${id}/block`);
};

export const usePutUserBlock = () => {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: putUserBlock,
    onSuccess: () => {
      showToast("차단되었습니다.", "success");
    },
  });
};

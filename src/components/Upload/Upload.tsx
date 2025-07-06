import { useState } from "react";
import FeedConfirm from "@/components/Modal/FeedConfirm";
import FeedForm from "@/components/Upload/FeedForm/FeedForm";

import { useModal } from "@/hooks/useModal";

import type { CreateFeedRequest } from "@grimity/dto";

export default function Upload() {
  const { openModal } = useModal();
  const [formHandlers, setFormHandlers] = useState<{ resetUnsavedChanges: () => void } | null>(
    null,
  );

  const handleSubmit = (data: CreateFeedRequest) => {
    openModal((close) => (
      <FeedConfirm
        isEditMode={false}
        data={data}
        close={close}
        onSuccessCallback={() => formHandlers?.resetUnsavedChanges()}
      />
    ));
  };

  return <FeedForm isEditMode={false} onSubmit={handleSubmit} onStateUpdate={setFormHandlers} />;
}

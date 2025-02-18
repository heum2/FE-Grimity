import React, { useState } from "react";
import { useToast } from "@/hooks/useToast";
import styles from "./Report.module.scss";
import { modalState } from "@/states/modalState";
import { useRecoilState } from "recoil";
import Button from "@/components/Button/Button";
import { useRouter } from "next/router";
import { ReportProps } from "./Report.types";
import { postReports } from "@/api/reports/postReports";

export default function Report({ refType, refId }: ReportProps) {
  const { showToast } = useToast();
  const [, setModal] = useRecoilState(modalState);
  const [reason, setReason] = useState("1");
  const [details, setDetails] = useState("");

  const handleSubmit = () => {
    if (!reason) {
      showToast("신고 사유를 선택해주세요.", "error");
      return;
    }

    setModal({
      isOpen: true,
      type: null,
      data: {
        title: "신고하시겠어요?",
        subtitle: "신고 접수 후에는 취소가 어려워요.",
        confirmBtn: "신고하기",
        onClick: async () => {
          try {
            const response = await postReports({
              type: parseInt(reason),
              refType,
              refId,
              content: details || undefined,
            });
            if (response) {
              showToast("신고가 접수되었어요.", "success");
            }
          } catch (err) {
            showToast("신고 중 오류가 발생했습니다.", "error");
          }
        },
      },
      isComfirm: true,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>신고하기</div>
      <div className={styles.typeContainer}>
        <div className={styles.message}>
          신고 사유를 선택해주세요 <p className={styles.op1}>(필수)</p>
        </div>
        <section className={styles.options}>
          {[
            { label: "사칭계정", value: "1" },
            { label: "스팸/도배", value: "2" },
            { label: "욕설/비방", value: "3" },
            { label: "부적절한 프로필", value: "4" },
            { label: "선정적인 컨텐츠", value: "5" },
            { label: "기타", value: "0" },
          ].map((option) => (
            <label key={option.value} className={styles.radioLabel}>
              <input
                type="radio"
                name="reason"
                value={option.value}
                checked={reason === option.value}
                className={styles.radioInput}
                onChange={(e) => setReason(e.target.value)}
              />
              <span className={styles.radioImage}></span>
              {option.label}
            </label>
          ))}
        </section>
      </div>
      <div className={styles.message}>
        자세한 내용을 알려주세요 <p className={styles.op2}>(선택)</p>
      </div>
      <div className={styles.textareaContainer}>
        <textarea
          placeholder="구체적인 사유를 적어주세요."
          value={details}
          className={styles.textarea}
          onChange={(e) => setDetails(e.target.value)}
        />
      </div>
      <div className={styles.btns}>
        <Button
          size="l"
          type="outlined-assistive"
          onClick={() => setModal({ isOpen: false, type: null, data: null, isComfirm: false })}
        >
          취소
        </Button>

        <Button size="l" type="filled-primary" onClick={handleSubmit}>
          신고하기
        </Button>
      </div>
    </div>
  );
}

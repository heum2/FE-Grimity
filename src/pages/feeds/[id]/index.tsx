import { DetailsResponse, useDetails } from "@/api/feeds/getFeedsId";
import Detail from "@/components/Detail/Detail";
import { DetailsPageMeta } from "@/components/MetaData/MetaData";
import { serviceUrl } from "@/constants/serviceurl";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  const { data: details } = useDetails(id as string);
  return {
    props: {
      details,
    },
  };
};

export default function FeedDetail({ details }: { details: DetailsResponse }) {
  const router = useRouter();
  const { restoreScrollPosition } = useScrollRestoration("details-scroll");

  useEffect(() => {
    if (sessionStorage.getItem("details-scroll") !== null) {
      restoreScrollPosition();
      sessionStorage.removeItem("details-scroll");
    }
  }, []);

  const { id } = router.query;

  return (
    <>
      <DetailsPageMeta
        title={details.title}
        description={`${details.content ?? ""} ${details.tags ?? ""}`}
        url={`${serviceUrl}/feeds/${details.id}`}
        thumbnail={details.thumbnail ?? ""}
      />
      <Detail id={id as string} />
    </>
  );
}

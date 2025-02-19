import { getSSRPostsDetails, PostsDetailsResponse } from "@/api/posts/getPostsId";
import PostDetail from "@/components/Board/Detail/Detail";
import { serviceUrl } from "@/constants/serviceurl";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

type Props = {
  details: PostsDetailsResponse;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  try {
    const details = await getSSRPostsDetails(id);

    return {
      props: { details },
    };
  } catch (error) {
    return { notFound: true };
  }
};

export default function FeedDetail({ details }: Props) {
  const router = useRouter();
  const { id } = router.query;

  if (!id) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{`${details.title} - 그리미티`}</title>
        <meta name="description" content={details.content ?? ""} />
        <meta property="og:title" content={`${details.title} - 그리미티`} />
        <meta property="og:description" content={`${details.content} | grimity`} />
        <meta property="og:image" content="/image/grimity_default.png" />
        <meta property="og:url" content={`${serviceUrl}posts/${details.id}`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${details.title} - 그리미티`} />
        <meta name="twitter:description" content={details.content ?? ""} />
        <meta name="twitter:image" content={details.thumbnail ?? ""} />
      </Head>
      <PostDetail id={id as string} />
    </>
  );
}

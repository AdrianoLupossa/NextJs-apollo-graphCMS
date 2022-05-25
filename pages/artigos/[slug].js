import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { gql } from "@apollo/client";
import client from "../../apolloClient";

export default function Slug({ post }) {
  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.title} />
      </Head>
      <main style={{ padding: "1rem" }}>
        <div className="cover">
          <Image
            src={post.coverImage.url}
            alt={post.title}
            width="800px"
            height="500px"
          />
        </div>
        <h1 style={{ fontFamily: "sans-serif", fontSize: "3em" }}>
          {post.title}
        </h1>
        <div
          style={{ width: "100%", fontFamily: "sans-serif", fontSize: "1.5em" }}
        >
          {post.content}
        </div>
        <div
          className="navigation"
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            gap: 20,
          }}
        >
          <Link href="/">Back to list</Link>
          <Link href="/#!">Next Article</Link>
        </div>
      </main>
    </>
  );
}

export async function getStaticPaths() {
  const { data } = await client.query({
    query: gql`
      query MyQuery {
        blogPosts {
          slug
        }
      }
    `,
  });

  const paths = data.blogPosts.map((post) => {
    return {
      params: { slug: post.slug },
    };
  });

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;

  const { data } = await client.query({
    query: gql`
      query MyQuery {
        blogPost(where: { slug: "${slug}" }) {
          id
          title
          stage
          slug
          content
          coverImage {
            id
            url
         }
         
        }
      }
    `,
  });

  const post = data.blogPost;

  return {
    props: {
      post,
    },
    revalidate: 10,
  };
}

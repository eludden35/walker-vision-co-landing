import React from "react";
import Image from "next/image";
import Link from "next/link";

// Dynamic blog posts data
const blogPostsData = [
  {
    id: 1,
    imageUrl: "/images/blog/blog-1.jpg",
    date: {
      day: "12",
      month: "Jul",
    },
    author: "Admin",
    authorLink: "/blogs/author",
    comments: "1 Comment",
    title: "Top Kitchen Renovation Tips To Maximize Space And Style",
    link: "/blogs/details",
  },
  {
    id: 2,
    imageUrl: "/images/blog/blog-2.jpg",
    date: {
      day: "16",
      month: "Jul",
    },
    author: "Admin",
    authorLink: "/blogs/author",
    comments: "No Comment",
    title: "Outdoor Renovation Trends That Will Elevate Your Backyard",
    link: "/blogs/details",
  },
  {
    id: 3,
    imageUrl: "/images/blog/blog-3.jpg",
    date: {
      day: "19",
      month: "Jul",
    },
    author: "Admin",
    authorLink: "/blogs/author",
    comments: "No Comment",
    title: "Avoid These Common Mistakes During Your Home Renovation",
    link: "/blogs/details",
  },
];

const BlogPosts = () => {
  return (
    <>
      <div className="blog-area position-relative z-1 round-20">
        <div className="container pb-90">
          <div className="row">
            <div className="col-xl-8 offset-xl-2 col-md-10 offset-md-1 text-center">
              <h6 className="section-subtitle style-two d-inline-block fs-13 ls-1 font-optional fw-semibold position-relative text_primary mb-25">
                <Image
                  src="/images/icons/star-3.svg"
                  alt="Icon"
                  width={17}
                  height={16}
                />
                ARTICLES & INSIGHTS
              </h6>
              <h2 className="section-title style-one text-center text-title px-xxl-5 mb-40">
                A Showcase Of{" "}
                <span className="fw-black">Stunning Renovation Success</span>{" "}
                Stories
              </h2>
            </div>
          </div>

          <div className="row gx-xxl-25 justify-content-center">
            {blogPostsData.map((post) => (
              <div key={post.id} className="col-xl-4 col-md-6">
                <div className="blog-card style-one position-relative mb-30">
                  <div className="blog-img position-relative overflow-hidden round-20">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      width={570}
                      height={438}
                      className="round-20"
                    />
                    <span className="blog-date bg_secondary text-title position-absolute d-flex flex-column align-items-center justify-content-center round-10">
                      <span className="font-secondary fs-24 fw-black d-block">
                        {post.date.day}
                      </span>{" "}
                      {post.date.month}
                    </span>
                  </div>

                  <ul className="blog-metainfo list-unstyled">
                    <li className="fs-15 d-inline-block position-relative">
                      By <Link href={post.authorLink}>{post.author}</Link>
                    </li>
                    <li className="fs-15 d-inline-block position-relative">
                      {post.comments}
                    </li>
                  </ul>
                  <h3 className="fs-24 fw-black">
                    <Link
                      href={post.link}
                      className="text-title link-hover-primary fw-bold transition"
                    >
                      {post.title}
                    </Link>
                  </h3>

                  <Link href={post.link} className="link style-one fw-semibold">
                    Read More
                    <Image
                      src="/images/icons/right-arrow-small.svg"
                      alt="Icon"
                      width={15}
                      height={12}
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPosts;

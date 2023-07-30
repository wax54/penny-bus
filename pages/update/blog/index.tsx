import { InferGetStaticPropsType } from "next";
import * as publicBlogPage from "../../blog/index";
export const getStaticProps = publicBlogPage.getStaticProps;
export const UpdateBlog = ({
  blogs,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div className="bg-offWhite">
      {blogs.map(({ key, blog }) => {
        return (
          <a className="block" href={`./blog/` + key} key={key}>
            t: {blog.title} k: {key}
          </a>
        );
      })}
    </div>
  );
};

export default UpdateBlog;

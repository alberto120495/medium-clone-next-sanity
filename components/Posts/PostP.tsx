import React, { useState } from "react";
import { urlFor } from "../../sanity";
import { Post } from "../../typings";
import PortableText from "react-portable-text";
import { useForm, SubmitHandler } from "react-hook-form";

interface Props {
  post: Post;
}

interface IFormInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

function PostP({ post }: Props) {
  console.log(post);
  const [submitted, setsubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    fetch("/api/createComment", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(() => {
        setsubmitted(true);
      })
      .catch((err) => {
        setsubmitted(false);
      });
  };
  return (
    <>
      <img
        className="w-full h-40 object-cover"
        src={urlFor(post.mainImage).url()!}
        alt=""
      />
      <article className="max-w-3xl mx-auto p-5 ">
        <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
        <h2 className="text-xl font-light text-gray-500 mb-2">
          {post.description}
        </h2>
        <div className="flex items-center space-x-2">
          <img
            className="h-10 w-10 rounded-full"
            src={urlFor(post.author.image).url()!}
            alt=""
          />
          <p className="font-extralight text-xs">
            Blog post by{" "}
            <span className="text-green-600">{post.author.name} </span> -
            Published at {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>
        <div className="mt-10">
          <PortableText
            className=""
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="text-2xl font-bold my-5" {...props} />
              ),
              h2: (props: any) => (
                <h2 className="text-xl font-bold my-5" {...props} />
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a className="text-blue-500 hover:underline" href={href}>
                  {children}
                </a>
              ),
            }}
          />
        </div>
        <hr className="max-w-lg my-5 mx-auto border-yellow-500" />
        {submitted ? (
          <div className="flex flex-col p-10 my-10 bg-yellow-500 text-white">
            <h3 className="text-3xl font-bold">
              Thank for submitting your comment!
            </h3>
            <p>Once it has been approved, it will appear below!</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col p-5 max-w-2xl mx-auto mb-10"
          >
            <h3 className="text-sm text-yellow-500">Enjoyed this article?</h3>
            <h4 className="text-3xl font-bold">Leave a comment below!</h4>
            <hr className="py-3 mt-2" />

            <input
              {...register("_id")}
              type="hidden"
              name="_id"
              value={post._id}
            />

            <label className="block mb-5">
              <span className="text-gray-700">Name</span>
              <input
                {...register("name", { required: true })}
                className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 focus:ring outline-none"
                type="text"
                placeholder="Jonh Appleseed"
              />
            </label>
            <label className="block mb-5">
              <span className="text-gray-700">Email</span>
              <input
                {...register("email", { required: true })}
                className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 focus:ring outline-none"
                type="email"
                placeholder="jonhappleseed@test.com"
              />
            </label>
            <label className="block mb-5">
              <span className="text-gray-700">Comment</span>
              <textarea
                {...register("comment", { required: true })}
                className="shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 focus:ring outline-none"
                rows={8}
                placeholder="Leave a comment"
              />
            </label>
            <div className="flex flex-col p-5">
              {errors.name && (
                <span className="text-red-500">
                  - The Name Field is required
                </span>
              )}
              {errors.comment && (
                <span className="text-red-500">
                  - The Comment Field is required
                </span>
              )}
              {errors.email && (
                <span className="text-red-500">
                  - The Email Field is required
                </span>
              )}
            </div>
            <input
              type="submit"
              className="shadow bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline text-white font-bold py-2 px-4 rounded cursor-pointer"
            />
          </form>
        )}

        {/*Comments */}

        <div className="flex flex-col p-10 my-10 max-w-2xl mx-auto shadow-yellow-500 shadow space-y-2">
          <h3 className="text-4xl">Comments</h3>
          <hr className="pb-2" />
          {post.comments.map((comment) => (
            <div key={comment._id}>
              <p>
                <span className="text-yellow-500">{comment.name}: </span>
                {comment.comment}
              </p>
            </div>
          ))}
        </div>
      </article>
    </>
  );
}

export default PostP;

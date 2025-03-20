"use client";

import { ROLES } from "@/constants/roles";
import { Post, Roles } from "@/lib/interface";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

interface PostsProps {
  userRole: Roles | null;
  user: User | null;
}

export default function Posts({ userRole, user }: PostsProps) {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [isPostLoading, setIsPostLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);

  const getPosts = async () => {
    setIsPostLoading(true);

    const supabase = createClient();

    const { data, error } = await supabase.from("posts").select("*");

    if (error) {
      console.error(error);
      return redirect("/error");
    }

    if (data) {
      setPosts(data);
      setIsPostLoading(false);
    }
  };

  const deletePost = async (id: string) => {
    const supabase = createClient();

    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) {
      console.error(error);
      return redirect("/error");
    }

    getPosts();
  };

  const createPost = async () => {
    if (!title || !content || !user) {
      return;
    }
    const supabase = createClient();

    const { error } = await supabase
      .from("posts")
      .insert({ title, content, author_id: user.id });

    if (error) {
      console.error(error);
      return redirect("/error");
    }

    setOpenModal(false);
    setTitle("");
    setContent("");
    getPosts();
  };

  const updatePost = async (id: string) => {
    if (!title && !content) {
      return;
    }

    const supabase = createClient();

    const { error } = await supabase
      .from("posts")
      .update({ title, content })
      .eq("id", id);

    if (error) {
      console.error(error);
      return redirect("/error");
    }

    getPosts();
    setIsUpdate(false);
    setTitle("");
    setContent("");
  };

  useEffect(() => {
    getPosts();
  }, []);

  if (isPostLoading) {
    return (
      <div className="size-full flex flex-row justify-center items-center">
        Betöltés...
      </div>
    );
  }

  return (
    <div className="size-full flex flex-col justify-start items-start gap-y-2 p-4 z-10">
      <div className="flex flex-row justify-start items-center w-full gap-y-2">
        {userRole === ROLES.ADMIN && (
          <>
            <button
              type="button"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-full cursor-pointer"
              onClick={() => setOpenModal(true)}
            >
              Új bejegyzés
            </button>
            {openModal && (
              <div className="fixed top-0 left-0 size-full flex justify-center items-center z-20 backdrop-blur-sm">
                <div className="max-w-[460px] w-full bg-slate-900 text-white shadow-lg py-2 rounded-md">
                  <h2 className="text-xl font-medium border-b border-gray-300 py-3 px-4 mb-4">
                    Új bejegyzés
                  </h2>
                  <div className="flex flex-col gap-y-2 px-4 pb-4 ">
                    <div className="w-full">
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium "
                      >
                        Cím
                      </label>
                      <input
                        type="text"
                        id="title"
                        minLength={1}
                        maxLength={50}
                        className="w-full h-8 px-2 mt-1 rounded-md border border-gray-300"
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    <div className="w-full">
                      <label
                        htmlFor="content"
                        className="block text-sm font-medium "
                      >
                        Tartalom
                      </label>
                      <textarea
                        id="content"
                        rows={4}
                        maxLength={500}
                        minLength={1}
                        className="size-full px-2 mt-1 rounded-md border border-gray-300"
                        onChange={(e) => setContent(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="border-t border-gray-300 flex flex-row justify-end items-center px-4 pt-2 gap-x-2">
                    <button
                      type="button"
                      className="w-20 h-8 px-2 text-sm rounded-md bg-blue-500 text-white cursor-pointer"
                      onClick={() => createPost()}
                    >
                      Mentés
                    </button>
                    <button
                      type="button"
                      className="w-20 h-8 px-2 text-sm rounded-md bg-gray-700 text-white cursor-pointer"
                      onClick={() => setOpenModal(false)}
                    >
                      Mégsem
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <div className="size-full grid grid-cols-3 gap-4">
        {posts && posts.length > 0 ? (
          posts.map((post: Post) => (
            <div
              key={post.id}
              className="w-full h-48 flex flex-col gap-y-2 bg-slate-800 p-4 rounded-2xl"
            >
              <div className="flex flex-row justify-between items-center h-8">
                {isUpdate &&
                (userRole === ROLES.ADMIN || userRole === ROLES.MODERATOR) ? (
                  <input
                    type="text"
                    id="title"
                    minLength={1}
                    maxLength={50}
                    defaultValue={post.title}
                    className="w-3/4 h-8 px-2 mt-1 rounded-md border border-gray-300"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                ) : (
                  <h2>{post.title}</h2>
                )}
                <div className="flex flex-row gap-x-2">
                  {userRole === ROLES.ADMIN || userRole === ROLES.MODERATOR ? (
                    <button
                      className="cursor-pointer"
                      onClick={() => setIsUpdate(!isUpdate)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="oklch(0.623 0.214 259.815)"
                        className="size-5 hover:stroke-blue-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                    </button>
                  ) : null}
                  {userRole === ROLES.ADMIN && (
                    <button
                      className="cursor-pointer"
                      onClick={() => deletePost(post.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="#fb2c36"
                        className="size-5 hover:stroke-red-700"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              {isUpdate &&
              (userRole === ROLES.ADMIN || userRole === ROLES.MODERATOR) ? (
                <textarea
                  id="content"
                  rows={4}
                  maxLength={500}
                  minLength={1}
                  className="size-full px-2 mt-1 rounded-md border border-gray-300"
                  defaultValue={post.content}
                  onChange={(e) => setContent(e.target.value)}
                />
              ) : (
                <p>{post.content}</p>
              )}
              {isUpdate &&
                (userRole === ROLES.ADMIN || userRole === ROLES.MODERATOR) && (
                  <div className="flex flex-row justify-end items-center gap-x-2">
                    <button
                      className="cursor-pointer text-slate-950 bg-green-500 w-20 h-8 rounded-2xl"
                      onClick={() => updatePost(post.id)}
                    >
                      Mentés
                    </button>
                    <button
                      className="cursor-pointer bg-gray-700 w-20 h-8 rounded-2xl"
                      onClick={() => setIsUpdate(!isUpdate)}
                    >
                      Mégsem
                    </button>
                  </div>
                )}
            </div>
          ))
        ) : (
          <p>Nem találhatóak bejegyzések</p>
        )}
      </div>
    </div>
  );
}

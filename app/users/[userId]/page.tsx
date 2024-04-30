import getUser from "@/lib/getUser";
import getUserPosts from "@/lib/getUserPosts";
import getAllUser from "@/lib/getAllUser";
import { Suspense } from "react";
import UserPosts from "./components/UserPosts";
import { notFound } from "next/navigation";

type Params = {
  params: {
    userId: string;
  };
};

export async function generateMetadata({ params: { userId } }: Params) {
  const userData: Promise<User> = getUser(userId);
  const user: User = await userData;

  if (!user.name) {
    return {
      title: "User not found",
    };
  }

  return {
    title: user.name,
    description: `Posts by ${user.name}`,
  };
}

export default async function page({ params: { userId } }: Params) {
  const userData: Promise<User> = getUser(userId);
  const userPostsData: Promise<Post[]> = getUserPosts(userId);

  const user = await userData;

  if (!user.name) {
    return notFound();
  }
  // const [user, userPosts] = await Promise.all([userData, userPostsData]);

  return (
    <>
      <h2>{user.name}</h2>
      <br />
      <Suspense fallback={<h2>Loading...</h2>}>
        <UserPosts promise={userPostsData} />
      </Suspense>
    </>
  );
}

export async function generateStaticParams() {
  const usersData: Promise<User[]> = getAllUser();
  const users = await usersData;

  return users.map((user) => ({ userId: user.id.toString() }));
}

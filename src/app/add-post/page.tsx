import { redirect } from "next/navigation";

export default function AddPostPage() {
  redirect("/status-feed/create");
}
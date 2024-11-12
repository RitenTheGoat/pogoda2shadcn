"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PocketBase from "pocketbase";

const pb = new PocketBase("http://192.168.2.5:8080");

export default function LogPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (!pb.authStore.isValid) {
      router.push("/login"); // Redirect to home if not logged in
    } else {
      setUsername(pb.authStore.model.username); // Set the username of the logged-in user
    }
  }, []);

  return (
    <div>
      <h1>Welcome, {username}!</h1>
    </div>
  );
}

import { redirect } from "react-router-dom";

export function passwordResetLoader() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  if (!token) {

    throw redirect("/login");
  }

  return null;
}
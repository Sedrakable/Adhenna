import { redirect } from "next/navigation";
// Replace with your i18n configuration file
export default function RootNotFound() {
  redirect(`/en/404`);
}

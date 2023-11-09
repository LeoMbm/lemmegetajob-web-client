import { UserCard } from "../../../components/dashboard/profile/UserCard";
import { fetchServerSideUser } from "../../../libs/fetchServerSideUser";
export const dynamic = "force-dynamic";
export default async function Page() {
  const data = await fetchServerSideUser();

  return (
    <div className="h-full bg-gray-100 p-4">
      <UserCard user={data} />
    </div>
  );
}

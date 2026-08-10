import { useProfileQuery } from "../api/accountQueries";
import { ProfileHeaderCard } from "../components/ProfileHeaderCard";
import { PersonalInfoCard } from "../components/PersonalInfoCard";
import { ProfileStatsCard } from "../components/ProfileStatsCard";
import { RecentActivityCard } from "../components/RecentActivityCard";

export default function ProfilePage() {
  const { data, isLoading, isError, error } = useProfileQuery();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl p-6 font-mono text-gray-400">
        Loading profile...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-5xl p-6 font-mono text-red-400">
        Error loading profile: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="font-mono text-2xl font-bold tracking-tight text-white">
        Profile
      </h1>

      <ProfileHeaderCard
        user={data.user}
        onTokenTransactionsClick={() => console.log("Navigate to AI tokens")}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PersonalInfoCard user={data.user} />
        <ProfileStatsCard statistics={data.statistics} />
      </div>

      <RecentActivityCard activities={data.recent_activity} />
    </div>
  );
}
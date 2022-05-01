import { supabase } from "@/supabase";
import { Community } from "@/typings/Community";
import { Game } from "@/typings/Game";
import { Member, MemberWithMembership } from "@/typings/Member";
import { log } from "@/util/logger";
import { reactive } from "vue";

interface Store {
  coverImageUrl?: string;
  gamesCount: number;
  games: Game[];
  membersCount: number;
  members: MemberWithMembership[];
  isAdmin: boolean;
  isCreator: boolean;
  isPlayer: boolean;
  community: Community;
  admins: Member[];
}

export const communityStore = reactive<Store>({
  gamesCount: 0,
  games: [],
  membersCount: 0,
  members: [],
  isAdmin: false,
  isCreator: false,
  isPlayer: false,
  community: {
    id: "",
    name: "",
    allow_public_signup: false,
    created_at: "",
  },
  admins: [],
});

export async function getMemberCount(communityId: string) {
  const { error, count } = await supabase
    .from("community_memberships")
    .select("*", { count: "estimated" })
    .eq("community_id", communityId);
  if (count !== null) {
    communityStore.membersCount = count;
  }
  if (error) {
    log({ error });
  }
}

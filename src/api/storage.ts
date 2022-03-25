import { supabase } from "@/supabase";
import { store } from "@/store";
import { log } from "@/util/logger";

export async function removeObjects({
  bucket,
  paths,
}: {
  bucket: string;
  paths: string[];
}) {
  const { data, error } = await supabase.storage.from(bucket).remove(paths);
  if (error) {
    log(error);
    throw error;
  }
  if (data) return data;
}

export async function uploadToCoverImageStorage({
  id,
  file,
}: {
  id: string;
  file: File;
}) {
  if (!store.user?.id) {
    throw new Error("no user!");
  }
  const { data, error } = await supabase.storage
    .from("cover-images")
    .upload(`${id}/${file.name}`, file, {
      cacheControl: "360000",
    });
  if (error) {
    log({ error });
    throw error;
  }
  if (data) {
    return data.Key.replace("cover-images/", "");
  }
}

export const getCoverImageUrl = async (path: string) => {
  const { publicURL } = await supabase.storage
    .from("cover-images")
    .getPublicUrl(path);
  return publicURL ?? "";
};

export async function uploadToAvatarStorage(file: File) {
  if (!store.user?.id) {
    throw new Error("no user!");
  }
  const { data, error } = await supabase.storage
    .from("avatars")
    .upload(`${store.user.id}/${file.name}`, file, {
      cacheControl: "360000",
    });
  if (error) {
    log({ error });
    throw error;
  }
  if (data) {
    return data.Key.replace("avatars/", "");
  }
}

export const getAvatarImageUrl = async (path: string) => {
  const { publicURL } = await supabase.storage
    .from("avatars")
    .getPublicUrl(path);
  return publicURL ?? "";
};

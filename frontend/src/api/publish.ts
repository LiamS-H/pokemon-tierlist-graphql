"use server";
import { revalidatePath } from "next/cache";

export async function publish() {
    // TODO: accept an id and perform the db mutation here, only revalidate where there are changes.
    revalidatePath("/tierlists");
    return { success: true };
}

import { createClient } from "@libsql/client";

export const db = createClient({
  url:"file:./tele.db"
})


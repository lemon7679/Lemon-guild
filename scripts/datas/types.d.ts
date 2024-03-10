
export interface guildData {
    id: number,
    name: string,
    admin: userData,
    subAdmin: userData[],
    user: userData[],
    waitingUser: userData[]
}

export interface userData {
    id: string,
    name: string,
    guildId: number | undefined,
    authority: "user" | "admin" | "subAdmin" | "member" | "waiting"
}
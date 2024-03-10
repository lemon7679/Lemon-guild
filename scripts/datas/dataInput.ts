import { guildData, userData } from "./types";
import { Player, world } from "@minecraft/server"

/**
 * 
 * @returns 존재하는 모든 길드의 데이터를 반환합니다.
 */
export function getGuilds(): guildData[] {
    try {
        let guilds: guildData[] = [];
        let guildDatas = world.getDynamicProperty("guild");
        if (guildDatas === undefined || typeof (guildDatas) !== "string" || guildDatas === "") {
            guildDatas = "[]"
        }
        guildDatas = JSON.parse(guildDatas)
        if (Array.isArray(guildDatas)) {
            guilds = guildDatas
        } else {
            guilds = []
        }
        return guilds
    } catch (error) {
        console.error("[ Error ] getGuilds :" + error);
        throw new Error("error");
    }

}

/**
 * 
 * @returns 해당 길드의 데이터를 반환합니다. 길드가 없을 경우 undefined를 반환합니다.
 */
export function getGuild(id: number): guildData | undefined {
    try {
        const guild = getGuilds().find(guild => {
            return guild.id == id
        })
        return guild;
    } catch (error) {
        console.error("[ Error ] getGuild :" + error);
    }
}

/**
 * 
 * @returns 해당 유저를 반환합니다. 유저가 월드에 존재하지 않을 경우 undefined를 반환합니다.
 */
export function getUser(data: userData): Player | undefined {
    try {
        const player = world.getEntity(data.id)
        if (player === undefined) return
        if (player.typeId !== "minecraft:player") {
            throw new Error("not a user")
        }
        return player as Player
    } catch (error) {
        console.error("[ Error ] getUser :" + error);
    }
}

/**
 * 
 * @returns 모든 유저의 데이터를 반환합니다.
 */
export function getUserDatas(): userData[] {
    try {
        let users: userData[] = []
        let userDatas = world.getDynamicProperty("guildUser")
        if (userDatas === undefined || typeof (userDatas) !== "string" || userDatas === "") {
            userDatas = "[]"
        }
        userDatas = JSON.parse(userDatas)
        if (Array.isArray(userDatas)) {
            users = userDatas
        } else {
            users = []
        }
        return users
    } catch (error) {
        console.error("[ Error ] getUserDatas :" + error);
        throw new Error("[ Error ] getUserDatas");
    }
}

/**
 * 
 * @returns 해당 유저의 데이터를 받습니다. 해당 유저가 데이터에 없을경우 기본값을 반환합니다.
 */
export function getUserData(id: string, player?: Player): userData {
    try {
        let userData: userData;

        userData = {
            id: id,
            name: player?.name ?? "",
            guildId: undefined,
            authority: "user"
        }
        const user = getUserDatas().find(user => {
            return user.id == id
        })
        if (user == undefined) {
            return userData
        }
        return user;
    } catch (error) {
        console.error("[ Error ] getUserData :" + error);
        throw new Error("[ Error ] getUserData");

    }
}

/**
 * 
 * 유저 데이터를 설정합니다. 데이터 설정에 실패할 경우 에러를 발생시킵니다.
 */
export function setUserData(data: userData): void {
    try {
        const userDatas = getUserDatas()
        const userDataIndex = userDatas.findIndex(datas => {
            return datas.id == data.id
        })
        if (userDataIndex === -1) {
            userDatas.push(data)
        } else {
            userDatas[userDataIndex] = data
        }
        world.setDynamicProperty("guildUser", JSON.stringify(userDatas))
    } catch (error) {
        console.error("[ Error ] setUserData :" + error);
        throw new Error("[ Error ] setUserData");
    }
}

/**
 * 
 * 길드 데이터를 설정합니다. 데이터 설정에 실패할 경우 에러를 발생시킵니다.
 */
export function setGuild(data: guildData): void {
    try {
        const guildDatas = getGuilds()
        const guildDataIndex = guildDatas.findIndex(f => {
            return f.id === data.id
        })
        if (guildDataIndex === -1) {
            guildDatas.push(data)
        }
        guildDatas[guildDataIndex] = data
        world.setDynamicProperty("guild", JSON.stringify(guildDatas))
    } catch (error) {
        console.error("[ Error ] setUserData :" + error);
        throw new Error("[ Error ] setUserData");
    }
}
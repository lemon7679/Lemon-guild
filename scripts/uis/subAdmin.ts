import { Player, system } from "@minecraft/server";
import { getGuild, getUserData, setGuild, setUserData } from "../datas/dataInput";
import { MainUi, guildDataUi, showGuildListUi, showUserListUi, userDataUi } from "./base";
import { waitingUser } from "./admin";
import { guildData } from "../datas/types";

export function subAdminUi(player: Player): void {
    try {
        const userData = getUserData(player.id);
        if (userData.guildId === undefined || userData.authority !== "subAdmin") {
            if (userData.guildId === undefined) {
                userData.authority = "user"
                setUserData(userData)
                throw new Error("유저에게 길드가 없습니다. 유저의 권한을 user로 설정합니다.");
            }
            throw new Error("not a guild subAdmin");
        }
        const guildData = getGuild(userData.guildId)
        if (guildData === undefined) {
            userData.guildId = undefined
            userData.authority = "user"
            setUserData(userData)
            throw new Error("유저의 길드를 찾을 수 없습니다. 유저의 권한을 user로 설정하고 길드 id를 undefined로 설정합니다.");
        }
        system.run(() => {
            new MainUi()
                .button("길드 가입 요청")
                .button("내 길드 정보")
                .button("유저 관리")
                .show(player)
                .then(data => {
                    switch (data.selection) {
                        case 0: {
                            showGuildListUi(player).then(guildData => {
                                if (guildData === undefined) {
                                    return
                                }
                                guildDataUi(guildData).button("확인").show(player)
                            })
                            break;
                        }
                        case 1: {
                            showUserListUi(player).then(userData => {
                                if (userData === undefined) {
                                    return
                                }
                                userDataUi(userData).button("확인").show(player)
                            })
                            break;
                        }
                        case 2: {
                            waitingUser(player, guildData)
                            break;
                        }
                        case 3: {
                            guildDataUi(guildData).button("확인").show(player)
                            break;
                        }
                        case 4: {
                            userManager(player, guildData)
                        }
                        default:
                            break;
                    }
                })
        })
    } catch (error) {
        console.error("[ Error ] subAdminUi :" + error);
    }
}

function userManager(player: Player, guildData: guildData): void {
    try {
        showUserListUi(player, guildData.user).then(userData => {
            if (userData == undefined) {
                return;
            }
            let ui = userDataUi(userData)
                .button("길드 추방")
            if (userData.authority === "subAdmin") {
                player.sendMessage("부관리자를 추방 할 권한이 없습니다.")
                return;
            }
            ui.show(player).then(res => {
                if (res.selection === 1) {
                    guildData.user = guildData.user.filter(data => {
                        return data.id !== userData.id
                    });
                    userData.guildId = undefined
                    userData.authority = "user"
                    player.sendMessage(`길드에서 "§r${userData.name}§r"님을 성공적으로 추방했습니다.`)
                }
                setGuild(guildData);
                setUserData(userData);
            })
        })
    } catch (error) {
        console.error("[ Error ] userManager :" + error);
    }
}

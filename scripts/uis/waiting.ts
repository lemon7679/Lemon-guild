import { Player, system } from "@minecraft/server";
import { getGuild, getUserData, setGuild, setUserData } from "../datas/dataInput";
import { MainUi, guildDataUi, showGuildListUi, showUserListUi, userDataUi } from "./base";
import { MessageFormData } from "@minecraft/server-ui";

export function waitingUi(player: Player): void {
    try {
        const userData = getUserData(player.id);
        if (userData.guildId === undefined || userData.authority !== "waiting") {
            if (userData.guildId === undefined) {
                userData.authority = "user"
                setUserData(userData)
                throw new Error("유저에게 길드가 없습니다. 유저의 권한을 user로 설정합니다.");
            }
            throw new Error("not a guild waitingUser");
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
                .button("길드 정보")
                .show(player)
                .then(res => {
                    switch (res.selection) {
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
                            new MessageFormData()
                                .title("가입 요청 취소")
                                .body(`
        길드 이름 : §r${guildData.name}§r
        길드 아이디 : §r${guildData.id}§r
        길드 관리자 : §r${guildData.admin.name}§r
        길드 부관리자 : §r${guildData.subAdmin.map(data => data.name)}§r
        길드 총원 : §r${guildData.user.length + 1}§r
        길드 가입 대기자 수 : §r${guildData.waitingUser.length}§r
                                `)
                                .button1("가입 요청 취소하기")
                                .button2("돌아가기")
                                .show(player)
                                .then(res => {
                                    switch (res.selection) {
                                        case 0: {
                                            guildData.waitingUser = guildData.waitingUser.filter(data => {
                                                return data.id !== userData.id
                                            });
                                            userData.authority = "user"
                                            userData.guildId = 0
                                            setUserData(userData)
                                            setGuild(guildData)
                                            player.sendMessage(`길드 "§r${guildData.name}§r"에 보낸 가입 요청을 성공적으로 취소했습니다.`)
                                            break;
                                        }
                                        case 1: {
                                            waitingUi
                                            break;
                                        }
                                        default:
                                            break;
                                    }
                                })
                            break;
                        }
                        default:
                            break;
                    }
                })
        })
    } catch (error) {
        console.error("[ Error ] memberUi :" + error);
    }
}
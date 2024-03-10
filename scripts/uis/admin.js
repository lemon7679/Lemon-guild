import { system } from "@minecraft/server";
import { showGuildListUi, MainUi, guildDataUi, showUserListUi, userDataUi } from "./base";
import { getGuild, getUserData, setGuild, setUserData } from "../datas/dataInput";
export function adminUi(player) {
    try {
        const userData = getUserData(player.id);
        if (userData.guildId === undefined || userData.authority !== "admin") {
            if (userData.guildId === undefined) {
                userData.authority = "user";
                setUserData(userData);
                throw new Error("유저에게 길드가 없습니다. 유저의 권한을 user로 설정합니다.");
            }
            throw new Error("not a guild admin");
        }
        const guildData = getGuild(userData.guildId);
        if (guildData === undefined) {
            userData.guildId = undefined;
            userData.authority = "user";
            setUserData(userData);
            throw new Error("유저의 길드를 찾을 수 없습니다. 유저의 권한을 user로 설정하고 길드 id를 undefined로 설정합니다.");
        }
        system.run(() => {
            new MainUi()
                .button("길드 가입 요청")
                .button("내 길드 정보")
                .button("유저 관리")
                .button("길드 삭제")
                .show(player)
                .then((data) => {
                switch (data.selection) {
                    case 0: {
                        showGuildListUi(player).then(guildData => {
                            if (guildData === undefined) {
                                return;
                            }
                            guildDataUi(guildData).button("확인").show(player);
                        });
                        break;
                    }
                    case 1: {
                        showUserListUi(player).then(userData => {
                            if (userData === undefined) {
                                return;
                            }
                            userDataUi(userData).button("확인").show(player);
                        });
                        break;
                    }
                    case 2: {
                        waitingUser(player, guildData);
                        break;
                    }
                    case 3: {
                        guildDataUi(guildData).button("확인").show(player);
                        break;
                    }
                    case 4: {
                        userManager(player, guildData);
                    }
                    default:
                        break;
                }
            });
        });
    }
    catch (error) {
        console.error("[ Error ] adminUi :" + error);
    }
}
export function waitingUser(player, guildData) {
    try {
        showUserListUi(player, guildData.waitingUser).then(userData => {
            if (userData === undefined) {
                return;
            }
            userDataUi(userData)
                .button("길드 가입 승인")
                .show(player)
                .then(res => {
                if (res.selection === 0) {
                    userData.authority = "member";
                    userData.guildId = guildData.id;
                    guildData.user.push(userData);
                    guildData.waitingUser = guildData.waitingUser.filter(data => {
                        return data.id !== userData.id;
                    });
                    setGuild(guildData);
                    setUserData(userData);
                    player.sendMessage(`유저 "§r${userData.name}§r"님의 길드 가입을 승인했습니다.`);
                }
            });
        });
    }
    catch (error) {
        console.error("[ Error ] waitingUser :" + error);
    }
}
function userManager(player, guildData) {
    try {
        showUserListUi(player, guildData.user).then(userData => {
            if (userData == undefined) {
                return;
            }
            let adminData = getUserData(player.id, player);
            let ui = userDataUi(userData);
            if (userData.authority === "subAdmin") {
                ui.button("부관리자 해제");
            }
            else if (userData.authority === "member") {
                ui.button("부관리자 임명");
            }
            ui.button("길드 추방");
            ui.button("길드장 양도");
            ui.show(player).then(res => {
                switch (userData.authority) {
                    case "member": {
                        switch (res.selection) {
                            case 0: {
                                userData.authority = "subAdmin";
                                guildData.subAdmin.push(userData);
                                player.sendMessage(`길드에서 "§r${userData.name}§r"님을 성공적으로 부관리자로 임명했습니다.`);
                                break;
                            }
                            case 1: {
                                guildData.user = guildData.user.filter(data => {
                                    return data.id !== userData.id;
                                });
                                userData.guildId = undefined;
                                userData.authority = "user";
                                player.sendMessage(`길드에서 "§r${userData.name}§r"님을 성공적으로 추방했습니다.`);
                                break;
                            }
                            case 2: {
                                guildData.user = guildData.user.filter(data => {
                                    return data.id !== userData.id;
                                });
                                userData.authority = "admin";
                                guildData.admin = userData;
                                adminData.authority = "user";
                                adminData.guildId = 0;
                                player.sendMessage(`길드장을 "§r${userData.name}§r"님께 성공적으로 양도했습니다.`);
                                break;
                            }
                            default:
                                break;
                        }
                        break;
                    }
                    case "subAdmin": {
                        switch (res.selection) {
                            case 0: {
                                guildData.subAdmin = guildData.subAdmin.filter(data => {
                                    return data.id !== userData.id;
                                });
                                userData.authority = "member";
                                player.sendMessage(`길드에서 "§r${userData.name}§r"님을 성공적으로 부관리자 자격을 박탈했습니다.`);
                                break;
                            }
                            case 1: {
                                guildData.user = guildData.user.filter(data => {
                                    return data.id !== userData.id;
                                });
                                guildData.subAdmin = guildData.subAdmin.filter(data => {
                                    return data.id !== userData.id;
                                });
                                userData.guildId = undefined;
                                userData.authority = "user";
                                player.sendMessage(`길드에서 "§r${userData.name}§r"님을 성공적으로 추방했습니다.`);
                                break;
                            }
                            case 2: {
                                guildData.user = guildData.user.filter(data => {
                                    return data.id !== userData.id;
                                });
                                guildData.subAdmin = guildData.subAdmin.filter(data => {
                                    return data.id !== userData.id;
                                });
                                userData.authority = "admin";
                                guildData.admin = userData;
                                adminData.authority = "user";
                                adminData.guildId = 0;
                                player.sendMessage(`길드장을 "§r${userData.name}§r"님께 성공적으로 양도했습니다.`);
                                break;
                            }
                            default:
                                break;
                        }
                        break;
                    }
                    default:
                        break;
                }
                setGuild(guildData);
                setUserData(userData);
                setUserData(adminData);
            });
        });
    }
    catch (error) {
        console.error("[ Error ] userManager :" + error);
    }
}

import { ActionFormData } from "@minecraft/server-ui";
import { getGuild, getGuilds, getUserDatas } from "../datas/dataInput";
import { system } from "@minecraft/server";
export class MainUi extends ActionFormData {
    constructor() {
        super();
        this.title("길드");
        this.button("길드 목록");
        this.button("유저 정보");
    }
}
/**
 * @returns 선택한 길드의 guildData를 반환합니다. 길드를 선택하지 않았을 경우 undefined를 반환합니다
 */
export function showGuildListUi(player) {
    return new Promise((guildData) => {
        const guilds = getGuilds();
        if (guilds.length === 0) {
            player.sendMessage("길드가 존재하지 않습니다.");
            return;
        }
        system.run(() => {
            let ui = new ActionFormData().title("길드 목록");
            guilds.forEach((data) => {
                ui.button(data.name);
            });
            ui.show(player).then(data => {
                if (data.selection === undefined) {
                    return;
                }
                guildData(guilds[data.selection]);
            });
        });
        return;
    });
}
/**
 * @param userDatas userData[]을 인수로 받습니다. 설정하지 않을 경우 전체 유저로 설정됩니다.
 * @returns 선택한 유저의 userData를 반환합니다. 유저를 선택하지 않았을 경우 undefined를 반환합니다
 */
export function showUserListUi(player, userDatas) {
    return new Promise((userData) => {
        let users = getUserDatas();
        if (userDatas !== undefined) {
            users = userDatas;
        }
        if (users.length === 0) {
            player.sendMessage("유저가 존재하지 않습니다.");
            return;
        }
        system.run(() => {
            let ui = new ActionFormData().title("유저 목록");
            users.forEach((data) => {
                ui.button(data.name);
            });
            ui.show(player).then(data => {
                if (data.selection === undefined) {
                    return;
                }
                userData(users[data.selection]);
            });
        });
    });
}
/**
 * @returns 유저 데이터를 body로 표시한 ActionFormData을 반환합니다
 */
export function userDataUi(userData) {
    try {
        let guildData;
        if (userData.guildId === undefined) {
            guildData = undefined;
        }
        else {
            guildData = getGuild(userData.guildId);
        }
        let authority = "";
        switch (userData.authority) {
            case "admin":
                authority = "관리자";
                break;
            case "subAdmin":
                authority = "부관리자";
                break;
            case "member":
                authority = "맴버";
                break;
            case "user":
                authority = "유저";
                break;
            case "waiting":
                authority = "가입 대기";
                break;
            default:
                break;
        }
        return new ActionFormData()
            .title("길드")
            .body(`
        유저 이름 : §r${userData.name}§r
        유저 아이디 : §r${userData.id}§r
        유저 권한 : §r${authority}§r
        소속 길드 이름 : §r${guildData?.name ?? "길드 없음"}§r
        소속 길드 아이디 : §r${guildData?.id ?? "길드 없음"}§r
        `);
    }
    catch (error) {
        console.error("[ Error ] guildDataUi :" + error);
        throw new Error("[ Error ] guildDataUi");
    }
}
/**
 * @returns 길드 데이터를 body로 표시한 ActionFormData을 반환합니다
 */
export function guildDataUi(guildData) {
    try {
        return new ActionFormData()
            .title("길드")
            .body(`
        길드 이름 : §r${guildData.name}§r
        길드 아이디 : §r${guildData.id}§r
        길드 관리자 : §r${guildData.admin.name}§r
        길드 부관리자 : §r${guildData.subAdmin.map(data => data.name)}§r
        길드 총원 : §r${guildData.user.length + 1}§r
        길드 가입 대기자 수 : §r${guildData.waitingUser.length}§r
        `);
    }
    catch (error) {
        console.error("[ Error ] guildDataUi :" + error);
        throw new Error("[ Error ] guildDataUi");
    }
}

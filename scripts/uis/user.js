import { system } from "@minecraft/server";
import { MainUi, guildDataUi, showGuildListUi, showUserListUi, userDataUi } from "./base";
import { getGuild, getUserData, setGuild, setUserData } from "../datas/dataInput";
import { ModalFormData } from "@minecraft/server-ui";
export function userUi(player) {
    try {
        system.run(() => {
            new MainUi()
                .button("길드 생성")
                .show(player)
                .then(data => {
                switch (data.selection) {
                    case 0: {
                        guildList(player);
                        break;
                    }
                    case 1: {
                        showUserListUi(player).then(data => {
                            if (data === undefined) {
                                return;
                            }
                            ;
                            userDataUi(data).button("확인").show(player);
                        });
                        break;
                    }
                    case 2: {
                        addGuild(player);
                        break;
                    }
                    default:
                        break;
                }
            });
        });
    }
    catch (error) {
        console.error("[ Error ] userUi :" + error);
    }
}
function guildList(player) {
    try {
        showGuildListUi(player).then(guildData => {
            const userData = getUserData(player.id, player);
            if (guildData == undefined) {
                return;
            }
            guildDataUi(guildData)
                .button("길드 가입 신청")
                .button("확인")
                .show(player)
                .then(data => {
                if (data.selection === 0) {
                    userData.authority = "waiting";
                    guildData.waitingUser.push(userData);
                    userData.guildId = guildData.id;
                    setUserData(userData);
                    setGuild(guildData);
                    player.sendMessage(`길드 "§r${guildData.name}§r"에 성공적으로 가입 요청을 보냈습니다.`);
                }
            });
        });
    }
    catch (error) {
        console.error("[ Error ] guildList :" + error);
    }
}
function addGuild(player) {
    try {
        new ModalFormData()
            .title("길드 생성")
            .textField("길드 이름", "길드 이름을 입력해주세요.")
            .show(player).then((data) => {
            const formValues = data.formValues;
            if (data.canceled || formValues === undefined) {
                return;
            }
            const guildid = () => {
                let num = Math.floor(Math.random() * 10000000000);
                if (getGuild(num) === undefined) {
                    return num;
                }
                else {
                    return guildid(); // 사용 중인 경우 다시 시도
                }
            };
            let userData = getUserData(player.id);
            let id = guildid();
            userData.authority = "admin";
            userData.guildId = id;
            let guildData = {
                "admin": userData,
                "name": formValues[0].toString(),
                "id": id,
                "subAdmin": [],
                "user": [],
                "waitingUser": []
            };
            setGuild(guildData);
            setUserData(userData);
            player.sendMessage(`길드 "§r${formValues[0].toString()}§r"이 생성되었습니다.`);
        });
    }
    catch (error) {
        console.error("[ Error ] addGuild :" + error);
    }
}

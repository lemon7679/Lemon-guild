import { world } from "@minecraft/server";
import { getGuild, getUserData, setUserData } from "../datas/dataInput";
import { adminUi } from "../uis/admin";
import { userUi } from "../uis/user";
import { subAdminUi } from "../uis/subAdmin";
import { memberUi } from "../uis/member";
world.beforeEvents.itemUse.subscribe((data) => {
    if (data.itemStack.typeId === "lemon:guild_ui_open_item") {
        data.cancel = true;
        const userData = getUserData(data.source.id);
        if (userData.guildId !== undefined && getGuild(userData.guildId) === undefined) {
            userData.authority = "user";
            setUserData(userData);
            console.error("유저의 길드가 존재하지 않습니다 유저의 데이터를 초기화 합니다.");
        }
        switch (userData.authority) {
            case "user": {
                userUi(data.source);
                break;
            }
            case "admin": {
                adminUi(data.source);
                break;
            }
            case "subAdmin": {
                subAdminUi(data.source);
                break;
            }
            case "member": {
                memberUi(data.source);
                break;
            }
            case "waiting": {
                break;
            }
            default:
                break;
        }
    }
});

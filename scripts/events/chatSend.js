import { system, world } from "@minecraft/server";
import { getGuild, getUserData } from "../datas/dataInput";
world.beforeEvents.chatSend.subscribe(data => {
    const { sender, message } = data;
    data.cancel = true;
    system.run(() => {
        let userData = getUserData(sender.id);
        let guildName = undefined;
        if (userData.guildId !== undefined) {
            guildName = getGuild(userData.guildId)?.name;
        }
        console.log(`§r§l[§r ${guildName ?? "길드 없음"} §r§l]§r §r§l[§r ${userData.authority ?? "길드 없음"} §r§l] §r${sender.name}§r §l§8>§r ${message}`);
        world.sendMessage(`§r§l[§r ${guildName ?? "길드 없음"} §r§l]§r §r§l[§r ${userData.authority ?? "길드 없음"} §r§l] §r${sender.name}§r §l§8>§r ${message}`);
    });
});

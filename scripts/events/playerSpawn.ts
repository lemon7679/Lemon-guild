import { world } from "@minecraft/server";
import { getUserData, setUserData } from "../datas/dataInput";


world.afterEvents.playerSpawn.subscribe(data => {
    if (data.initialSpawn) {
        let userData = getUserData(data.player.id)
        userData.name = "§r" + data.player.name + "§r"
        setUserData(userData)
    }
})
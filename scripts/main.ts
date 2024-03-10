import { system } from "@minecraft/server"
import "./events/chatSend"
import "./events/itemUse"
import "./events/playerSpawn"

system.beforeEvents.watchdogTerminate.subscribe(res => {
    res.cancel = true
    console.error(res.terminateReason)
})
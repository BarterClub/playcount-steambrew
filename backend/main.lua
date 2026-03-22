local logger = require("logger")
local millennium = require("millennium")
local http = require("http")
local json = require("json")

-- Fetch current player count from Steam API
function fetch_player_count(app_id)
    local success, result = pcall(function()
        local url = "https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1?appid=" .. tostring(app_id)

        local response, err = http.get(url, {
            headers = { ["Accept"] = "application/json" },
            timeout = 10
        })

        if response and response.status == 200 then
            return response.body
        else
            local error_msg = err or ("HTTP " .. tostring(response and response.status or "unknown"))
            logger:error("[Player Count] Failed to fetch player count for " .. tostring(app_id) .. ": " .. error_msg)
            return json.encode({ response = { result = 0, player_count = 0 } })
        end
    end)

    if not success then
        logger:error("[Player Count] fetch_player_count error: " .. tostring(result))
        return json.encode({ response = { result = 0, player_count = 0 } })
    end

    return result
end

-- Plugin lifecycle
local function on_load()
    logger:info("[Player Count] Plugin loaded, Millennium " .. millennium.version())
    millennium.ready()
end

local function on_unload()
    logger:info("[Player Count] Plugin unloaded")
end

local function on_frontend_loaded()
    logger:info("[Player Count] Frontend loaded")
end

return {
    on_load = on_load,
    on_unload = on_unload,
    on_frontend_loaded = on_frontend_loaded,
    fetch_player_count = fetch_player_count,
}

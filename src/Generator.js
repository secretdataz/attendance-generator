import dayjs from 'dayjs'
import VERSION from './version'

function date2int(date) {
    return dayjs(date).format('YYYYMMDD')
}

export function generate_lua(items, start, end) {
    return `-- Generated with Secret's Attendance Generator version ${VERSION}
Config = { StartDate = ${date2int(start)}, EndDate = ${date2int(end)} }
Reward = {
    ${
        items.map((item, index) => `{ ${index+1}, ${item.itemId}, ${item.amount} }` ).join(',\n    ')
    }
}

main = function()
    result, msg = InsertCheckAttendanceConfig(Config.EvendOnOff, Config.StartDate, Config.EndDate)
    if not result == true then
        return false, msg
    end
    for k, rewardtbl in pairs(Reward) do
        result, msg = InsertCheckAttendanceReward(rewardtbl[1], rewardtbl[2], rewardtbl[3])
        if not result == true then
            return false, msg
        end
    end
    return true, "success"
end
`
}

export function generate_yaml(items, start, end) {
    return `# Generated with Secret's Attendance Generator version ${VERSION}
Header:
  Type: ATTENDANCE_DB
  Version: 1
  
Body:
  - Start: ${date2int(start)}
    End: ${date2int(end)}
    Rewards:
${
    items.map((item, index) => 
`      - Day: ${index+1}
        ItemId: ${item.itemId}
        Amount: ${item.amount}
`).join('')
}
`
}

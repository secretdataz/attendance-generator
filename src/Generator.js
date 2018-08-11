import dayjs from 'dayjs'
import VERSION from './version'

function date2int(date) {
    return dayjs(date).format('YYYYMMDD')
}

export function generate_lua(state) {
    return `-- Generated with Secret's Attendance Generator version ${VERSION}
Config = { StartDate = ${date2int(state.start_date)}, EndDate = ${date2int(state.end_date)} }
Reward = {
    ${
        state.items.map((item, index) => `{ ${index+1}, ${item.item_id}, ${item.amount} }` ).join(',\n    ')
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

export function generate_yaml(state) {
    return `# Generated with Secret's Attendance Generator version ${VERSION}
  Header:
  Type: ATTENDANCE_CONF
  Version: 1
  
  Attendance:
    - Start: ${date2int(state.start_date)}
      End: ${date2int(state.end_date)}
      Rewards:
${
    state.items.map((item, index) => 
`       - Day: ${index+1}
          ItemId: ${item.item_id}
          Amount: ${item.amount}
`).join('')
}
`
}

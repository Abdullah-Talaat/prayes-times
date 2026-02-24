export function dif(firstTime,secoendTime) {
    const [hours1,minutes1]= firstTime
    const [hours2,minutes2]=secoendTime

    const difM = [Number(hours1) - Number(hours2),Number(minutes1) - Number(minutes2)]
    return difM
}
export function difToT(dif){
    let TdifM = dif[0]*60+dif[1]
    let t = [Math.trunc(TdifM/60),TdifM%60]
    return t
}
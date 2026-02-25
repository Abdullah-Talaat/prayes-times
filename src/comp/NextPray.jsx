export default function NextPray({n}) {
    const {name,dif,is} = n
    return(
        <div className="next-pray">
            <h2>تبقى على صلاة {name}</h2>
            <span>{is?"≈ ":""}{String(dif[0]).padStart(2,"0")}:{String(dif[1]).padStart(2,"0")}</span>
        </div>
    )
}
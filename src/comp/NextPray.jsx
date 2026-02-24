export default function NextPray({n}) {
    const {name,dif} = n
    return(
        <div className="next-pray">
            <h2>تبقى على صلاة {name}</h2>
            <span>{dif}</span>
        </div>
    )
}
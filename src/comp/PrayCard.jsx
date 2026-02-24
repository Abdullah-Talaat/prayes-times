import "../styles/prayCard.css"
export default function PrayCard({name,time,isNext}) {
    // time hh:mm
    return (
        <div className={`pray-card ${isNext?"is-next":""}`} >
           <h3>{time}</h3> 
           <p>{name}</p>
       </div>
    )
}

import { useState, useEffect } from "react"
import PrayCard from "./comp/PrayCard"
import { dif, difToT } from "./functions/dif"
import NextPray from "./comp/NextPray"
import "./App.css"
export default function App() {
  const [city, setCity] = useState("")
  const [times, setTimes] = useState([])
  const [nextPray, setNextPray] = useState({ name: "  ", dif: [0, 0], is: false })
  const [dateH, setDateH] = useState({ day: "", month: "", weekday: "", year: "" })

  useEffect(() => {
    const fetchData = async () => {
      // get date
      const today = new Date();

      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();
      let todayDate = `${day}-${month}-${year}`

      try {
        //fetch data
        let res = await fetch(`https://api.aladhan.com/v1/timingsByCity/${todayDate}?city=${city}&country=egypt&method=8`)
        let fetchedData = await res.json()
        // get hijri date
        const daH = fetchedData.data.date.hijri
        setDateH({ day: daH.day, weekday: daH.weekday.ar, month: daH.month.ar, year: daH.year })
        // update times
        setTimes(
          [
            { name: "الفَجْر", time: fetchedData.data.timings.Fajr },
            { name: "الشُّرُوق", time: fetchedData.data.timings.Sunrise },
            { name: "الظُّهْر", time: fetchedData.data.timings.Dhuhr },
            { name: "العَصْر", time: fetchedData.data.timings.Asr },
            { name: "المَغْرِب", time: fetchedData.data.timings.Maghrib },
            { name: "العِشَاء", time: fetchedData.data.timings.Isha },

          ]
        )
      }
      catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [city])


  // format form 24 to 12
  function formatTo12Hour(time24) {
    const [hourStr, minute] = time24.split(":");
    let hour = parseInt(hourStr, 10);

    const period = hour >= 12 ? "PM" : "AM";

    hour = hour % 12;
    hour = hour === 0 ? 12 : hour;

    return `${hour}:${minute} ${period}`;
  }
  // get next time
  useEffect(() => {
    const getNearer = async () => {

      const date = new Date
      const now = [date.getHours(), date.getMinutes()]


      let nearer = { name: "", dif: [] }


      if (times.length > 0) {

        times.map((item, i) => {
          let time = item.time.split(":")

          if (i == 0) {
            nearer.name = item.name


            nearer.dif = dif(time, now)
          }
          else {
            let iDif = dif(time, now)
            let tDifM = iDif[0] * 60 + iDif[1]
            let perDif = nearer.dif[0] * 60 + nearer.dif[1]
            if (tDifM > 0 && (tDifM < perDif || perDif < 0)) {
              nearer.name = item.name
              nearer.dif = iDif
            }
            else if (tDifM == 0) {

              var audio = new Audio("019--1.mp3");
              audio.play();
              alert(`حان الان وقت صلاة العصر ${item.name} `)
            }
          }
        })
        if (nearer.dif[0] * 60 + nearer.dif[1] < 0) {

          nearer.dif = [23 + nearer.dif[0], 59 + nearer.dif[1]]
          setNextPray({ ...nextPray, name: nearer.name, dif: difToT(nearer.dif), is: true })
          console.log(nextPray)

        }
        else {
          setNextPray({ ...nextPray, name: nearer.name, dif: difToT(nearer.dif), is: false })

          console.log(nextPray)

        }
      }
    }
    let interval = setInterval(() => getNearer(), 1000 * 10)
    getNearer()
    return () => clearInterval(interval)
  }, [times])



  const egyptGovernorates = [
    { label: "القاهرة", value: "cairo" },
    { label: "الجيزة", value: "giza" },
    { label: "الإسكندرية", value: "alexandria" },
    { label: "الدقهلية", value: "dakahlia" },
    { label: "البحر الأحمر", value: "red sea" },
    { label: "البحيرة", value: "beheira" },
    { label: "الفيوم", value: "fayoum" },
    { label: "الغربية", value: "gharbia" },
    { label: "الإسماعيلية", value: "ismailia" },
    { label: "المنوفية", value: "monufia" },
    { label: "المنيا", value: "minya" },
    { label: "القليوبية", value: "qalyubia" },
    { label: "الوادي الجديد", value: "new valley" },
    { label: "السويس", value: "suez" },
    { label: "اسوان", value: "aswan" },
    { label: "اسيوط", value: "assiut" },
    { label: "بني سويف", value: "beni suef" },
    { label: "بورسعيد", value: "port said" },
    { label: "دمياط", value: "damietta" },
    { label: "الشرقية", value: "sharqia" },
    { label: "جنوب سيناء", value: "south sinai" },
    { label: "كفر الشيخ", value: "kafr el sheikh" },
    { label: "مطروح", value: "matrouh" },
    { label: "الأقصر", value: "luxor" },
    { label: "قنا", value: "qena" },
    { label: "شمال سيناء", value: "north sinai" },
    { label: "سوهاج", value: "sohag" }
  ];
  return (
    <main className="app">

      <div className="overlay"></div>

      <div className="content">

        <header>
          <h1>مواقيت الصلاة</h1>
          <h3><span>{dateH.weekday}</span> {dateH.day} {dateH.month} {dateH.year}</h3>

        </header>

        <div className="pray-times">
          {times.length > 0 && times.map((item, i) => (
            <PrayCard key={i} name={item.name} time={formatTo12Hour(item.time)} isNext={item.name == nextPray.name} />
          ))}
        </div>

        <section className="bottom-section">
          <NextPray n={nextPray} />

          <select onChange={(e) => setCity(e.target.value)}>
            <option value="minya">اختر المحافظة</option>
            {egyptGovernorates.map((item, i) => (
              <option key={i} value={item.value}>{item.label}</option>
            ))}
          </select>
        </section>
        <footer>
          <h4>by <a href="https://www.facebook.com/profile.php?id=100093531259560&sfnsn=scwspmo&mibextid=RUbZ1f">Abdullah Talaat</a></h4>
        </footer>
      </div>

    </main>
  )
}
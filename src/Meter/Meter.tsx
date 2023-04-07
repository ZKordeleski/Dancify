import { Gauge } from "../Gauge/Gauge"
import { percentager } from "../utilities/percentager"
import "./Meter.css"

interface MeterProps {
  name: string,
  value: number,
  normalized?: true
}

//TODO: Consider making the time / duration display in "2h5m" minute.

function Meter(props: MeterProps) {
  if (props.normalized === true) {
    return (
      <div className="Meter">
        <span>{props.name} {percentager(props.value)}</span>
        {/* <meter id={props.name} min="0" max="1" value={props.value}> </meter> */}
      </div>
    )
  }
  
  return (
    <div className="Meter basic">
      <span className="Value">{props.value}</span>
      <span className="Name">{props.name}</span>
    </div>
  )
}

export default Meter
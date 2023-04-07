interface GaugeProps {
    radius: number,
    percent: number 
}

export function Gauge(props: GaugeProps) {
    if (props.percent < 0 || props.percent > 1) {
        props.percent = 0;
    }

    const strokeWidth = props.radius * 0.2;
    const innerRadius = props.radius - (strokeWidth / 2);
    const circumference = innerRadius * 2 * Math.PI;
    const arc = circumference * 1/2

    const dashArray = `${arc} ${circumference}`;
    const transform = `rotate(180, ${props.radius}, ${props.radius})`;

    const percentFill = `${arc * props.percent} ${circumference}`

    let fillColor: string = "green"

    // Coloring based on percentage full.
    // TODO: Consider adding optional low value, high value markers like in the meter component to handle bounds.
    if (props.percent < .33) {
        fillColor = "red"
    } else if (props.percent < .66) {
        fillColor = "yellow"
    }
    
    return (
        <svg
            height={props.radius * 2}
            width={props.radius * 2}
        >
            <circle
                className="gauge_base"
                cx={props.radius}
                cy={props.radius}
                fill="transparent"
                r={innerRadius}
                stroke="gray"
                strokeWidth={strokeWidth}
                strokeDasharray={dashArray}
                strokeLinecap="round"
                transform={transform}
            />
            <circle
                className="gauge_fill"
                cx={props.radius}
                cy={props.radius}
                fill="transparent"
                r={innerRadius}
                stroke={fillColor}
                strokeWidth={strokeWidth}
                strokeDasharray={percentFill}
                transform={transform}
                strokeLinecap="round"
                style={{transition: "stroke-dasharray 0.3s"}}
            />
        </svg>
    );
}
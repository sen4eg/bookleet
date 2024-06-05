
import styles from './styles.module.scss';

const AddButton = ({ onClick }) => {
    const radius = 24;
    const strokeWidth = 2;
    const circleRadius = radius - strokeWidth / 2;

    return (
        <svg
            width={radius * 2}
            height={radius * 2}
            viewBox={`0 0 ${radius * 2} ${radius * 2}`}
            onClick={onClick}
            className={styles["add-button"]}
        >
            {/* Circle */}
            <circle
                id="outer-circle"
                className={styles["outer-circle"]}
                cx={radius}
                cy={radius}
                r={circleRadius}
                fill="transparent"
                stroke="black"
                strokeWidth={strokeWidth}
            />
            {/* Horizontal line */}
            <line id="horizontal-line" className={styles["horizontal-line"]} stroke={"black"} strokeWidth={4} x1={0} y1={radius} x2={radius * 2} y2={radius} />
            {/* Vertical line */}
            <line id="vertical-line" className={styles["vertical-line"]} stroke={"black"} strokeWidth={4}  x1={radius} y1={0} x2={radius} y2={radius * 2} />
        </svg>
    );
}

export default AddButton;
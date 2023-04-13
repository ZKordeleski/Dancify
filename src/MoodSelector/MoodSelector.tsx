// data, preset buttons component (displays presets), preset button component

import { FilterSettings } from "../PlaylistDetailsPane/PlaylistDetailsPane";
import { AudioFeatures } from "../types"
import "./MoodSelector.css"

export interface MoodPreset {
    name: string,
    icon: string,
    audioMetrics: {
        [K in keyof AudioFeatures]?: [min: number, max: number];
    }
}

const moodPresets: MoodPreset[] = [
    {
        name: "Danceable",
        icon: "💃",
        audioMetrics: {
            danceability: [.6, 1]
        }
    },

    {
        name: "Slump Buster",
        icon: "☕",
        audioMetrics: {
            energy: [.5, 1],
            valence: [.75, 1],
            tempo: [120, 1000]
        }
    }
];

export interface MoodSelectorProps {
    setFilterPreset: (moodSettings: Partial<FilterSettings>) => void;
}

export function MoodSelector(props: MoodSelectorProps) {
    return(
        <div className="MoodSelector">
            {moodPresets.map((mood) => <MoodPresetButton mood={mood} setFilterPreset={props.setFilterPreset}/>)}
        </div>
    )
}

export interface MoodPresetButtonProps {
    mood: MoodPreset,
    setFilterPreset: (moodSettings: Partial<FilterSettings>) => void;
}

export function MoodPresetButton(props: MoodPresetButtonProps) {

    return(
        <div className="MoodPresetButton" onClick={() => {props.setFilterPreset(props.mood.audioMetrics); console.log(props.mood.audioMetrics)}}>
            <div className="mood-icon">{props.mood.icon}</div>
            <div className="mood-name">{props.mood.name}</div>
        </div>
    )
}




// id: string,
// danceability: number,
// energy: number,
// valence: number,
// instrumentalness: number,
// loudness: number,
// key: number,
// tempo: number,
// time_signature: number,
// duration_ms: number
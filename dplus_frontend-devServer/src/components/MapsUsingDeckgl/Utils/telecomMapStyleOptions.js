/**
 * Keys consumed by `getMapStyle` in TelecomMap.jsx.
 * `previewStyle` matches Datayog `gis-engine/page.js` `MAP_STYLES` thumbnails.
 */
export const TELECOM_MAP_STYLE_OPTIONS = [
  {
    label: "Outdoors",
    pickerLabel: "Terrain",
    value: "outdoors",
    previewStyle: {
      backgroundColor: "#d9d7c8",
      backgroundImage:
        "linear-gradient(145deg, rgba(90,106,79,0.95) 0 24%, rgba(181,190,171,0.95) 24% 54%, rgba(234,228,209,0.95) 54%), linear-gradient(120deg, transparent 0 50%, rgba(255,255,255,0.28) 50% 54%, transparent 54% 100%)",
    },
  },
  {
    label: "Streets",
    pickerLabel: "Street",
    value: "voyager",
    previewStyle: {
      backgroundColor: "#f7f7f5",
      backgroundImage:
        "linear-gradient(130deg, transparent 0 24%, #8bb5f4 24% 31%, transparent 31% 100%), linear-gradient(42deg, transparent 0 44%, #fb7185 44% 52%, transparent 52% 100%), linear-gradient(90deg, transparent 0 58%, #5eead4 58% 64%, transparent 64% 100%), linear-gradient(180deg, transparent 0 34%, #f8fafc 34% 100%)",
    },
  },
  {
    label: "OSM",
    pickerLabel: "OSM",
    value: "osm",
    previewStyle: {
      backgroundColor: "#eef4de",
      backgroundImage:
        "linear-gradient(140deg, #eef4de 0 48%, #d7efae 48% 100%), linear-gradient(35deg, transparent 0 46%, rgba(255,255,255,0.8) 46% 52%, transparent 52% 100%), linear-gradient(115deg, transparent 0 64%, rgba(255,255,255,0.7) 64% 69%, transparent 69% 100%)",
    },
  },
  {
    label: "Satellite",
    pickerLabel: "Satellite",
    value: "satellite",
    previewStyle: {
      backgroundColor: "#426d49",
      backgroundImage:
        "radial-gradient(circle at 25% 20%, rgba(32,75,143,0.95) 0 24%, transparent 25%), radial-gradient(circle at 72% 66%, rgba(196,185,128,0.78) 0 18%, transparent 19%), linear-gradient(135deg, #204b8f 0%, #49784a 45%, #8d8554 72%, #c4b980 100%)",
    },
  },
  {
    label: "Light",
    pickerLabel: "Light",
    value: "light",
    previewStyle: {
      backgroundColor: "#f1f5f9",
      backgroundImage:
        "linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(226,232,240,0.98) 100%), linear-gradient(45deg, transparent 0 46%, rgba(203,213,225,0.8) 46% 50%, transparent 50% 100%)",
    },
  },
  {
    label: "Dark",
    pickerLabel: "Dark",
    value: "dark",
    previewStyle: {
      backgroundColor: "#10172e",
      backgroundImage:
        "linear-gradient(135deg, #12192f 0%, #1f2b4a 100%), linear-gradient(45deg, transparent 0 44%, rgba(77,93,132,0.45) 44% 48%, transparent 48% 100%)",
    },
  },
];

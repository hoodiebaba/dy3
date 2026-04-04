import React from "react";
import CellInfoPopup from "./CellInfoPopup";

/**
 * Placeholder for a future cell-info UI. For now this renders the legacy
 * {@link CellInfoPopup} unchanged so `USE_CELL_INFO_POPUP_V2` can stay on
 * without dropping the old look & behavior. Implement the new design here later.
 *
 * Props match `CellInfoPopup.jsx` exactly.
 */
const CellInfoPopupV2 = (props) => <CellInfoPopup {...props} />;

export default CellInfoPopupV2;

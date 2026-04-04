/**
 * Maps Flask `GET /me` → `menu` tree (Postman: dplus-apis) into the shape
 * `Sidebar.jsx` expects: { title, route, type, icon?, children }.
 */

export function sortMenuBySequence(nodes) {
  return [...(nodes || [])].sort((a, b) => (Number(a?.sequence) || 0) - (Number(b?.sequence) || 0));
}

/** Map API top-level titles → keys that exist in Sidebar `TOP_LEVEL_ICON_MAP` (display title stays API). */
const TOP_ICON_KEY = {
  "dataplus analytics pro": "DataPlus Analytics Pro",
  "cx ix support": "CX/IX Support",
  selectsettings: "Map Settings",
  "report scheduler": "xAlerts",
  "file with form": "iSON",
  "nokia tool management query": "Nokia Tool Management Query",
  "view network complaints": "Network Complaints",
  "telecom maps": "GIS Engine",
};

function topLevelIconLookupKey(rawTitle) {
  const k = String(rawTitle || "")
    .trim()
    .toLowerCase();
  return TOP_ICON_KEY[k] || rawTitle;
}

/**
 * @param {Array} menu - raw `res.data.menu` from `/me`
 * @param {{ resolveTopIcon: (iconKey: string, rawTitle: string) => any }} opts
 */
export function meMenuToSidebarItems(menu, { resolveTopIcon }) {
  const walk = (nodes, isTop) =>
    sortMenuBySequence(nodes)
      .filter((n) => n && n.is_active !== false)
      .map((n) => {
        const children = walk(n.children || [], false);
        const rawTitle = n.title;
        const title = rawTitle;
        const route = n.route && String(n.route).trim() ? String(n.route).trim() : "/";
        const iconKey = isTop ? topLevelIconLookupKey(rawTitle) : rawTitle;
        return {
          title,
          route,
          type: children.length ? "dropdown" : "link",
          icon: isTop ? resolveTopIcon(iconKey, rawTitle) : undefined,
          children,
        };
      });

  if (!Array.isArray(menu) || !menu.length) return [];
  return walk(menu, true);
}

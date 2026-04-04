import Dragger from '../Dragger';
import CustomTooltip from '../CustomTooltip';

const ORANGE = '#EC7D09';

const CellInfoPopup = ({
    data = {},
    mapH,
    mapW,
    onClose,
    onCopy,
    onSiteAnalytics,
    onCellAnalytics,
    onSiteProRules,
    onCellProRules,
    onChartClick,
    onChartRightClick,
}) => {
    return (
        <Dragger mapH={mapH} mapW={mapW}>
            <div style={{
                position: 'absolute',
                bottom: 8,
                width: 280,
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: 12,
                boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                zIndex: 9998,
            }}>

                {/* ── Header (drag handle + title + actions) ── */}
                <div className="cursor-move select-none flex items-center justify-between px-3 py-2" style={{ background: ORANGE, borderRadius: '12px 12px 0 0' }}>

                    {/* Action icons */}
                    <div className="flex items-center gap-2 flex-1">

                        {onCopy && (
                            <CustomTooltip text="Copy">
                                <div className="cursor-pointer p-1" onClick={() => onCopy(data)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                                        <path fillRule="evenodd" d="M17.663 3.118c.225.015.45.032.673.05C19.876 3.298 21 4.604 21 6.109v9.642a3 3 0 0 1-3 3V16.5c0-5.922-4.576-10.775-10.384-11.217.324-1.132 1.3-2.01 2.548-2.114.224-.019.448-.036.673-.051A3 3 0 0 1 13.5 1.5H15a3 3 0 0 1 2.663 1.618ZM12 4.5A1.5 1.5 0 0 1 13.5 3H15a1.5 1.5 0 0 1 1.5 1.5H12Z" clipRule="evenodd" />
                                        <path d="M3 8.625c0-1.036.84-1.875 1.875-1.875h.375A3.75 3.75 0 0 1 9 10.5v1.875c0 1.036.84 1.875 1.875 1.875h1.875A3.75 3.75 0 0 1 16.5 18v2.625c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625v-12Z" />
                                        <path d="M10.5 10.5a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963 5.23 5.23 0 0 0-3.434-1.279h-1.875a.375.375 0 0 1-.375-.375V10.5Z" />
                                    </svg>
                                </div>
                            </CustomTooltip>
                        )}

                        {onSiteAnalytics && (
                            <CustomTooltip text="Site Analytics">
                                <div className="cursor-pointer p-1" onClick={() => onSiteAnalytics(data)} onContextMenu={(e) => { e.preventDefault(); onSiteAnalytics(data, 'newTab'); }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                                        <circle cx="12" cy="10" r="1.6" />
                                        <path d="M11 12h2l1.6 8h-5.2L11 12z" />
                                        <path d="M7.8 9.5a5 5 0 0 0 0 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                        <path d="M5.5 8a8 8 0 0 0 0 9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                        <path d="M16.2 9.5a5 5 0 0 1 0 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                        <path d="M18.5 8a8 8 0 0 1 0 9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                    </svg>
                                </div>
                            </CustomTooltip>
                        )}

                        {onCellAnalytics && (
                            <CustomTooltip text="Cell Analytics">
                                <div className="cursor-pointer p-1" onClick={() => onCellAnalytics(data)} onContextMenu={(e) => { e.preventDefault(); onCellAnalytics(data, 'newTab'); }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white">
                                        <path d="M12 6C8.6 6 5.4 7.5 3 9.9L12 19l9-9.1C18.6 7.5 15.4 6 12 6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </CustomTooltip>
                        )}

                        {onSiteProRules && (
                            <CustomTooltip text="Site Pro Rules">
                                <div className="cursor-pointer p-1" onClick={() => onSiteProRules(data)} onContextMenu={(e) => { e.preventDefault(); onSiteProRules(data, 'newTab'); }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                                        <circle cx="12" cy="10" r="1.6" />
                                        <path d="M11 12h2l1.6 8h-5.2L11 12z" />
                                        <path d="M7.8 9.5a5 5 0 0 0 0 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                        <path d="M5.5 8a8 8 0 0 0 0 9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                        <path d="M16.2 9.5a5 5 0 0 1 0 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                        <path d="M18.5 8a8 8 0 0 1 0 9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                        <path d="M20.2 2v4.2M18.2 4.1h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </div>
                            </CustomTooltip>
                        )}

                        {onCellProRules && (
                            <CustomTooltip text="Cell Pro Rules">
                                <div className="cursor-pointer p-1" onClick={() => onCellProRules(data)} onContextMenu={(e) => { e.preventDefault(); onCellProRules(data, 'newTab'); }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white">
                                        <path d="M12 6C8.6 6 5.4 7.5 3 9.9L12 19l9-9.1C18.6 7.5 15.4 6 12 6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                                        <path d="M20.2 2v4.2M18.2 4.1h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </div>
                            </CustomTooltip>
                        )}

                        {(onChartClick || onChartRightClick) && (
                            <CustomTooltip text="Chart">
                                <div className="cursor-pointer p-1" onClick={() => onChartClick?.(data)} onContextMenu={(e) => { e.preventDefault(); onChartRightClick?.(data); }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                                        <path fillRule="evenodd" d="M2.25 13.5a8.25 8.25 0 0 1 8.25-8.25.75.75 0 0 1 .75.75v6.75H18a.75.75 0 0 1 .75.75 8.25 8.25 0 0 1-16.5 0Z" clipRule="evenodd" />
                                        <path fillRule="evenodd" d="M12.75 3a.75.75 0 0 1 .75-.75 8.25 8.25 0 0 1 8.25 8.25.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75V3Z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </CustomTooltip>
                        )}

                    </div>

                    {/* Close — far right */}
                    <div className="flex-shrink-0 pl-2 ml-1 border-l border-white/30">
                        <CustomTooltip text="Close">
                            <div className="cursor-pointer p-1" onClick={onClose}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </CustomTooltip>
                    </div>
                </div>

                {/* ── Data Table ── */}
                <div className="overflow-auto" style={{ maxHeight: 320, borderRadius: '0 0 12px 12px' }}>
                    <table className="w-full text-xs">
                        <tbody>
                            {Object.entries(data).map(([key, val], idx) => (
                                <tr key={key} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                    <td className="px-3 py-1.5 text-slate-500 font-medium border-b border-slate-100 whitespace-nowrap">{key}</td>
                                    <td className="px-3 py-1.5 text-slate-800 border-b border-slate-100 break-all">{val ?? '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </Dragger>
    );
};

export default CellInfoPopup;

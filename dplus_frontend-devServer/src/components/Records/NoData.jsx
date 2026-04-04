export default function NoData() {
  return (
    <div className="flex items-center gap-4 text-gray-500 text-sm">
      <div className="rounded-full bg-gray-100 p-2 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.362 5.214A8.25 8.25 0 014.636 15.94M6.75 9h.008v.008H6.75V9zm6.492 6.492l4.266 4.266"
          />
        </svg>
      </div>

      <p>No Record Found.</p>
    </div>
  );
}

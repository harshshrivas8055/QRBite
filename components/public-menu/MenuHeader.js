export default function MenuHeader({ restaurant, table, theme }) {
  return (
    <div className={theme.header}>
      {/* Cover image */}
      {restaurant.coverImage && (
        <div className="h-36 overflow-hidden relative">
          <img
            src={restaurant.coverImage}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}

      {/* Restaurant info */}
      <div className="px-4 py-5 flex items-center gap-4">
        {restaurant.logo && (
          <img
            src={restaurant.logo}
            alt="logo"
            className="h-14 w-14 rounded-xl object-cover border-2 border-white/30 flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <h1 className={`text-xl font-bold truncate ${theme.headerText}`}>
            {restaurant.name}
          </h1>
          <p className={`text-sm ${theme.headerSubtext}`}>
            Table {table.tableNumber}
          </p>
          {restaurant.description && (
            <p className={`text-xs mt-0.5 truncate ${theme.headerSubtext}`}>
              {restaurant.description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
interface SidebarNavProps {
  onScrollTo: (id: string) => void;
}

export const SidebarNav = ({ onScrollTo }: SidebarNavProps) => {
  const navItems = [
    { id: "administrative", label: "I. Hành chính" },
    { id: "patientManagement", label: "II. Quản lý người bệnh" },
    { id: "diagnosis", label: "III. Chẩn đoán" },
    { id: "discharge", label: "IV. Tình trạng ra viện" },
    { id: "reason", label: "A. Bệnh Án" },
    { id: "documents", label: "📂 Tài liệu đính kèm", isSpecial: true },
  ];

  return (
    <aside className="hidden lg:block w-64 flex-shrink-0 print-hide">
      <div className="sticky top-24 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 className="font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
          Mục Lục
        </h3>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onScrollTo(item.id)}
              className={`w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition truncate ${
                item.isSpecial ? "font-medium mt-2 pt-2 border-t border-gray-100" : ""
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

// components/admin/StatCard.tsx
interface StatCardProps {
    title: string;
    value: number;
    subtitle?: string;
}

const StatCard = ({ title, value, subtitle }: StatCardProps) => (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
        <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
        <p className="text-3xl font-bold text-[#B89369]">{value.toLocaleString()}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
);

export default StatCard;

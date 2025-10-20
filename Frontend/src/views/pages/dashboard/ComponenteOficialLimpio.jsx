import React from "react";

function MetricCard({ title, total, icon: Icon, color }) {
  return (
    <div className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl p-6 w-full h-full text-center border border-gray-200">
      <div className="flex justify-center items-center mb-3">
        {Icon && (
          <div className={`p-3 rounded-full bg-${color}-100`}>
            <Icon className={`w-10 h-10 text-${color}-600`} />
          </div>
        )}
      </div>

      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>

      <p className={`text-5xl font-extrabold text-${color}-700 mt-2`}>
        {total}
      </p>

      <span className="text-xs text-gray-500 mt-3 block italic">
      
      </span>
    </div>
  );
}

export default MetricCard;

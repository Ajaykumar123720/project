import React from 'react';

const StatCard: React.FC<{ title: string; value: string }> = ({ title, value }) => (
  <div className="bg-gradient-to-br from-[#FF7F11] to-[#D72638] rounded-lg p-6 text-white text-center shadow-lg">
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="text-4xl font-bold mt-2">{value}</p>
  </div>
);

const Admin: React.FC = () => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-6 md:p-10 shadow-lg backdrop-blur-md max-w-2xl mx-auto animate-fadeIn">
      <h2 className="text-3xl font-bold text-white mb-8">🛠 Admin Dashboard</h2>
      <div className="space-y-6">
        <StatCard title="Users Registered" value="1,204" />
        <StatCard title="Quizzes Completed" value="3,560" />
        <div className="pt-4">
          <button className="w-full px-6 py-3 bg-[#D72638] text-white font-bold rounded-full hover:bg-[#a4141f] transition-colors transform hover:scale-105">
            Delete Inactive Users
          </button>
        </div>
      </div>
    </div>
  );
};

export default Admin;

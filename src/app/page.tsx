export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-sm border border-mint-200">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-forest-900 text-white mb-6 text-2xl font-bold">
          SC
        </div>
        <h1 className="text-2xl font-bold text-forest-900 mb-2">SaharaCare MVP</h1>
        <p className="text-sm text-forest-700 mb-6">
          Patient Medication & Caregiver Monitoring Platform
        </p>
        <div className="p-4 bg-mint-100 rounded-xl text-forest-800 text-sm mb-6 border border-mint-300">
          Stage 1 Foundation Successfully Initialized
        </div>
        <p className="text-xs text-gray-500">
          Codefest Hackathon Build · Asian/Kathmandu Timezone
        </p>
      </div>
    </main>
  );
}

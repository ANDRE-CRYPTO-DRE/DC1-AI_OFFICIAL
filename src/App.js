import DCSidebar from './DCSidebar'; // Adjust path if needed

function App() {
  return (
    <div className="flex">
      <DCSidebar />
      <main className="flex-1 bg-gray-900 h-screen">
        {/* This is where your chat content goes */}
      </main>
    </div>
  );
}

export default App;
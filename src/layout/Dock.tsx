export default function Dock() {
  return (
    <div className="dock sm:hidden">
      <button>
        <span className="dock-label">Home</span>
      </button>

      <button className="dock-active">
        <span className="dock-label">Inbox</span>
      </button>

      <button>
        <span className="dock-label">Settings</span>
      </button>
    </div>
  );
}

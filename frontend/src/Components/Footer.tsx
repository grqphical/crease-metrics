export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-6 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm">
          Data Sourced from{" "}
          <a
            href="https://moneypuck.com"
            className="hover:text-white transition"
          >
            MoneyPuck
          </a>
        </p>
        <div className="flex gap-6 text-sm">
          <a href="#" className="hover:text-white transition">
            Terms of Service
          </a>
          <a href="#" className="hover:text-white transition">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}

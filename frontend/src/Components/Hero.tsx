import { NavLink } from "react-router";

function Hero() {
  return (
    <>
      <section className="bg-gray-900 text-white flex items-center justify-center px-6 grow">
        <div className="max-w-2xl text-center">
          <h1 className="text-5xl font-bold mb-4">
            NHL Goaltending Analytics{" "}
            <span className="text-blue-600">No other BS</span>
          </h1>
          <p className="text-lg mb-6 text-gray-300"></p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <NavLink
              to="/goalies"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition cursor-pointer"
            >
              View The Stats
            </NavLink>
            <NavLink
              to="/playground"
              className="bg-white text-gray-900 px-6 py-3 rounded-xl hover:bg-gray-200 transition cursor-pointer"
            >
              Use our Models
            </NavLink>
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero;

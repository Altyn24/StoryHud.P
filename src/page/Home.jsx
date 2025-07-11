import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="container mx-auto p-4 border-1 border-gray-300 rounded-xl max-w-screen justify-items-center">
      <p className="text-lg">
        Это место, где вы можете делиться своими историями и вдохновлять других.
      </p>
      <Link
        to="/create"
        className="mt-4 inline-block bg-black text-white px-4 py-2 rounded"
      >
        Написать историю
      </Link>
    </main>
  );
}

export default Home;

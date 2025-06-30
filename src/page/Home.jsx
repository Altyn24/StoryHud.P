function Home() {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">Добро пожаловать на StoryHub</h2>
      <p className="text-lg">Это место, где вы можете делиться своими историями и вдохновлять других.</p>
      <a href="/create-post" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Написать историю
      </a>
    </div>
  );
}

export default Home;

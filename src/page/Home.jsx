import { useState } from "react";

function Home() {
  // const [content, setContent] = useState("");


  const content = ["Новые", "Популярные", "Обновление"];

  return (
    <main className="container mx-auto p-4 rounded-xl max-w-screen">
      <div className="justify-items-start max-w-screen">
        <ul className="flex gap-5 border-b-1 border-gray-300 p-2 w-full">
          {content.map((item) => (
            <li className="cursor-pointer hover:text-[#13af4f]">{item}</li>
          ))}
        </ul>
      </div>
      <div className="justify-items-center">
        <p className="text-lg">
          Это место, где вы можете делиться своими историями и вдохновлять
          других.
        </p>
      </div>
    </main>
  );
}

export default Home;
import Header from "@/components/Header";
import TodoList from "@/components/TodoList";

export default function Home() {
  return (
    <div className="bg-black">
      <Header />
      <div className="border-b"></div>
      <TodoList />
    </div>
  );
}

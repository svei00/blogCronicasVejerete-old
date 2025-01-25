import CallToAction from "../components/CallToAction";

export default function Projects() {
  return (
    <div className="min-h-screen max-w-2xl mx-auto flex justify-center items-center flex-col gap-6 p-3">
      <h1 className="text-3xl font-semibold ">Proyectos</h1>
      <p className="text-md text-gray-500">
        ¡Libera tu potencial con Excel SolutionsV! Sumérgete en proyectos
        interesantes que te ayudarán a dominar Microsoft Excel mientras
        resuelves problemas del mundo real. Desde consejos básicos hasta
        técnicas avanzadas, hacemos que aprender Excel sea interactivo, práctico
        y divertido. Transforma tus habilidades y desbloquea un mundo de
        posibilidades con cada fórmula, gráfica y macroa.
      </p>
      <CallToAction />
    </div>
  );
}

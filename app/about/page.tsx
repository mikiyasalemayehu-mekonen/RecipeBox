export default function AboutPage() {
  return (
    <div className="flex-1 w-full py-16">
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-text-primary">About RecipeBox</h1>
        <p className="text-text-secondary leading-relaxed mb-4">
          RecipeBox is a simple place for you to collect, organize, and cook your favorite recipes.
          Save the meals you love, explore new ideas, and keep everything in one easy-to-use app.
        </p>
        <p className="text-text-secondary leading-relaxed mb-8">
          This project is created and maintained by <span className="font-semibold">Miki</span>.
          If you have feedback, feature ideas, or questions, feel free to reach out.
        </p>
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-xl font-semibold mb-3 text-text-primary">Contact</h2>
          <p className="text-text-secondary">
            You can contact me anytime at:{" "}
            <a
              href="mailto:mikiyealme@gmail.com"
              className="text-primary font-medium hover:underline"
            >
              mikiyealme@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export function About() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div>
          <h1 className="text-3xl font font-semibold text-center my-7">
            About Echoes!
          </h1>
          <div className="text-md text-gray-300 flex flex-col gap-6">
            <p>
              Welcome to Echoes, a space where ideas, stories, and knowledge
              come together. This platform allows users to create, share, and
              interact with blog posts across different categories.
            </p>

            <p>
              Echoes is a full-stack blogging platform designed with
              scalability, performance, and clean architecture in mind.This
              project reflects my focus on building production-ready
              applications using modern technologies.
            </p>

            <h3>Key Features :-</h3>

            <ul className="list-disc pl-6 space-y-1">
              <li>User authentication & authorization</li>
              <li>Create, edit, and delete posts</li>
              <li>Comment and like system (REST API)</li>
              <li>Search and filter functionality</li>
              <li>Admin dashboard with analytics</li>
              <li>Responsive UI</li>
            </ul>

            <h3>Tech Stacks :-</h3>

            <ul className="list-disc pl-6 space-y-1">
              <li>React & TypeScript</li>
              <li>Redux Toolkit</li>
              <li>Express.js (REST API)</li>
              <li>Prisma ORM</li>
              <li>MongoDB Database</li>
              <li>TailwindCSS & Flowbite UI</li>
            </ul>

            <p>
              Echoes is continuously evolving as I implement scalable patterns,
              optimize performance, and explore advanced system design concepts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

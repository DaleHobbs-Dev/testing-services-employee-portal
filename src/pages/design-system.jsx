export default function DesignSystem() {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-100">
      <h1 className="h1">Design System — Deep Purple + Mint</h1>

      {/* Colors */}
      <section className="mb-12">
        <h2 className="h2">Color Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Purple Shades */}
          <div className="p-4 rounded-xl bg-purple-900 text-white">
            Purple 900
          </div>
          <div className="p-4 rounded-xl bg-purple-700 text-white">
            Purple 700
          </div>
          <div className="p-4 rounded-xl bg-purple-500 text-white">
            Purple 500
          </div>
          <div className="p-4 rounded-xl bg-purple-300 text-gray-900">
            Purple 300
          </div>
          <div className="p-4 rounded-xl bg-purple-100 text-gray-900">
            Purple 100
          </div>

          {/* Mint */}
          <div className="p-4 rounded-xl bg-mint-900 text-white">Mint 900</div>
          <div className="p-4 rounded-xl bg-mint-700 text-white">Mint 700</div>
          <div className="p-4 rounded-xl bg-mint-500 text-white">Mint 500</div>
          <div className="p-4 rounded-xl bg-mint-300 text-gray-900">
            Mint 300
          </div>
          <div className="p-4 rounded-xl bg-mint-100 text-gray-900">
            Mint 100
          </div>
        </div>
      </section>

      {/* Buttons */}
      <section className="mb-12">
        <h2 className="h2">Buttons</h2>
        <div className="flex gap-4">
          <button className="btn btn-primary">Primary</button>
          <button className="btn btn-accent">Accent</button>
          <button className="btn btn-outline">Outline</button>
          <button className="btn btn-danger">Danger</button>
        </div>
      </section>

      {/* Inputs */}
      <section className="mb-12">
        <h2 className="h2">Form Inputs</h2>
        <div className="space-y-4">
          <input className="form-input" placeholder="Text input" />
          <input className="form-input" placeholder="Another input…" />
        </div>
      </section>

      {/* Cards */}
      <section className="mb-12">
        <h2 className="h2">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="h2">Card Title</h3>
            <p>
              A simple example of a card component using your themed colors and
              Tailwind utilities.
            </p>
          </div>

          <div className="card bg-mint-300 text-purple-700">
            <h3 className="h2">Accent Card</h3>
            <p>
              This card uses the mint accent background with deep purple text.
            </p>
          </div>
        </div>
      </section>

      {/* Alerts */}
      <section className="mb-12">
        <h2 className="h2">Alerts</h2>
        <div className="space-y-4">
          <div className="alert alert-info">This is an info alert.</div>
          <div className="alert alert-success">Success! Everything worked.</div>
          <div className="alert alert-warning">Warning! Be careful.</div>
          <div className="alert alert-danger">Error! Something went wrong.</div>
        </div>
      </section>

      {/* Status Colors Demo */}
      <section className="mb-12">
        <h2 className="h2">Status Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-danger-500 text-white">Danger</div>
          <div className="p-4 rounded-xl bg-warning-500 text-gray-900">
            Warning
          </div>
          <div className="p-4 rounded-xl bg-success-500 text-white">
            Success
          </div>
          <div className="p-4 rounded-xl bg-info-500 text-white">Info</div>
        </div>
      </section>
    </div>
  );
}

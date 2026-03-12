export default function Entities({ entities = [] }) {

  const filtered = entities.filter(e =>
    ["PERSON", "ORG", "LOCATION", "DATE"].includes(e.label)
  )

  return (

    <div className="bg-white shadow rounded p-4 mt-6">

      <h3 className="font-semibold mb-3">
        Named Entities
      </h3>

      <div className="flex flex-wrap gap-2">

        {filtered.map((e, i) => (

          <span
            key={i}
            className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded text-sm"
          >
            {e.text} ({e.label})
          </span>

        ))}

      </div>

    </div>

  )
}
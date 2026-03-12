import { useParams } from "react-router-dom"
import { useState } from "react"
import { analyzeDocument } from "../api/api"

import Loader from "../components/Loader"
import Entities from "../components/Entities"
import RiskChart from "../components/RiskChart"
import DocumentChatbot from "../components/DocumentChatbot"
import GeneralChatbot from "../components/GeneralChatbot"

import MainLayout from "../layout/MainLayout"

export default function AnalysisPage() {

  const { docId } = useParams()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const runAnalysis = async () => {

    try {

      setLoading(true)

      const res = await analyzeDocument(docId)

      setData(res)

    } catch (err) {

      console.error(err)
      alert("Analysis failed")

    } finally {

      setLoading(false)

    }

  }

  return (

    <MainLayout>

      <h1 className="text-2xl font-bold mb-6">
        Document Analysis
      </h1>

      <button
        onClick={runAnalysis}
        className="bg-indigo-600 text-white px-4 py-2 rounded mb-6"
      >
        Analyze Document
      </button>

      {loading && <Loader />}

      {data && (

        <div className="space-y-6 overflow-y-auto max-h-[70vh] pr-3">

          {/* Document Type */}

          <div className="bg-white p-6 rounded shadow">

            <h3 className="font-semibold mb-2">
              Document Type
            </h3>

            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded">

              {data.document_type}

            </span>

          </div>


          {/* Summary + Risk */}

          <div className="grid grid-cols-2 gap-6">

            <div className="bg-white p-6 rounded shadow">

              <h3 className="font-semibold mb-2">
                Summary
              </h3>

              <p className="text-gray-700">
                {data.summary}
              </p>

            </div>

            <div className="bg-white p-6 rounded shadow flex justify-center">

              <RiskChart level={data.risk_level} />

            </div>

          </div>


          {/* Acts */}

          <div className="bg-white p-6 rounded shadow">

            <h3 className="font-semibold mb-3">
              Acts and Sections
            </h3>

            {data.acts && data.acts.map((a, i) => (

              <p key={i}>
                {a.act} - Section {a.section}
              </p>

            ))}

          </div>


          {/* Entities */}

          <Entities entities={data.entities || []} />

        </div>

      )}

      {/* Chatbots */}

      <DocumentChatbot docId={docId} />
      <GeneralChatbot />

    </MainLayout>

  )
}